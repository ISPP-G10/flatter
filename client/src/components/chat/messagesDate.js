import PropTypes from 'prop-types';

const MessagesDate = ({date}) => {
    return(
        <span className="class-chat-date">{date}</span>
    );
}

MessagesDate.propTypes = {
    date: PropTypes.string
}

MessagesDate.defaultProps = {
    date: ""
}

export default MessagesDate