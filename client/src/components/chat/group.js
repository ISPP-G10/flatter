import PropTypes from 'prop-types';

const Group = (props) => {


    return (
        <div className="class-chat-group d-flex justify-content-between align-items-center pt-1 pb-1 w-100" onClick={props.onClick}>
            <div className="d-flex justify-content-start align-items-center w-75">
                <img className="class-group-image ml-2" src={props.chatPic} alt=""/>
                <div className="d-flex flex-column ml-3 w-100">
                    <div className="d-flex justify-content-start align-items-center w-100">
                        <strong className="class-chat-group-title w-100" style={{textAlign: "left"}}>{props.name}</strong>
                    </div>  
                    <span className="class-chat-group-message">{props.lastMessage}</span>
                </div>
            </div>
            <span className="class-chat-group-time mr-2 w-25">{props.lastTime}</span>
        </div>
    )
}

Group.propTypes = {
    name: PropTypes.string,
    lastMessage: PropTypes.string,
    lastTime: PropTypes.string,
    chatPic: PropTypes.string,
    id: PropTypes.string,
    onClick: PropTypes.func
}

Group.defaultProps = {
    name: "Chat",
    lastMessage: "",
    lastTime: "",
    chatPic: "",
    id: "",
    onClick: () => {}
}

export default Group;