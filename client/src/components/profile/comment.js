import "../../static/css/components/comment.css"
import PropTypes from 'prop-types';
import Tag from "../tag";
import { Link } from "react-router-dom";

const Comment = (props) => {

    function isEmptyComment(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (obj1 == null || obj2 == null) return false;
        if (obj1.length !== obj2.length) return false;
        for (var key in obj1) {
            if (obj1[key] !== obj2[key]) return false;
        }
        return true;
    }

    return (
        !isEmptyComment(props, Comment.defaultProps) ?
        (
        <div className="comment">
            <Link to={"/profile/"+props.username} className="comment-link-img"><img className="comment-pic ml-2" src={props.pic} alt="Profile pic"></img></Link>
            <div className="comment-content ml-3 mr-2">
                <div className="comment-header">
                    <Link to={"/profile/"+props.username} className="comment-link"><h4 className="comment-name mr-1">{props.name}</h4></Link>
                    <div className="comment-tag ml-1">
                        <Tag name={props.tagName} color={props.tagColor}/>
                    </div>
                </div>
                <p className="comment-text mt-2">{props.text}</p>
            </div>
        </div>
        )
        :
        (
        <div className="comment pt-5 pb-5">
            <p className="comment-text mt-2">NO DISPONE DE NINGUNA RESEÑA</p>
        </div>
        )
    )
}

Comment.propTypes = {
    name: PropTypes.string,
    pic: PropTypes.string,
    tagName: PropTypes.string,
    tagColor: PropTypes.string,
    text: PropTypes.string,
    username: PropTypes.string
}

Comment.defaultProps = {
    name: "",
    pic: "",
    tagName: "",
    tagColor: "",
    text: "",
    username: ""

}

export default Comment