import "../../static/css/components/smallProfile.css"

const SmallProfile = ({ user }) => {
  return (
    <div className="small-profile">
      <img src={user.avatar} alt="avatar" />
      <div className="small-profile-details">
        <h2>{user.name}</h2>
        <h3>{user.job}</h3>
        <span>{user.rating}</span>
      </div>
    </div>
  );
};

export default SmallProfile;