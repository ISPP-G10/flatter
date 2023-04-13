import '../static/css/pages/mainPage.css'

import FlatterPage from "../sections/flatterPage";
import MainPageCarousel from '../components/mainPage/mainPageCarousel';
import MainPageSearchForm from '../components/mainPage/mainPageSearchForm';
import propertiesAPI from '../api/propertiesAPI';

import { useQuery } from '@apollo/client';

const MainPage = () => {

    let userToken = localStorage.getItem("token", '');

    const {loading, data} = useQuery(propertiesAPI.getOutstandingProperties, {
        variables: {userToken: userToken},
    });

    return (
        <FlatterPage withAds withBackground userLogged>
            {
                loading ? 
                    <div className='carrousel-container'>Loading...</div>
                :
                    <MainPageCarousel items={data.getOutstandingProperties}></MainPageCarousel>
            }
            <MainPageSearchForm/>
        </FlatterPage>
    );
}

export default MainPage;