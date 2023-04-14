import MessagesDate from "./messagesDate";
import Messages from "./messages";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import chatsAPI from "../../api/chatsAPI";
import socialLib from "../../libs/socialLib";

const Conversation = (props) => {
    
    let chatId = props.chatId;
    let username = localStorage.getItem('user');
    let userToken = localStorage.getItem('token', '');

    const [messagesMap, setMessagesMap] = useState(undefined);
    const [messagesChanged, setMessagesChanged] = useState(false);

    const {data, loading} = useQuery(chatsAPI.getMessagesByGroup, {
        variables: {
            username: username,
            chatId: chatId,
            userToken: userToken
        },
        fetchPolicy: "no-cache"
    });

    const {data: subscriptionData, loading: subscriptionLoading} = useSubscription(chatsAPI.newMessages, {
        variables: {
            username: username,
            chatId: chatId,
            userToken: userToken
        }
    });

    useEffect (() => {
        chatId = props.chatId;
        if (chatId!==null && chatId!==undefined){
            if (!loading){
                setMessagesMap(data.getMessagesByGroup);
                setMessagesChanged(!messagesChanged)
            }
        } else{
            setMessagesMap(undefined);
        }
    }, [props.chatId, loading]);

    useEffect (() => {
        if (chatId!==null && chatId!==undefined){
            if (!subscriptionLoading){
                if (messagesMap){
                    let messages = messagesMap
                    let newMessage = subscriptionData.messageSubscription.message
                    if (messages.length===0){
                        messages.push({key: newMessage.timestamp, value: [[newMessage]]})
                    } else{
                        let todayList = messages.at(-1).value
                        let lastMessagesList = todayList.at(-1)
                        let isFromMe = lastMessagesList.at(-1).user.username===newMessage.user.username
                        if(isFromMe){
                            lastMessagesList.push(newMessage)
                        } else{
                            todayList.push([newMessage])
                        }
                    }
                    setMessagesMap(messages)
                    setMessagesChanged(!messagesChanged)
                }
            }
        }
    }, [subscriptionData, subscriptionLoading]);

    useEffect (()=>{
        props.parentRef.current.scrollTop = props.parentRef.current.scrollHeight;
    }, [messagesChanged])

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
                                        <Messages key={`messages-list-${messageIndex}`} messagesList={messagesList} whose={messagesList[0].user.username===username?"mine":"yours"} inappropiateWords={props.inappropiateWords}/>
                                    )
                                }
                            )}
                        </>
                    )
                }))
                :
                <></>
            }
        </>
    );
}

PropTypes.propTypes = {
    chatId: PropTypes.number,
    parentRef: PropTypes.object,
    inappropiateWords: PropTypes.array
}

PropTypes.defaultProps = {
    chatId: undefined,
    parentRef: undefined,
    inappropiateWords: []
}

export default Conversation;