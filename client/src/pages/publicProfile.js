import FlatterPage from "../sections/flatterPage";
import PublicProfileCard from "../components/publicProfileCard";

import '../static/css/publicProfile.css'

const PublicProfile = () => {

    return(
        <FlatterPage withBackground>
           <section id="profileCard">
                <PublicProfileCard/>
            </section> 
        </FlatterPage>
    );
} 

export default PublicProfile;