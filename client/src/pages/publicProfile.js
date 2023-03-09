import '../static/css/pages/publicProfile.css';

import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../sections/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";

const PublicProfile = () => {

    return(
        <FlatterPage withBackground userLogged>
            <div className="profile-grid">
                <PublicProfileCard name="Lucía Martín" job="Estudiante en Universidad de Sevilla" age={24} bio="Soy una estudiante a la que le pasárselo bien pero que también es responsable." isMe={true} isTenant={true}/>
                <span>Pruebas</span>
                <CommentsBox />
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;