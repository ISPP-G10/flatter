import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../components/profile/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";
import ReviewsBox from "../components/profile/reviewsBox";
import {useQuery} from '@apollo/client';
import usersAPI from '../api/usersAPI';
import { useParams } from "react-router-dom";
import { API_SERVER_MEDIA } from "../settings";
import { useEffect, useState } from "react";
import customAlert from "../libs/functions/customAlert";
import socialLib from "../libs/socialLib";

const PublicProfile = (props) => {

    let username = useParams().username;
    let userToken = localStorage.getItem("token", '');

    if (username === undefined){
        username = localStorage.getItem("user");
    }

    let [averageRating, setAverageRating] = useState(0);
    let [totalRatings, setTotalRatings] = useState(0);

    const {data, loading, refetch} = useQuery(usersAPI.getPublicProfileByUsername, {variables: {
        username: username,
        userToken: userToken
    }});

    const {data: contractData, loading: contractLoading} = useQuery(usersAPI.getContractByUsername, {variables: {
        username: localStorage.getItem("user"),
        userToken: userToken
    }});

    useEffect(() => {
        const date = new Date();
        let contract_limit = localStorage.getItem("contract_limit", null);
        let contract_date = localStorage.getItem("contract_date", null);
        let contract_user = localStorage.getItem("contract_user", null);
        if (contract_user === null) {
            localStorage.setItem("contract_user", username);
        }
        contract_user = localStorage.getItem("contract_user", null);
        if (contract_user !== localStorage.getItem("user", '')) {
            localStorage.setItem("contract_limit", contractData.getContractByUsername.plan.visitsNumber);
            localStorage.setItem("contract_date", socialLib.getDateToString(date));
        }
        if (contract_limit === null) {
            localStorage.setItem("contract_limit", contractData.getContractByUsername.plan.visitsNumber);
        }
        if (contract_date === null) {
            localStorage.setItem("contract_date", socialLib.getDateToString(date));
        }
        contract_limit = localStorage.getItem("contract_limit", null);
        if(contract_date !== socialLib.getDateToString(date)){
            localStorage.setItem("contract_date", socialLib.getDateToString(date));
            localStorage.setItem("contract_limit", contractData.getContractByUsername.plan.visitsNumber);
        }
        if (localStorage.getItem('user', '')!==username){
            if (contract_limit < 1){
                navigator("/");
                customAlert("Has superado el límite de visitas al perfil de tu plan", "warning");
            }
            localStorage.setItem("contract_limit", contract_limit-1);
        }

    }, [])

    useEffect (() => {
        if (!loading){
            setAverageRating(profile.averageRating);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, loading])

    function getTotalRatings(reviews){
        let total_ratings = 0
        for (let review of reviews){
            if (review.rating !== null) {
                total_ratings += 1
            }
        }
        return total_ratings
    }

    if(loading || contractLoading) return <FlatterPage withBackground userLogged withAds={false}><div className="profile-grid"><h1>Cargando...</h1></div></FlatterPage>

    const profile = data.getUserByUsername;
    const canSeeSelfComments = data.getContractByUsername.plan.viewSelfProfileOpinions;
    const canCreateChats = contractData.getContractByUsername.plan.chatCreation;

    let roles = profile.roles.map((role) => role.role);

    return(
        <FlatterPage withBackground userLogged withAds={false}>
            <div className="profile-grid">
                <PublicProfileCard 
                    username={username} 
                    name={profile.firstName+" "+profile.lastName} 
                    birthDate={profile.birthday} 
                    job={profile.profession} 
                    age={profile.age} 
                    bio={profile.biography} 
                    isMe={username===localStorage.getItem("user")} 
                    isPropietary={roles.includes("OWNER")} 
                    tags={profile.tags} 
                    pic={API_SERVER_MEDIA+profile.profilePicture}
                    refetchUser = {refetch}
                    setActivateChat={props.setActivateChat}
                    canCreateChats={canCreateChats}
                />
                <ReviewsBox average={averageRating} total={totalRatings} />
                <CommentsBox comments={profile.valuedReviews} username={username} setAverageRating={setAverageRating} setTotalRatings={setTotalRatings} getTotalRatings={getTotalRatings} canSeeSelfComments={canSeeSelfComments} isMe={username===localStorage.getItem("user")}/>
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;