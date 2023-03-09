import '../../static/css/components/publicProfileCard.css'
import Tag from '../tag';
import PropTypes from 'prop-types';

const PublicProfileCard = (props) => {

    return (
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isTenant ? 'profile-card-tenant' : 'profile-card-propietary'}`}>
            <div className="profile-card-info">
                <div className="profile-card-data">
                    <div className={`profile-card-edit ${props.isMe ? '' : 'no-edit'}`}>
                        <h2>{props.name}</h2>
                        <button className="profile-card-btn" title="Edita tu perfil"></button>
                    </div>
                    <p>{props.job}</p>
                    <p>{props.age} años</p> 
                </div>
            </div>
            <div className='profile-card-details'>
                <img className='profile-card-img' src={require('../../static/files/images/foto.jpg')} alt='Profile'/>
                <div className='profile-card-bio'>
                    <h2>Yo...</h2>
                    <p className="profile-card-description">
                        {props.bio}
                    </p>
                    <div className='tags-container'>
                        <Tag name='LOL' color='#f783de' />
                        <Tag name="LGTB" color='#f783de' />               
                    </div>
                </div>
            </div>           
        </div>
    );
}

PublicProfileCard.propTypes = {
    name: PropTypes.string,
    job: PropTypes.string,
    age: PropTypes.number,
    bio: PropTypes.string,
    isMe: PropTypes.bool,
    isTenant: PropTypes.bool
}

PublicProfileCard.defaultProps = {
    name: "",
    job: "",
    age: 0,
    bio: "",
    isMe: false,
    isTenant: true
}

export default PublicProfileCard;