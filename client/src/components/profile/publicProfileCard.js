import '../../static/css/components/publicProfileCard.css'
import Tag from '../tag';

const PublicProfileCard = () => {

    return (
        <div className='profile-card-container'>
            <div className="profile-card-info">
                <h2>Lucía Martín</h2>
                <p>Estudiante en Universidad de Sevilla</p>
                <p>24 años</p>    
            </div>
            <div className='profile-card-details'>
                <img className='profile-card-img' src={require('../../static/files/images/foto.jpg')} alt='Profile'/>
                <div className='profile-card-bio'>
                    <h2>Yo...</h2>
                    <p class="profile-card-description">Soy una estudiante a la que le pasárselo bien pero que también es responsable.
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

export default PublicProfileCard;