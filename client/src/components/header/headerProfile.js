import * as settings from '../../settings';

import PropTypes from "prop-types";

import {useQuery} from '@apollo/client';
import usersAPI from '../../api/usersAPI';

import FlatterCoinsCounter from '../flatterCoinsCounter';

const HeaderProfile = ({user}) => {

    const {data, loading} = useQuery(usersAPI.getUserByUsernameHeader, {variables: {
        username: user
    }});

    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/";
    }

    if (loading) return <p>Loading...</p>

    return(
        <>
            <div className="header-user-section" onClick={logout}>
                <div className="header-user-section__avatar">
                    <img src={`${settings.API_SERVER_MEDIA}${data.getUserByUsername.profilePicture}`} alt="Avatar"/>
                </div>
                <div className="header-user-section__data">
                    <p id="wrapped-name">{data.getUserByUsername.username.length > 10 ? data.getUserByUsername.username.substring(0, 10)+"…" : data.getUserByUsername.username}</p>
                    <p id="full-name">{data.getUserByUsername.username}</p>
                    <FlatterCoinsCounter height={20} iconWidth={15} amount={data.getUserByUsername.flatterCoins}/>
                </div>
                <div className="header-user-section__arrow">
                    <img src={require("../../static/files/icons/arrow-down.png")} alt="Opciones"/>
                </div>
            </div>
        </>
    );
}

HeaderProfile.propTypes = {
    user: PropTypes.string
}

HeaderProfile.defaultProps = {
    user: null
}

export default HeaderProfile;