import MessagesDate from "./messagesDate";
import Messages from "./messages";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import chatsAPI from "../../api/chatsAPI";
import socialLib from "../../libs/socialLib";

const Conversation = (props) => {
    
    let chatId = props.chatId;
    let username = localStorage.getItem("user");
    const [messagesMap, setMessagesMap] = useState(undefined);

    const {data, loading} = useQuery(chatsAPI.getMessagesByGroup, {
        variables: {
            username: username,
            chatId: chatId
        },
        fetchPolicy: "no-cache"
    });

    const subscription = useSubscription(chatsAPI.newMessages, {
        variables: {
            username: username,
        }
    });

    useEffect (() => {
        chatId = props.chatId;
        if (chatId!==null && chatId!==undefined){
            if (!loading){
                setMessagesMap(data.getMessagesByGroup);
            }
        }else{
            setMessagesMap(undefined);
        }
    }, [props.chatId, loading]);

    useEffect (() => {
        if (chatId!==null && chatId!==undefined){
            if (!subscription.loading){
                console.log(subscription.data);
            }
            else{
                console.log(subscription.loading);
            }
        }
    }, [subscription.data, subscription.loading]);

    return (
        <>
            { 
                messagesMap ? (messagesMap.map((dict, index) => {
                    return (
                        <>
                            <MessagesDate key={`message-date-${index}`} date={socialLib.getDateToString(dict.key)} />
                            {
                                dict.value.map((messagesList, messageIndex) => {
                                    return (
                                        <Messages key={`messages-list-${messageIndex}`} messagesList={messagesList} whose={messagesList[0].user.username===username?"mine":"yours"} />
                                    )
                                }
                            )}
                        </>
                    )
                }))
                :
                <></>
            };
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