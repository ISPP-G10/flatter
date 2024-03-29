import Message from "./message";
import PropTypes from 'prop-types';
import socialLib from "../../libs/socialLib";
import {API_SERVER_MEDIA} from "../../settings";

const Messages = (props) =>{

    let username = localStorage.getItem("user");
    let messagesLength = props.messagesList.length;

    function parseMessage(message){
        return socialLib.parseMessageInappropiateWords(message, props.inappropiateWords);
    }

    return(
        <>
            <div className={`${props.whose} messages`}>
                {
                    props.messagesList && props.messagesList.map((message, index) => {
                        return (
                            <Message key={`message-${index}`} message={localStorage.getItem("inappropiateLanguage")?localStorage.getItem("inappropiateLanguage")==="false"?parseMessage(message.text):message.text:message.text} displayPic={(index===messagesLength-1 && message.user.username!==username && !message.group.individual)?"block":"none"} profilePic={API_SERVER_MEDIA+message.user.profilePicture} time={socialLib.getTimeToString(message.timestamp)} last={index===messagesLength-1?"last":""} mine={props.whose==="mine"} displayUser={(index===0 && message.user.username!==username && !message.group.individual)?"block":"none"} user={message.user.username}/>
                        )
                    })
                }
            </div>
        </>
    );
}

Messages.propTypes = {
    whose: PropTypes.string,
    messagesList: PropTypes.array,
    inappropiateWords: PropTypes.array,
}

Messages.defaultProps = {
    whose: "",
    messagesList: [],
    inappropiateWords: [],
}

export default Messages;