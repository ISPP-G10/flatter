import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import FlatterPage from "../sections/flatterPage";
import { useEffect, useState } from "react";
import UserCard from "../components/users/userCards";
import customAlert from "../libs/functions/customAlert";

const RecommendedUsers = () => {

    let [users, setUsers] = useState([]);
    let userToken = localStorage.getItem("token", '');
    const {data, loading} = useQuery(usersAPI.getRecomendedUsers, {
        variables: {
            username: localStorage.getItem('user'),
            userToken: userToken
        },
        onError: (error) => {
            customAlert("No se han encontrado recomendaciones");
        }
    });

    useEffect(() => {
        if(!loading && data){
            setUsers(data.getUsersRecommendations);
        }
    }, [data, loading]);

    return (
        <FlatterPage withBackground userLogged>
        <div>
            <h1 className="properties-title">Usuarios recomendados</h1>
        </div>
        <section className="site-content-sidebar properties"  style={{maxWidth: '90%'}}>
            <div className="content" style={{paddingLeft: '0'}}>
                {
                    users.length >0 && users.map((user) => {
                        return(
                            <UserCard user={user} key={user.id}/>
                        );
                    })
                }
            </div>
        </section>
            
        </FlatterPage>
    );
};

export default RecommendedUsers;