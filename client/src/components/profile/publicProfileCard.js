import '../../static/css/components/publicProfileCard.css';

import Tag from '../tag';
import PropTypes, { func } from 'prop-types';
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import usersAPI from '../../api/usersAPI';
import tagsAPI from '../../api/tagsAPI';

import { publicProfileFormInputs } from '../../forms/publicProfileForm';
import { useApolloClient } from '@apollo/client';


import {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import chatsAPI from '../../api/chatsAPI';
import TagSelector from '../inputs/tagSelector';
import { useQuery } from '@apollo/client';

const PublicProfileCard = (props) => {

    const client = useApolloClient();

    let [userImage, setUserImage] = useState(null);
    let [publicProfileFormValues, setPublicProfileFormValues] = useState(publicProfileFormInputs);
    let [tagOptions, setTagOptions] = useState([]);

    const [age, setAge] = useState(props.age);
    const [birthDate, setBirthdate] = useState(props.birthDate);

    let params = useParams();
    let username = params.username ? params.username : localStorage.getItem('user');

    const editPublicProfileModalRef = useRef(null);
    const editPublicProfileForm = useRef(null);
    const userImageField = useRef(null);
    const [ tagsProfile, setTagsProfile ] = useState(props.tags);
    const [ name, setName ] = useState(props.name);
    const [ bio, setBio ] = useState(props.bio);
    const [ prof, setProf ] = useState(props.job);
    const tagsInput = useRef(null);

    const {data, loading} = useQuery(tagsAPI.getTags);

    useEffect (() => {
        if (!loading){
            setTagOptions(data);
        };
    }, [data])

    function performUserMutation(values, encodedImage, selectedTags){
        const arr = String(values.birthDate).split('-')
        const birthday = arr[2] + '/' + arr[1] + '/' + arr[0]
        client.mutate({
            mutation: usersAPI.updatePublicProfile,
            variables: {
                username: username,
                firstName: values.firstName,
                lastName: values.lastName,
                biography: values.biography,
                profession: values.profession,
                profilePicture: encodedImage,
                tags: selectedTags,
                birthday: birthday,
            }
        })
        .then((response) => {
            editPublicProfileModalRef.current.close();
            setName(values.firstName + " " + values.lastName);
            setBio(values.biography);
            setProf(values.profession);
            setTagsProfile(tagsInput.current.props.value.map((tag) => ({
                name: tag.value,
                color: tag.color})))
            
            setAge(response.data.editUserPublic.user.age);
            setBirthdate(values.birthDate);
        })
        .catch((error) => alert(error.message));
    }

    function handlePublicProfileEdit({values}){
        
        var tagsSelected = tagsInput.current.props.value.map((tag) => (tag.value))

        if(!editPublicProfileForm.current.validate()) {
            alert('Hay campos incorrectos. Por favor, revise el formulario')
            return;
        }

        try{
            
            var reader = new FileReader();
            reader.readAsDataURL(userImage);

            reader.onload = function () {
                performUserMutation(values, reader.result, tagsSelected);
            };
        }catch(error){
            performUserMutation(values, null, tagsSelected);
        }
    }

    function changeImage(e){

        let file = e.target.files[0];

        userImageField.current.src = URL.createObjectURL(file);

        setUserImage(file);
    }

    useEffect(() => {

        publicProfileFormValues.map((input) => {
            if(input.name === 'biography'){
                input.defaultValue = props.bio;
            }else if(input.name === 'profession'){
                input.defaultValue = props.job;
            }
        });

    }, [userImage]);

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
    
    useEffect(() => {
        publicProfileFormInputs.map((input) => {
            if(input.name === 'biography'){
                input.defaultValue = bio;
            }else if(input.name === 'profession'){
                input.defaultValue = prof;
            }else if(input.name === 'firstName'){
                input.defaultValue = name.split(' ')[0];
            }else if(input.name === 'lastName'){
                input.defaultValue = name.split(' ')[1];
            } if(input.name === 'birthDate'){
                input.defaultValue = birthDate;
            }
        });
    }, [tagsProfile, name, prof, bio, birthDate]);

    return (
        <>
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isPropietary ? 'profile-card-propietary' : 'profile-card-tenant'}`}>
            <div className="profile-card-info">
                <div className="profile-card-edit">
                    <h2>{props.name}</h2>
                    {
                        props.isMe ? (
                            <button className="profile-card-btn" title="Edita tu perfil" onClick={() => editPublicProfileModalRef.current.open()}></button>
                        ) : 
                        (
                            <button className="profile-card-btn profile-card-btn-chat" title={`Contacta con @${username}`} onClick={() => openChat()}></button>
                        )
                    }
                </div>
                <p>{prof ? prof : ''}</p>
                <p>{age!=null ? age + " años": ''}</p> 
            </div>
            <div className='profile-card-details'>
                <img className='profile-card-img' src={props.pic} alt='Profile'/>
                <div className='profile-card-bio'>
                    <h2>Yo...</h2>
                    <p className="profile-card-description">
                        {bio ? bio : props.me ? 'Añade una descripción para que el resto te conozca' : 'No hay descripción disponible'}
                    </p>
                    <div className='tags-container'>
                        {
                            tagsProfile.length !== 0 ? (
                                tagsProfile.map((tag, i) => { 
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
        <FlatterModal ref={editPublicProfileModalRef} maxHeight={800} maxWidth={700}>
            <h1 className="edit-form-title">Editar perfil público</h1>
            <FlatterForm 
                buttonText="Actualizar perfil"
                showSuperAnimatedButton
                numberOfColumns={1}
                inputs={publicProfileFormInputs}
                onSubmit={handlePublicProfileEdit}
                ref={editPublicProfileForm}
                scrollable
                >
                <div className="setting-profile-pic" >
                    <label className="-label" htmlFor="file">
                        <img src={require('../../static/files/icons/camera.png')} alt="camara" className="camera-icon"/>
                        <span style={{margin: '0'}}>Cambiar</span>
                    </label>
                    <input id="file" type="file" onChange={changeImage}/>
                    <img ref={userImageField} className="user-img" src={props.pic} id="output" width="100" alt="Imagen de perfil"/>
                </div>
                <div className='tag-input'>
                    <TagSelector options={tagOptions.getAllTag} defaultValues={tagsProfile} max={8} ref={tagsInput}/>
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