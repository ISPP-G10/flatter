import Group from "./group"

const Groups = () => {
    const MAX_LEN = 43;

    return(
        <>                 
            <Group name="Chat" chatPic={require("../../static/files/images/default-user.png")} lastMessage="" lastTime="" id="1" key={`chat-1`}/>            
        </>
    )
}

export default Groups;