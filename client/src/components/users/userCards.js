import '../../static/css/components/userCard.css';
import * as settings from "../../settings";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {

    const navigate = useNavigate();

    return (
        <div className="user-card" onClick={() => navigate(`/profile/${user.username}`)}>
            <div className="user-card__avatar">
                <img src={settings.API_SERVER_MEDIA + user.profilePicture} alt="Avatar" />
            </div>
            <div className="user-card__info">
                <h3>{user.firstName + ' ' + user.lastName}</h3>
                <p>@{user.username}</p>
                <span>{user.profession}</span>
                <div className='average-rating-bubble'>
                    <span>{user.averageRating !== 0 ? user.averageRating : '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
