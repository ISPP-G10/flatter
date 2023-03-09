import "../../static/css/components/smallProfile.css";
import * as settings from "../../settings";

const SmallProfile = ({ user }) => {
  return (
    <div className="small-profile">
      <img src={settings.API_SERVER_MEDIA + user.profilePicture} alt="avatar" />
      <div className="small-profile-details">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <h3>Trabajo</h3>
        <span>4.2</span>
      </div>
    </div>
  );
};

export default SmallProfile;
