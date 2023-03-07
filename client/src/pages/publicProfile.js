import FlatterPage from "../sections/flatterPage";
import CommentsBox from "../sections/commentsBox";
import PublicProfileCard from "../components/publicProfileCard";

import '../static/css/publicProfile.css'

const PublicProfile = () => {

    return(
        <FlatterPage>
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