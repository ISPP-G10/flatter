import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import FlatterPage from "../sections/flatterPage";
import { useEffect, useState } from "react";
import UserCard from "../components/users/userCards";

const RecommendedUsers = () => {

    let [users, setUsers] = useState([]);
    const {data, loading} = useQuery(usersAPI.getRecomendedUsers, {
        variables: {
            username: localStorage.getItem('user')
        }
    });

    useEffect(() => {
        if(!loading && data){
            console.log(data)
            setUsers(data.getUsersRecommendations);
        }
    }, [data, loading]);

    return (
        <FlatterPage withBackground userLogged>
        <div>
            <h1 className="properties-title">Usuarios recomendados</h1>
        </div>
        <section className="site-content-sidebar properties"  style={{maxWidth: '100%'}}>
            <div className="content">
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