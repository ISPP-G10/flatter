import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../components/profile/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";
import ReviewsBox from "../components/profile/reviewsBox";
import {useQuery} from '@apollo/client';
import usersAPI from '../api/usersAPI';
import { useParams } from "react-router-dom";

const PublicProfile = () => {

    let username = useParams().username;

    const {data, loading} = useQuery(usersAPI.getUserByUsernameHeader, {variables: {
        username: username
    }});

    console.log(data);

    return(
        <FlatterPage withBackground userLogged>
            <div className="profile-grid">
                <PublicProfileCard name="Lucía Martín" job="Estudiante en Universidad de Sevilla" age={24} bio="Soy una estudiante a la que le pasárselo bien pero que también es responsable." isMe={true} isTenant={true}/>
                <ReviewsBox average={5} total={1} />
                <CommentsBox comments={[]}/>
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;