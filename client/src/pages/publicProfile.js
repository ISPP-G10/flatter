import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../components/profile/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";
import ReviewsBox from "../components/profile/reviewsBox";

const PublicProfile = () => {

    return(
        <FlatterPage withBackground userLogged>
            <div className="profile-grid">
                <PublicProfileCard name="Lucía Martín" job="Estudiante en Universidad de Sevilla" age={24} bio="Soy una estudiante a la que le pasárselo bien pero que también es responsable." isMe={true} isTenant={true}/>
                <ReviewsBox average={5} total={1} />
                <CommentsBox />
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;