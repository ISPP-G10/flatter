import '../../static/css/components/publicProfileCard.css'
import Tag from '../tag';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from '@apollo/client';
import chatsAPI from '../../api/chatsAPI';
import tagsAPI from '../../api/tagsAPI';
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import TagSelector from '../inputs/tagSelector';
import { useEffect, useRef, useState } from 'react';
import { publicProfileFormInputs } from '../../forms/publicProfileForm';
import usersAPI from '../../api/usersAPI';

const PublicProfileCard = (props) => {

    const client = useApolloClient()

    const [reload, setReload] = useState(false);

    const editPublicProfileModalRef = useRef(null);
    const updatePublicProfileRef = useRef(null); 
    const tagsInput = useRef(null);

    const {data: userTagsData, loading: userTagsLoading} = useQuery(tagsAPI.getTagsByType, {
        variables: {
            type: "user"
        }
    });

    const openChat = () => {
        client.mutate({
            mutation: chatsAPI.createIndividualChat,
            variables: {
                username: props.username,
                users: [props.username, localStorage.getItem('user')]
            }
        }).then((response) => {
            alert("Ya puedes chatear con este usuario")
            window.location.reload();
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
        });
    }

    function handlePublicProfileUpdate({values}){
        
        let tagsValues = tagsInput.current.props.value.map(tag => tag.value);
        
        if (!updatePublicProfileRef.current.validate()) return

        let birthDateSplitted = values.birthDate.split("-");
        let userBirthday = birthDateSplitted[2] + "/" + birthDateSplitted[1] + "/" + birthDateSplitted[0];

        client.mutate({
            mutation: usersAPI.updatePublicProfile,
            variables: {
                username: props.username,
                firstName: values.firstName,
                lastName: values.lastName,
                biography: values.biography,
                profession: values.profession,
                birthday: userBirthday,
                tags: tagsValues
            }
        })
        .then((response) => {
            editPublicProfileModalRef.current.close();
            setReload(true);
        })
        .catch((error) => alert(error.message.split("\n")[0]));
    }

    useEffect(() => {
        if(!userTagsLoading){
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
                    case 'profession':
                        input.defaultValue = props.job;
                        break;
                    case 'birthDate':
                        if(props.birthDate) input.defaultValue = props.birthDate;
                        break;
                    default:
                        break;
                }
            })
        }

        if(reload){
            props.refetchUser();
            setReload(false);
        }
    }, [userTagsLoading, reload]);

    return (
        <>
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isPropietary ? 'profile-card-propietary' : 'profile-card-tenant'}`}>
            <div className="profile-card-info">
                <div className="profile-card-data">
                    <div className={`profile-card-edit`}>
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
            maxWidth={800}
            maxHeight={800}
            ref={editPublicProfileModalRef}
        >
            <h2 className='section-title'>Personalizar perfil público</h2>
            <FlatterForm
                buttonText="Actualizar perfil"
                showSuperAnimatedButton
                numberOfColumns={1}
                inputs={publicProfileFormInputs}
                childrenPosition={3}
                onSubmit={handlePublicProfileUpdate}
                ref={updatePublicProfileRef}
                scrollable
            >

                <div className='tag-input'>
                    {
                        !userTagsLoading && 
                            <TagSelector 
                                options={userTagsData.getTagsByType.map(tag => {
                                            return {
                                                    value: tag.id,
                                                    name: tag.name, 
                                                    color: tag.color
                                                }
                                        })}
                                defaultValues={props.tags.map(tag => {
                                            return {
                                                    value: tag.id,
                                                    name: tag.name,
                                                    color: tag.color
                                                }
                                        })}
                                max={8} 
                                ref={tagsInput}/>
                    }
                </div>

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