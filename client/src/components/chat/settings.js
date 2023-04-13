import { useEffect, useRef} from "react";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../../api/usersAPI";
import customAlert from "../../libs/functions/customAlert";

const Settings = () => {

    let inappropiateLanguageRef = useRef();
    let notificationsAllowed = useRef();
    const client = useApolloClient();

    useEffect(() => {
        if(localStorage.getItem("inappropiateLanguage") === "true" || localStorage.getItem("inappropiateLanguage") === undefined || localStorage.getItem("inappropiateLanguage") === null){
            inappropiateLanguageRef.current.checked = true;
        }
        if(localStorage.getItem("notificationsAllowed") === "true" || localStorage.getItem("notificationsAllowed") === undefined || localStorage.getItem("notificationsAllowed") === null){
            notificationsAllowed.current.checked = true;
        }
    }, [])

    const handleInappropiateLanguage = () => {
        client.mutate({
            mutation: usersAPI.updateUserPreferences,
            variables: {
                username: localStorage.getItem("user"),
                inappropiateLanguage: inappropiateLanguageRef.current.checked
            }
        }).then((response) => {
            localStorage.setItem("inappropiateLanguage", response.data.editUserPreferences.userPreferences.inappropiateLanguage)
        }).catch((error) => {
            customAlert(error.message.split("\n")[0]);
        });
    }

    const handlenotificationsAllowed = () => {
        localStorage.setItem('notificationsAllowed', notificationsAllowed.current.checked);
    }


    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h4 className="class-chat-settings-title mt-3">Preferencias</h4>
            <div className="class-chat-settings-box">
                <div className="d-flex justify-content-between align-items-center mt-5">
                    <span className="class-chat-settings-name">Permitir lenguaje inapropiado</span>
                    <input type="checkbox" className="ios-switch ios-switch class-checkbox" id="chat-checkbox-1" ref={inappropiateLanguageRef} onChange={handleInappropiateLanguage}></input>
                    <label htmlFor="chat-checkbox-1"></label>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="class-chat-settings-name">Permitir notificaciones</span>
                    <input type="checkbox" className="ios-switch ios-switch class-checkbox" id="chat-checkbox-2" ref={notificationsAllowed} onChange={handlenotificationsAllowed}></input>
                    <label htmlFor="chat-checkbox-2"></label>
                </div>
            </div>
        </div>
    )
}

export default Settings;