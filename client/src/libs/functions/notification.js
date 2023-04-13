import { toast } from "react-hot-toast";
import "../../static/css/components/notification.css"

function notification(message, image, name, surname, username, setActivateChat, newMessages, setNewMessages, groupId) {

    function handleClick(t) {
      toast.dismiss(t.id);
      setActivateChat(username);
      if (newMessages.get(groupId)){
        newMessages.delete(groupId);
        setNewMessages(new Map(newMessages));
    }
  } 

  toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } class-notification-box`}>
        <button className="class-notification-invisible" onClick={handleClick}>
          <div className="class-notification-left">
            <div className="class-notification-img-div">
              <img
                className="class-notification-img"
                src={image}
                alt="Imagen de perfil"
              />
            </div>
            <div className="class-notification-info">
              <p className="class-notification-user">
                {name} {surname} (@{username})
              </p>
              <p className="class-notification-text">
                {message}
              </p>
            </div>
          </div>
        </button>
        <button
            onClick={() => toast.dismiss(t.id)}
            className="class-notification-btn"
        >
          Cerrar
        </button>
      </div>
  ),{duration: 500000});
  
  window.navigator.vibrate && window.navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
}

export default notification