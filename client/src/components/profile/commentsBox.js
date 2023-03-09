import { useRef } from 'react';
import { commentsFormInputs } from '../../forms/commentsForm';
import '../../static/css/components/commentsBox.css'
import FlatterModal from '../flatterModal';
import FlatterForm from '../forms/flatterForm';
import Comment from './comment';
import ReactStars from "react-rating-stars-component";
import PropTypes from 'prop-types';

const CommentsBox = (props) => {

    const commentsModalRef = useRef(null)
    const commentsFormRef = useRef(null);
 
    const ratingChanged = (newRating) => {
    console.log(newRating);
    };

    function handleCommentsButtonClick(){
        commentsModalRef.current.open();
    }

    function handleRegisterSubmit({values}){

        if(!commentsFormRef.current.validate()) return;

        // client.mutate({
        //     mutation: usersAPI.createUser,
        //     variables: {
        //         firstName: values.first_name,
        //         lastName: values.last_name,
        //         username: values.username,
        //         password: values.password,
        //         email: values.email,
        //         genre: values.genre,
        //         roles: values.role
        //     }
        // }).then((response) => {
        //     let token = response.data.tokenAuth.token;
        //     let username = response.data.tokenAuth.user.username;

        //     localStorage.setItem('token', token);
        //     localStorage.setItem('user', username);

        //     navigator('/main');
        // }).catch((error) => {
        //     alert(error.message.split("\n")[0]);
        // });
        
    }

    return(
        <>
            <div className='comments-box'>
                <div className="d-flex justify-content-between align-items-center comments-box-header">
                    <div className="d-flex justify-content-start align-items-center">
                        <img className="comments-box-star" src={require("../../static/files/icons/star.png")} alt="Icono estrella"></img>
                        <h3 className='comments-box-title'>Reseñas</h3>
                    </div>
                    <button className="comments-btn" title="Añade una nueva reseña" onClick={handleCommentsButtonClick} >
                        <span className="comments-btn-text">Escribe tu reseña...</span>
                    </button>
                </div>
                <div className="comments-box-scollable">
                    {
                        props.comments.length !== 0 ? (
                            props.comments.map((comment, index) => {
                                return(
                                    <Comment key={'comment-' + index} name={comment.name} pic={comment.pic} tagName={comment.tagName} tagColor={comment.tagColor} text={comment.text} />
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
                    inputs={commentsFormInputs}
                    onSubmit={handleRegisterSubmit}
                    ref={commentsFormRef}>
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        isHalf={true}
                        activeColor="#ffd700"
                    />
                </FlatterForm>
            </FlatterModal>
        </>
    );
}

CommentsBox.propTypes = {
    comments: PropTypes.array
}

CommentsBox.defaultProps = {
    comments: []
}

export default CommentsBox;