import '../../static/css/components/publicProfileCard.css'
import Tag from '../tag';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import chatsAPI from '../../api/chatsAPI';
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import { useEffect, useRef, useState } from 'react';
import { publicProfileFormInputs } from '../../forms/publicProfileForm';

const PublicProfileCard = (props) => {

    const client = useApolloClient()

    const editPublicProfileModalRef = useRef(null);
    const updatePublicProfileRef = useRef(null); 

    const openChat = () => {
        client.mutate({
            mutation: chatsAPI.createIndividualChat,
            variables: {
                username: props.username,
                users: [props.username, localStorage.getItem('user')]
            }
        }).then((response) => {
            alert("Ya puedes chatear con este usuario")
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
        });
    }

    function handlePublicProfileUpdate({values}){
        console.log(values);
    }

    useEffect(() => {
        publicProfileFormInputs.map(input => {
            switch(input.name){
                case 'firstName':
                    input.defaultValue = props.name.split(" ")[0];
                    break;
                case 'lastName':
                    input.defaultValue = props.name.split(" ")[1];
                    break;
                case 'biography':
                    input.defaultValue = props.bio;
                    break;
                case 'tags':
                    input.defaultValues = props.tags;
                    break;
                case 'profession':
                    input.defaultValue = props.job;
                    break;
                case 'birthDate':
                    input.defaultValue = props.birthDate;
                    break;
                default:
                    break;
            }
        })
    }, []);

    return (
        <>
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isPropietary ? 'profile-card-propietary' : 'profile-card-tenant'}`}>
            <div className="profile-card-info">
                <div className="profile-card-data">
                    <div className={`profile-card-edit ${props.isMe ? '' : 'no-edit'}`}>
                        <h2>{props.name}</h2>
                        {
                            props.isMe ? (
                                <button className="profile-card-btn" title="Edita tu perfil" onClick={() => editPublicProfileModalRef.current.open()}></button>
                            ) : 
                            (
                                <button className="profile-card-btn profile-card-btn-chat" title={`Contacta con @${props.username}`} onClick={() => openChat()}></button>
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
        <FlatterModal
            ref={editPublicProfileModalRef}
        >
            <FlatterForm
                buttonText="Actualizar perfil"
                showSuperAnimatedButton
                numberOfColumns={1}
                inputs={publicProfileFormInputs}
                onSubmit={handlePublicProfileUpdate}
                ref={updatePublicProfileRef}
            >

            </FlatterForm>
        </FlatterModal>
        </>
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