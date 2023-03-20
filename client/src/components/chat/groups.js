import Group from "./group"
import {useQuery} from "@apollo/client"
import chatsAPI from "../../api/chatsAPI"
import {API_SERVER_MEDIA} from "../../settings"
import socialLib from "../../libs/socialLib"

const Groups = () => {
    const MAX_LEN = 32;

    const {data, loading} = useQuery(chatsAPI.getMyGroups, {
        variables: {
            username: localStorage.getItem("user")
        }
    });

    if (loading) return <p>Loading...</p>
    
    const groups = data.getMyGroups;
    const messagesData = data.getMyMessages;
    const messages = messagesData===undefined?[]:messagesData;


    return(
        <>                 
            {
            groups && messages && groups.map(group => {
                let filter_user = group.users.filter(u => u.username != localStorage.getItem('user'))[0]
                let filter_message = messages.filter(m => m.group.id == group.id);
                let lastMessage = filter_message.length>0?filter_message[0].text.length>MAX_LEN?filter_message[0].text.trim().substring(0, MAX_LEN-3)+"...":filter_message[0].text:"";
                let lastTime =filter_message.length>0?socialLib.getTimeToString(filter_message[0].timestamp):"";
                return(
                    <Group name={group.individual?filter_user.username:group.name} chatPic={group.individual?API_SERVER_MEDIA+filter_user.profilePicture:require("../../static/files/images/default-user.png")} lastMessage={lastMessage} lastTime={lastTime} id={group.id} key={`chat-${group.id}`}/>
            )} 
            )}         
        </>
    )
}

export default Groups;