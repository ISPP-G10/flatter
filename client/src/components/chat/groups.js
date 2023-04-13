import Group from "./group"
import { useQuery, useSubscription } from "@apollo/client"
import chatsAPI from "../../api/chatsAPI"
import { API_SERVER_MEDIA } from "../../settings"
import socialLib from "../../libs/socialLib"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import notification from "../../libs/functions/notification"

const Groups = (props) => {

    let username = localStorage.getItem('user');
    let notificationsAllowed = localStorage.getItem('notificationsAllowed');

    const [newGroupId, setNewGroupId] = useState(undefined);
    let [allGroups, setAllGroups] = useState(undefined);
    let [groups, setGroups] = useState(undefined);

    const {data, loading} = useQuery(chatsAPI.getMyGroups, {
        variables: {
            username: username
        }
    });

    const {data: subscriptionData, loading: subscriptionLoading} = useSubscription(chatsAPI.newGroups, {
        variables: {
            username: username
        }
    });
    
    useEffect (() => {
        if (!loading){
            setGroups(data.getMyGroups.filter(g => g.group.individual === false || g.lastMessage !== null));
            setAllGroups(data.getMyGroups);
        }
    }, [loading]);

    useEffect (() => {
        if (!subscriptionLoading){
            if (groups){
                let groupAndLastMessage = subscriptionData.groupSubscription.groupAndLastMessage
                let group = groupAndLastMessage.group
                let lastMessage = groupAndLastMessage.lastMessage
                if (lastMessage !== null && lastMessage !== undefined){
                    let groups_filtered = groups.filter(g => g.group.id !== group.id)
                    setGroups([groupAndLastMessage,...groups_filtered])
                    setAllGroups([groupAndLastMessage,...allGroups.filter(g => g.group.id !== group.id)])
                    if (notificationsAllowed==="true" && lastMessage.user.username !== username){
                        let messageText = localStorage.getItem("inappropiateLanguage")?localStorage.getItem("inappropiateLanguage")==="false"?parseMessage(lastMessage.text):lastMessage.text:lastMessage.text;
                        if (parseInt(group.id)!==props.chatId){
                            notification(messageText, API_SERVER_MEDIA+lastMessage.user.profilePicture, lastMessage.user.firstName, lastMessage.user.lastName, lastMessage.user.username)
                            if (props.newMessages.get(group.id)) {
                                props.newMessages.set(group.id, props.newMessages.get(group.id)+1) 
                            } else {
                                props.newMessages.set(group.id, 1)
                            }
                            props.setNewMessages(new Map(props.newMessages))
                        }
                    }
                } else if(!group.individual){
                    setGroups([groupAndLastMessage,...groups])
                    setAllGroups([groupAndLastMessage,...allGroups])
                } else{
                    setAllGroups([groupAndLastMessage,...allGroups])
                    setNewGroupId(group.id)
                }
            }
        }
    }, [subscriptionData, subscriptionLoading]);

    useEffect (() => {
        if (props.activateChat !== undefined && props.activateChat !==null && props.activateChat !== false){
            props.setShowGroups(false)
            props.setChangeTab(true)
            //TODO: Solucionar más adelante
            setTimeout(() => {
                props.setShowChat(true)
                props.setShowGroups(true)
                if (props.activateChat === true){
                    props.setChatId(newGroupId)
                } else{
                    let groups_filtered = allGroups.filter(g => g.group.individual && g.group.users.filter(u => u.username === props.activateChat).length !== 0)
                    props.setChatId(parseInt(groups_filtered[0].group.id))
                }
                props.setActivateChat(false)
            }, 100);
        }
    }, [props.activateChat, allGroups]);

    useEffect (() => {
    }, [groups, allGroups]);

    function parseMessage(message){
        return socialLib.parseMessageInappropiateWords(message, props.inappropiateWords);
    }

    return(
        <>
            {
            groups && groups.map(data => {
                let filter_user = data.group.users.filter(u => u.username !== username)[0]
                let lastMessage = data.lastMessage?localStorage.getItem("inappropiateLanguage")?localStorage.getItem("inappropiateLanguage")==="false"?parseMessage(data.lastMessage.text):data.lastMessage.text:data.lastMessage.text:"";
                let lastTime = data.lastMessage?socialLib.getTimeToString(data.lastMessage.timestamp):"";
                let newMessages = props.newMessages.get(data.group.id)?props.newMessages.get(data.group.id):0;
                function handleGroupClick(){
                    props.setChatId(parseInt(data.group.id));
                    if (props.newMessages.get(data.group.id)){
                        props.newMessages.delete(data.group.id);
                        props.setNewMessages(new Map(props.newMessages));
                    }
                }
                return(
                    <Group onClick={handleGroupClick} name={data.group.individual?filter_user.username:data.group.name} chatPic={data.group.individual?API_SERVER_MEDIA+filter_user.profilePicture:require("../../static/files/images/default-user.png")} lastMessage={lastMessage} lastTime={lastTime} newMessages={newMessages} key={`chat-${data.group.id}`}/>
            )} 
            )}         
        </>
    )
}

PropTypes.propTypes = {
    setChatId: PropTypes.func,
    inappropiateWords: PropTypes.array,
    chatId: PropTypes.number,
    newMessages: PropTypes.object,
    setNewMessages: PropTypes.func,
}

PropTypes.defaultProps = {
    setChatId: () => {},
    inappropiateWords: [],
    chatId: null,
    newMessages: {},
    setNewMessages: () => {},
}

export default Groups;