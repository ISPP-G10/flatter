import '../../static/css/components/userCard.css';
import * as settings from "../../settings";
import { useNavigate } from "react-router-dom";
import Tag from '../tag';

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
                    <span>{user.averageRating !== 0 ? user.averageRating.toFixed(2) : '-'}</span>
                </div>
                <div className='tags-container'>
                        {
                            user.tags.length !== 0 ? (
                                user.tags.map((tag, i) => { 
                                    return(
                                        <Tag key={'tag-'+i} name={tag.name} color={tag.color} />
                                    )
                                })
                            ) : (
                                <></>
                            )
                        }
                    </div>
            </div>
        </div>
    );
};

export default UserCard;
