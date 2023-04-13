import { useEffect, useRef, useState } from 'react';
import { commentsInputs } from '../../forms/commentsForm';
import '../../static/css/components/commentsBox.css'
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import Comment from './comment';
import ReactStars from "react-rating-stars-component";
import PropTypes from 'prop-types';
import { API_SERVER_MEDIA } from '../../settings';
import {useApolloClient, useQuery} from '@apollo/client'
import usersAPI from '../../api/usersAPI';
import customAlert from '../../libs/functions/customAlert';

function getTagName(tag, genre) {
    let final_letter = "e"
    if (genre === "H") {
        final_letter = "o"
    }else if (genre === "M"){
        final_letter = "a"
    }

    switch(tag){
        case "A":
            return "Amig" + (final_letter==="e" ? "ue" : final_letter);
        case "C":
            return "Compañer" + final_letter;
        case "E":
            return "Excompañer" + final_letter;
        case "I": 
            return "Inquilin" + final_letter;
        default:
            return "Propietari" + final_letter;
    }
}

function getTagColor(tag) {
    switch(tag){
        case "A":
            return "#AC00FF";
        case "C":
            return "#F95FCB";
        case "E":
            return "#F95F62";
        default:
            return "#176F9F";
    }
}

const CommentsBox = (props) => {

    const commentsModalRef = useRef(null)
    const commentsFormRef = useRef(null);
    const client = useApolloClient();
    let [rating, setRating] = useState(null);
    let [comments, setComments] = useState(props.comments)
    let username = localStorage.getItem("user");

    const { data : dataRelations, loading : loadingRelations } = useQuery( usersAPI.getRelationships,
        { variables: { userLogin: username,
                        userValued: props.username  } } );
 
    const ratingChanged = (newRating) => {
        if (newRating === null || newRating === undefined || newRating === 0) {
            setRating(null)
        } else if (newRating < 1 && newRating > 5){
            customAlert("La valoración debe estar entre 1 y 5");
        } else{
            setRating(newRating)
        }
    };

    function handleCommentsButtonClick(){
        commentsModalRef.current.open();
    }

    useEffect (() => {
        props.setTotalRatings(props.getTotalRatings(comments))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comments])

    function handleRegisterSubmit({values}){

        if(!commentsFormRef.current.validate()) return;

        client.mutate({
            mutation: usersAPI.createReview,
            variables: {
                valuedUser: props.username,
                evaluatorUser: localStorage.getItem("user"),
                text: values.comment,
                rating: rating ? rating : null,
                relationship: values.relationship
            }
        }).then((response) => {
            commentsModalRef.current.close();
            setComments([
                    response.data.createReview.review,
                    ...comments
                ]);
            props.setAverageRating(response.data.createReview.review.valuedUser.averageRating);
        }).catch((error) => {
            customAlert(error.message.split("\n")[0]);
        });
        
    }

    useEffect(() => { 
        if (!loadingRelations && props.username!==username) { 
            commentsInputs.map((input) => { 
                if(input.name === 'relationship') { input.values = dataRelations.getRelationshipsBetweenUsers; } }); 
            } 
        }, [loadingRelations, dataRelations, props.username])

    return(
        <>
            <div className='comments-box'>
                <div className="d-flex justify-content-between align-items-center comments-box-header">
                    <div className="d-flex justify-content-start align-items-center">
                        <img className="comments-box-star" src={require("../../static/files/icons/star.png")} alt="Icono estrella"></img>
                        <h3 className='comments-box-title'>Reseñas</h3>
                    </div>
                    <button className={`comments-btn ${props.username===username || comments.filter(c => c.evaluatorUser.username === username).length > 0 ? 'no-comments-btn' : ''}`} title="Añade una nueva reseña" onClick={handleCommentsButtonClick} >
                        <span className="comments-btn-text">Escribe tu reseña...</span>
                    </button>
                </div>
                <div className="comments-box-scollable">
                    {
                        comments.length !== 0 ? (
                            comments.map((comment, i) => {
                                return(
                                    <Comment key={'comment-' + i} name={comment.evaluatorUser.firstName + " " + comment.evaluatorUser.lastName} pic={API_SERVER_MEDIA+comment.evaluatorUser.profilePicture} tagName={getTagName(comment.relationship, comment.evaluatorUser.genre)} tagColor={getTagColor(comment.relationship)} text={comment.text} username={comment.evaluatorUser.username} />
                                );
                            }))
                        :
                            (
                                <Comment />
                            )
                    }
                </div>
            </div>
            <FlatterModal maxWidth={500} maxHeight={500} ref={commentsModalRef}>
                <h1 className="comments-form-title">Emite tu valoración</h1>
                <FlatterForm 
                    buttonText="Enviar comentario"
                    showSuperAnimatedButton
                    numberOfColumns={1}
                    inputs={commentsInputs}
                    onSubmit={handleRegisterSubmit}
                    ref={commentsFormRef}>
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        isHalf={false}
                        activeColor="#ffd700"
                    />
                </FlatterForm>
            </FlatterModal>
        </>
    );
}

CommentsBox.propTypes = {
    comments: PropTypes.array,
    username: PropTypes.string,
    setAverageRating: PropTypes.func,
    setTotalRatings: PropTypes.func,
    getTotalRatings: PropTypes.func,
}

CommentsBox.defaultProps = {
    comments: [],
    username: "",
}

export default CommentsBox;