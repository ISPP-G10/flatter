import PropTypes from "prop-types";


const Message = (props) => {

    return (
        <>
            {
                props.mine ?
                    (
                        <div className={`message ${props.last} d-flex justify-content-center align-items-center`}>
                            <p className="class-chat-message-text">{props.message}</p>
                            <div className="d-flex flex-column justify-content-center align-items-center ml-2">
                                <img className="class-message-profile" style={{display: props.displayPic }} src={props.profilePic} alt=""/>
                                <span className="class-message-time">{props.time}</span>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className={`message d-flex ${props.last} justify-content-center align-items-center`}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column justify-content-center align-items-center mr-2">
                                    <img className="class-message-profile-left" style={{display: props.displayPic }} src={props.profilePic} alt=""/>
                                    <span className="class-message-time-left">{props.time}</span>
                                </div>
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                    <span className="class-chat-user" style={{display: props.displayUser }}>{props.user}</span>
                                    <p className="class-chat-message-text">{props.message}</p>
                                </div>
                            </div>
                        </div>
                    )
            }
        </>
    );

}

Message.propTypes = {
    message: PropTypes.string,
    profilePic: PropTypes.string,
    time: PropTypes.string,
    last: PropTypes.string,
    user: PropTypes.string,
    displayUser: PropTypes.string,
    displayPic: PropTypes.string,
    mine: PropTypes.bool
}

Message.defaultProps = {
    message: "",
    profilePic: "",
    time: "",
    last: "",
    user: "",
    displayUser: "none",
    displayPic: "none",
    mine: false
}

export default Message;