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
import TagSelector from '../inputs/tagSelector';
import { useQuery } from '@apollo/client';

const PublicProfileCard = (props) => {

    const client = useApolloClient();

    let [userImage, setUserImage] = useState(null);
    let [publicProfileFormValues, setPublicProfileFormValues] = useState(publicProfileFormInputs);
    let [tagOptions, setTagOptions] = useState([]);


    const editPublicProfileModalRef = useRef(null);
    const editPublicProfileForm = useRef(null);
    const userImageField = useRef(null);
    const [ tagsProfile, setTagsProfile ] = useState(props.tags);
    const tagsInput = useRef(null);

    const {data, loading} = useQuery(tagsAPI.getTags);

    console.log(tagsProfile);

    useEffect (() => {
        if (!loading){
            setTagOptions(data);
        };
    }, [data])

    function performUserMutation(values, encodedImage, selectedTags){
        client.mutate({
            mutation: usersAPI.updatePublicProfile,
            variables: {
                username: localStorage.getItem('user', ''),
                firstName: values.firstName,
                lastName: values.lastName,
                biography: values.biography,
                profession: values.profession,
                profilePicture: encodedImage,
                tags: selectedTags
            }
        })
        .then((response) => {
            editPublicProfileModalRef.current.close();
        })
        .catch((error) => alert(error.message));
    }

    function handlePublicProfileEdit({values}){

        setTagsProfile(tagsInput.current.props.value.map((tag) => ({
            name: tag.value,
            color: tag.color})))

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
                    <p>{props.age ? props.age + "años": ''}</p> 
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
            <h1 className="comments-form-title mb-5">Editar perfil público</h1>
            <FlatterForm 
                buttonText="Actualizar perfil"
                showSuperAnimatedButton
                numberOfColumns={1}
                inputs={publicProfileFormInputs}
                onSubmit={handlePublicProfileEdit}
                ref={editPublicProfileForm}>
                <div className="setting-profile-pic" >
                    <label className="-label" htmlFor="file">
                        <img src={require('../../static/files/icons/camera.png')} alt="camara" className="camera-icon"/>
                        <span style={{margin: '0'}}>Cambiar</span>
                    </label>
                    <input id="file" type="file" onChange={changeImage}/>
                    <img ref={userImageField} className="user-img" src={props.pic} id="output" width="200" alt="Imagen de perfil"/>
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