import '../static/css/pages/mainPage.css'

import FlatterPage from "../sections/flatterPage";

import * as settings from '../settings';
import MainPageCarousel from '../components/mainPage/mainPageCarousel';
import MainPageSearchForm from '../components/mainPage/mainPageSearchForm';

const MainPage = () => {

    const livings = [
        {
            user: {
                firstName: "Juan",
                lastName: "Perez",
                profilePicture: `${settings.API_SERVER_MEDIA}users/images/default.jpg`
            },
            image: require("../static/files/images/sample-2.jpg"),
        },
        {
            user: {
                firstName: "Alberto",
                lastName: "Jiménez",
                profilePicture: `${settings.API_SERVER_MEDIA}users/images/default.jpg`
            },
            image: require("../static/files/images/sample-4.jpg"),
        },
        {
            user: {
                firstName: "Lucía",
                lastName: "Gil",
                profilePicture: `${settings.API_SERVER_MEDIA}users/images/default.jpg`
            },
            image: require("../static/files/images/sample-7.jpg"),
        },
        {
            user: {
                firstName: "María",
                lastName: "Olmedo",
                profilePicture: `${settings.API_SERVER_MEDIA}users/images/default.jpg`
            },
            image: require("../static/files/images/sample-8.jpg"),
        },
        {
            user: {
                firstName: "Alfonso",
                lastName: "Lechuga",
                profilePicture: `${settings.API_SERVER_MEDIA}users/images/default.jpg`
            },
            image: require("../static/files/images/sample-10.jpg"),
        },
    ]

    return (
        <FlatterPage withBackground userLogged>
            <MainPageCarousel items={livings}></MainPageCarousel>
            <MainPageSearchForm/>
        </FlatterPage>
    );
}

export default MainPage;