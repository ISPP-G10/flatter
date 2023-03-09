import '../static/css/pages/publicProfile.css';

import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../sections/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";

const PublicProfile = () => {

    return(
        <FlatterPage withBackground >
            <div class="profile-grid">
                <PublicProfileCard/>
                <span>Pruebas</span>
                <CommentsBox />
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;