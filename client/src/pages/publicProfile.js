import '../static/css/pages/publicProfile.css';

import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../sections/commentsBox";
import PublicProfileCard from "../components/profile/publicProfileCard";

const PublicProfile = () => {

    return(
        <FlatterPage withBackground userLogged>
            <div style={{marginTop: "5%"}}>
                <section id="profileCard">
                    <PublicProfileCard/>
                </section> 
                <section id="commentsBox">
                    <CommentsBox />
                </section>
            </div>
        </FlatterPage>
    );
} 

export default PublicProfile;