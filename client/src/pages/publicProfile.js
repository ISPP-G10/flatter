import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../components/profile/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";
import ReviewsBox from "../components/profile/reviewsBox";
import {useQuery} from '@apollo/client';
import usersAPI from '../api/usersAPI';
import { useParams } from "react-router-dom";
import { API_SERVER_MEDIA } from "../settings";
import { useEffect, useState } from "react";

const PublicProfile = () => {

    let username = useParams().username;

    if (username === undefined){
        username = localStorage.getItem("user");
    }

    let [averageRating, setAverageRating] = useState(0);
    let [totalRatings, setTotalRatings] = useState(0);

    const {data, loading} = useQuery(usersAPI.getPublicProfileByUsername, {variables: {
        username: username
    }});

    useEffect (() => {
        if (!loading){
            setAverageRating(profile.averageRating);
        }
    }, [data])

    function getTotalRatings(reviews){
        let total_ratings = 0
        for (let review of reviews){
            if (review.rating !== null) {
                total_ratings += 1
            }
        }
        return total_ratings
    }

    if(loading) return <FlatterPage withBackground><div className="profile-grid"><h1>Cargando...</h1></div></FlatterPage>

    const profile = data.getUserByUsername;

    let roles = profile.roles.map((role) => role.role);

    return(
        <FlatterPage withBackground userLogged>
            <div className="profile-grid">
                <PublicProfileCard name={profile.firstName+" "+profile.lastName} job={profile.profession} age={profile.birthday} bio={profile.biography} isMe={username===localStorage.getItem("user")} isPropietary={roles.includes("OWNER")} tags={profile.tags} pic={API_SERVER_MEDIA+profile.profilePicture}/>
                <ReviewsBox average={averageRating} total={totalRatings} />
                <CommentsBox comments={profile.valuedReviews} username={username} setAverageRating={setAverageRating} setTotalRatings={setTotalRatings} getTotalRatings={getTotalRatings} />
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;