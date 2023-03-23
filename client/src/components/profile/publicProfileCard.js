import '../../static/css/components/publicProfileCard.css'
import Tag from '../tag';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import chatsAPI from '../../api/chatsAPI';

const PublicProfileCard = (props) => {

    let params = useParams()
    let username = params.username ? params.username : localStorage.getItem('user')
    let client = useApolloClient()

    const openChat = () => {
        client.mutate({
            mutation: chatsAPI.createIndividualChat,
            variables: {
                username: username,
                users: [username, localStorage.getItem('user')]
            }
        }).then((response) => {
            alert("Ya puedes chatear con este usuario")
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
        });
    }

    return (
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isPropietary ? 'profile-card-propietary' : 'profile-card-tenant'}`}>
            <div className="profile-card-info">
                <div className="profile-card-data">
                    <div className={`profile-card-edit ${props.isMe ? '' : 'no-edit'}`}>
                        <h2>{props.name}</h2>
                        {
                            props.isMe ? (
                                <button className="profile-card-btn" title="Edita tu perfil" ></button>
                            ) : 
                            (
                                <button className="profile-card-btn profile-card-btn-chat" title={`Contacta con @${username}`} onClick={() => openChat()}></button>
                            )
                        }
                    </div>
                    <p>{props.job ? props.job : ''}</p>
                    <p>{props.age ? props.age + " años": ''}</p> 
                </div>
            </div>
            <div className='profile-card-details'>
                <img className='profile-card-img' src={props.pic} alt='Profile'/>
                <div className='profile-card-bio'>
                    <h2>Yo...</h2>
                    <p className="profile-card-description">
                        {props.bio ? props.bio : props.me ? 'Añade una descripción para que el resto te conozca' : 'No hay descripción disponible'}
                    </p>
                    <div className='tags-container'>
                        {
                            props.tags.length !== 0 ? (
                                props.tags.map((tag, i) => { 
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
        </div>
    );
}

PublicProfileCard.propTypes = {
    name: PropTypes.string,
    job: PropTypes.string,
    age: PropTypes.number,
    bio: PropTypes.string,
    isMe: PropTypes.bool,
    isPropietary: PropTypes.bool,
    tags: PropTypes.array,
    pic: PropTypes.string
}

PublicProfileCard.defaultProps = {
    name: "",
    job: "",
    age: 0,
    bio: "",
    isMe: false,
    isPropietary: false,
    tags: [],
    pic: ""
}

export default PublicProfileCard;