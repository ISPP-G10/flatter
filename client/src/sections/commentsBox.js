import '../static/css/sections/commentsBox.css'
import Comment from '../components/profile/comment';

const CommentsBox = () => {

    return(
        <div className='comments-box'>
            <div className="d-flex justify-content-between align-items-center comments-box-header">
                <div className="d-flex justify-content-start align-items-center">
                    <img className="comments-box-star" width="25px" heigth="25px" src={require("../static/files/icons/star.png")} alt="Icono estrella"></img>
                    <h3 className='comments-box-title ml-4' style={{fontWeight: "bold"}}>RESEÑAS</h3>
                </div>
                <button className="comments-btn" title="Añade una nueva reseña">
                    <span className="comments-btn-text">Escribe tu reseña...</span>
                </button>
            </div>
            <div className="comments-box-scollable">
                <Comment name="Lucía Martín" pic={require("../static/files/images/default-user.png")} tagName="Amiga" tagColor="#f783de" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquet nisl, nec aliquet nisl nisl sit amet nisl. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquet nisl, nec aliquet nisl nisl sit amet nisl." />
                {/*<Comment />*/}
            </div>
        </div>
    );
}

export default CommentsBox;