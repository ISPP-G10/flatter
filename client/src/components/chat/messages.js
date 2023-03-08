import Message from "./message";
import PropTypes from 'prop-types';

const Messages = (props) =>{

    return(
        <>
        <div className={`yours messages`}>
            <Message key={`unique-message-1`} message="Prueba" displayPic="none" displayUser="block" profilePic={require("../../static/files/images/default-user.png")} time="11:23" user="Juan" mine={props.whose!=="mine"} />
            <Message key={`unique-message-1`} message="Prueba" displayPic="none" displayUser="none" profilePic={require("../../static/files/images/default-user.png")} time="11:23" user="Juan" mine={props.whose!=="mine"} />
            <Message key={`unique-message-1`} message="Prueba" displayPic="block" displayUser="none" profilePic={require("../../static/files/images/default-user.png")} time="11:23" last="last" user="Juan" mine={props.whose!=="mine"} />
        </div>
        <div className={`${props.whose} messages`}>
            <Message key={`unique-message-1`} message="Prueba" displayPic="none" profilePic={require("../../static/files/images/default-user.png")} time="11:23" mine={props.whose==="mine"} />
            <Message key={`unique-message-1`} message="Prueba" displayPic="none" profilePic={require("../../static/files/images/default-user.png")} time="11:23" mine={props.whose==="mine"} />
            <Message key={`unique-message-1`} message="Prueba" displayPic="block" profilePic={require("../../static/files/images/default-user.png")} time="11:23" last="last" mine={props.whose==="mine"} />
        </div>
        </>
    );
}

Messages.propTypes = {
    whose: PropTypes.string,
}

Messages.defaultProps = {
    whose: "",
}

export default Messages;