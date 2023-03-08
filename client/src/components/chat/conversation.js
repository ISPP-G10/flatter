import MessagesDate from "./messagesDate";
import Messages from "./messages";

const Conversation = () => {

    return (
        <>
            <MessagesDate key={`message-date-1`} date="13 Jun 2022" />
            <Messages key={`message-1`} whose="mine"/>
        </>
    );
}

export default Conversation;