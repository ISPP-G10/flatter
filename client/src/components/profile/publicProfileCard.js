import '../../static/css/components/publicProfileCard.css';

import Tag from '../tag';
import PropTypes from 'prop-types';
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import usersAPI from '../../api/usersAPI';

import { publicProfileFormInputs } from '../../forms/publicProfileForm';
import { useApolloClient } from '@apollo/client';


import {useEffect, useRef, useState} from 'react';

const PublicProfileCard = (props) => {

    const client = useApolloClient();

    let [userImage, setUserImage] = useState(null);
    let [publicProfileFormValues, setPublicProfileFormValues] = useState(publicProfileFormInputs);

    const [age, setAge] = useState(props.age);
    const [birthDate, setBirthdate] = useState(props.birthDate);

    const editPublicProfileModalRef = useRef(null);
    const editPublicProfileForm = useRef(null);
    const userImageField = useRef(null);

    function performUserMutation(values, encodedImage){
        const arr = String(values.birthDate).split('-')
        const birthday = arr[2] + '/' + arr[1] + '/' + arr[0]
        client.mutate({
            mutation: usersAPI.editUserPublic,
            variables: {
                username: localStorage.getItem('user', ''),
                biography: values.biography,
                profession: values.profession,
                profilePicture: encodedImage,
                birthday: birthday,
                tags: [],
                firstName: "Rafael",
                lastName: "Estrada"
            }
        })
        .then((response) => {
            editPublicProfileModalRef.current.close();
            setAge(response.data.editUserPublic.user.age);
            setBirthdate(values.birthDate);
        })
        .catch((error) => alert(error.message));
    }

    function handlePublicProfileEdit({values}){

        if(!editPublicProfileForm.current.validate()) {
            alert('Hay campos incorrectos. Por favor, revise el formulario')
            return;
        }

        try{
            var reader = new FileReader();
            reader.readAsDataURL(userImage);

            reader.onload = function () {
                performUserMutation(values, reader.result);
            };
        }catch(error){
            performUserMutation(values, null);
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

    useEffect (() => {
        publicProfileFormValues.map((input) => {
            if(input.name === 'birthDate'){
                input.defaultValue = birthDate;
            }
        });
    }, [birthDate]);

    return (
        <>
        <div className={`profile-card-container ${props.isMe ? 'profile-card-me' : props.isPropietary ? 'profile-card-propietary' : 'profile-card-tenant'}`}>
            <div className="profile-card-info">
                <div className="profile-card-data">
                    <div className={`profile-card-edit ${props.isMe ? '' : 'no-edit'}`}>
                        <h2>{props.name}</h2>
                        <button className="profile-card-btn" title="Edita tu perfil" onClick={() => editPublicProfileModalRef.current.open()}></button>
                    </div>
                    <p>{props.job ? props.job : ''}</p>
                    <p>{age!=0 ? age + " años": ''}</p> 
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
        <FlatterModal ref={editPublicProfileModalRef}>
            <h1 className="comments-form-title">Editar perfil público</h1>
            <FlatterForm 
                buttonText="Actualizar perfil"
                showSuperAnimatedButton
                numberOfColumns={1}
                inputs={publicProfileFormInputs}
                onSubmit={handlePublicProfileEdit}
                ref={editPublicProfileForm}>

                <div className="setting-profile-pic" style={{width: '40%'}}>
                    <label className="-label" htmlFor="file">
                        <img src={require('../../static/files/icons/camera.png')} alt="camara" className="camera-icon"/>
                        <span style={{margin: '0'}}>Cambiar</span>
                    </label>
                    <input id="file" type="file" onChange={changeImage}/>
                    <img ref={userImageField} className="user-img" src={props.pic} id="output" width="200" alt="Imagen de perfil"/>
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