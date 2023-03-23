import Group from "./group"
import {useQuery} from "@apollo/client"
import chatsAPI from "../../api/chatsAPI"
import {API_SERVER_MEDIA} from "../../settings"
import socialLib from "../../libs/socialLib"
import PropTypes from "prop-types"

const Groups = (props) => {
    const MAX_LEN = 32;

    const {data, loading} = useQuery(chatsAPI.getMyGroups, {
        variables: {
            username: localStorage.getItem("user")
        }
    });

    if (loading) return <p>Loading...</p>
    
    const groups = data.getMyGroups;

    return(
        <>
            {
            groups && groups.map(data => {
                let filter_user = data.group.users.filter(u => u.username !== localStorage.getItem('user'))[0]
                let lastMessage = data.lastMessage?data.lastMessage.text.length>MAX_LEN?data.lastMessage.text.trim().substring(0, MAX_LEN-3)+"...":data.lastMessage.text:"";
                let lastTime = data.lastMessage?socialLib.getTimeToString(data.lastMessage.timestamp):"";
                return(
                    <Group onClick={()=>{props.setChatId(parseInt(data.group.id))}} name={data.group.individual?filter_user.username:data.group.name} chatPic={data.group.individual?API_SERVER_MEDIA+filter_user.profilePicture:require("../../static/files/images/default-user.png")} lastMessage={lastMessage} lastTime={lastTime} key={`chat-${data.group.id}`}/>
            )} 
            )}         
        </>
    )
}

PropTypes.propTypes = {
    setChatId: PropTypes.func,
}

PropTypes.defaultProps = {
    setChatId: () => {},
}

export default Groups;