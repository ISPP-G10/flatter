import "../static/css/pages/listProperties.css";

import FlatterPage from "../sections/flatterPage";
import useURLQuery from "../hooks/useURLQuery";
import { useState, useEffect, useRef } from "react";
import { filterInputs } from "../forms/filterUsersForm";
import {useNavigate} from 'react-router-dom';
import {useApolloClient} from '@apollo/client';
import usersAPI from "../api/usersAPI";
import UserCard from "../components/users/userCards";
import FlatterForm from "../components/forms/flatterForm";
import SolidButton from "../sections/solidButton";
import customAlert from "../libs/functions/customAlert";
import Pagination from "../components/pagination";

const SearchUsers = () => {

  const query = useURLQuery();
  const navigator = useNavigate();
  const client = useApolloClient();
  const filterFormRef = useRef(null);

  let [filterValues, setFilterValues] = useState({
    min: parseInt(query.get("min")),
    max: parseInt(query.get("max")),
    tag: query.get("tag") ?? '',
    owner: query.get("owner") ? (query.get("owner") === 'true' ? true : false) : null,
  });

  function handleFilterForm({values}) {

    if(!filterFormRef.current.validate()) return;

    setFilterValues({
        min: values.min_rating,
        max: values.max_rating,
        tag: values.tag,
        owner: values.role === 'Propietario' ? true : values.role === 'Inquilino' ? false : null
    });

  }

  useEffect(() => {

    filterInputs.forEach((input) => {
        if(input.name === 'price'){
            input.min = isNaN(filterValues.min) ? 0 : filterValues.min;
            input.max = isNaN(filterValues.max) ? 5 : filterValues.max;
        }
        if(input.name === 'tag') input.defaultValue = filterValues.tag ?? '';
    })

    paginationRef.current.reset();

    //eslint-disable-next-line
  }, [filterValues]);


  const handlePagination = (pageIndex, resultsPerPage) => {

    return client.query({
      query: usersAPI.filteredUsersByTagAndReview,
      variables: {
        username: localStorage.getItem('user'),
        tag: filterValues.tag,
        owner: filterValues.owner,
        pageNumber: pageIndex,
        pageSize: resultsPerPage
      }
    })
    .then((response) => {
        let responseUsers = response.data.getFilteredUsersByTagAndReview.flatterUsers;
        let minValue = isNaN(filterValues.min) ? 0 : filterValues.min;
        let maxValue = isNaN(filterValues.max) ? 5 : filterValues.max;
        setCurrentPageData(responseUsers.filter((user) => user.averageRating >= minValue && user.averageRating <= maxValue))

        return {
          next: response.data.getFilteredUsersByTagAndReview.hasNext,
          prev: response.data.getFilteredUsersByTagAndReview.hasPrevious
        }
    })
    .catch((error) => customAlert("No hay usuarios que coincidan con la búsqueda"));
  }

  const paginationRef = useRef(null);

  const [currentPageData, setCurrentPageData] = useState([]);

  useEffect(() => {
    paginationRef.current.handle();
  }, [paginationRef])

  return (
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

          <Pagination ref = {paginationRef} queryCallback = {handlePagination} resultsPerPage = {10} />
        </div>
      </section>
          
    </FlatterPage>
  );
};

export default SearchUsers;