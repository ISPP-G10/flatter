import MessagesDate from "./messagesDate";
import Messages from "./messages";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import chatsAPI from "../../api/chatsAPI";

const Conversation = (props) => {
    
    let chatId = props.chatId;
    let username = localStorage.getItem("user");

    useEffect (() => {
        chatId = props.chatId;
    }, [props.chatId]);

    const {data, loading} = useQuery(chatsAPI.getMessagesByGroup, {
        variables: {
            username: localStorage.getItem("user"),
            chatId: chatId
        }
    });

    if (loading) return <p>Loading...</p>

    console.log(data);

    return (
        <>
            <MessagesDate key={`message-date-1`} date="13 Jun 2022" />
            <Messages key={`message-1`} whose="mine"/>
        </>
    );
}

PropTypes.propTypes = {
    chatId: PropTypes.number,
}

PropTypes.defaultProps = {
    chatId: null,
}

export default Conversation;