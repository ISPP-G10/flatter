import "../../static/css/components/smallProfile.css";
import * as settings from "../../settings";

import { useNavigate } from "react-router-dom";

const SmallProfile = ({ user }) => {

  const navigate = useNavigate();

  return (
    <div className="small-profile" onClick={() => navigate(`/profile/${user.username}`)}>
      <img src={settings.API_SERVER_MEDIA + user.profilePicture} alt="avatar" />
      <div className="small-profile-details">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <h3>{user.profession ? user.profession : ''}</h3>
        <span>{user.averageRating === 0 ? '-' : parseFloat(user.averageRating).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SmallProfile;
