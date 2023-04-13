import "../static/css/pages/listProperties.css";

import FlatterPage from "../sections/flatterPage";
import useURLQuery from "../hooks/useURLQuery";
import { useState, useEffect, useRef } from "react";
import { filterInputs } from "../forms/filterUsersForm";
import {useLocation, useNavigate} from 'react-router-dom';
import {useApolloClient, useQuery} from '@apollo/client';
import usersAPI from "../api/usersAPI";
import UserCard from "../components/users/userCards";
import FlatterForm from "../components/forms/flatterForm";
import SolidButton from "../sections/solidButton";
import customAlert from "../libs/functions/customAlert";
import tagsAPI from "../api/tagsAPI";

const SearchUsers = () => {

  const location = useLocation();
  const PAGE_SIZE = 5;

  const query = useURLQuery();
  const navigator = useNavigate();
  const client = useApolloClient();
  const filterFormRef = useRef(null);
  const {data: userTagsData, loading: userTagsLoading} = useQuery(tagsAPI.getTagsByType, {
    variables: {
        type: "U"
    }
  }); 

  let [paginationIndex, setPaginationIndex] = useState(query.get("page") && parseInt(query.get("page")) > 0 ? parseInt(query.get("page")) : 1);
  
  const [currentPageData, setCurrentPageData] = useState([]);
  const [numberOfFilteredProperties, setNumberOfFilteredProperties] = useState(0);

  let [filterValues, setFilterValues] = useState({
    min: parseInt(query.get("min")),
    max: parseInt(query.get("max")),
    tag: query.get("tag") ?? '',
    owner: query.get("owner") ? (query.get("owner") === 'true' ? true : false) : null,
  });

  let [users, setUsers] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const min = parseInt(searchParams.get("min")) || 0;
    const max = parseInt(searchParams.get("max")) || 5;
    const tag = searchParams.get("tag") || "";
    const owner = searchParams.get("owner")
      ? searchParams.get("owner") === "true"
        ? true
        : false
      : null;

    setFilterValues({ min, max, tag, owner });
  }, [location]);

  function handleFilterForm({values}) {

    if(!filterFormRef.current.validate()) return;

    setFilterValues({
        min: values.min_rating,
        max: values.max_rating,
        tag: values.tag === '-'? null : values.tag,
        owner: values.role === 'Propietario' ? true : values.role === 'Inquilino' ? false : null
    });

    setPaginationIndex(1);

  }

  useEffect(() => {

    filterInputs.forEach((input) => {
        if(input.name === 'price'){
            input.min = isNaN(filterValues.min) ? 0 : filterValues.min;
            input.max = isNaN(filterValues.max) ? 5 : filterValues.max;
        }
        if(input.name === 'tag') input.defaultValue = filterValues.tag ?? '';
    })

    //eslint-disable-next-line
  }, [filterValues]);

  useEffect(() => {
    client.query({
      query: usersAPI.filteredUsersByTagAndReview,
      variables: {
        username: localStorage.getItem("user"),
        tag: filterValues.tag,
        minRating: filterValues.min,
        maxRating: filterValues.max,
        owner: filterValues.owner,
        pageNumber: paginationIndex,
        pageSize: PAGE_SIZE
      }
    }).then(response => {
      setCurrentPageData(response.data.getFilteredUsersByTagAndReview.users);
      setNumberOfFilteredProperties(response.data.getFilteredUsersByTagAndReview.totalCount);
    }).catch(error => {
      console.log(error);
      customAlert("¡Ups! No se han encontrado usuarios que cumplan con estos requisitos");
    })
  }, [filterValues, paginationIndex]);
  
  
  useEffect(() => { 
    if (!userTagsLoading) { 
        filterInputs.map((input) => { 
            if(input.name === 'tag') { 
              const tagNames = userTagsData.getTagsByType.map(tag => tag.name);
              input.values = ['-'].concat(tagNames);            
            } 
        }) 
      }
    }, [userTagsLoading, userTagsData]);

    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Buscar a otros usuarios</h1>
      </div>
      <section className="site-content-sidebar properties">
        <div className="sidebar">
            <div className="card">
                <div className="filters">
                <h3>Filtrar por:</h3>

                <FlatterForm ref={filterFormRef} inputs={filterInputs} onSubmit={handleFilterForm} buttonText="Filtrar usuarios"/>
                </div>
            </div>
            <div style={{marginTop: '20px'}}>
                <SolidButton type="featured" text="Limpiar filtros" onClick={() => {
                navigator('/users?' + filterValues.owner)
                setFilterValues({
                    min: 0,
                    max: 5,
                    tag: '',
                })
                }}/>
            </div>
        </div>
        <div className="content">
            {
                currentPageData.length >0 && currentPageData.map((user) => {
                    return(
                        <UserCard user={user} key={user.id}/>
                    );
                })
            }
            <div className="pagination-container">
              <button onClick={() => setPaginationIndex(paginationIndex-1)} disabled={paginationIndex<=1}>Anterior</button>
              <span>{paginationIndex}</span>
              <button onClick={() => setPaginationIndex(paginationIndex+1)} disabled={paginationIndex*PAGE_SIZE>=numberOfFilteredProperties}>Siguiente</button>
            </div>
        </div>
      </section>
          
    </FlatterPage>
  );
};

export default SearchUsers;