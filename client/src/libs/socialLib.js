import chatsAPI from "../api/chatsAPI";
import customAlert from "../libs/functions/customAlert";

function getDayToString(day){
    switch (day){
        case 0: return "Dom"
        case 1: return "Lun"
        case 2: return "Mar"
        case 3: return "Mie"
        case 4: return "Jue"
        case 5: return "Vie"
        case 6: return "Sab"
        default: return ""
    }
}

const socialLib ={

    sendMessage: (client, element, chatId, maxLength) =>{
        if(element.current){
            let text = element.current.innerText;
            if(text.trim().length > 0){
                text = text.replace(/(\r\n|\n|\r)/gm, "");
                if(text.length <= maxLength){
                    if(element.current.style.color !== "rgb(165, 165, 165)"){
                        if (chatId === null) {
                            customAlert("The chat is invalid");
                            return;
                        }
                        client.mutate({
                            mutation: chatsAPI.createMessage,
                            variables: {
                                username: localStorage.getItem("user"),
                                text: text,
                                chatId: chatId
                            }
                        }).then((response) => {
                            element.current.innerHTML = "";
                        }).catch((error) => {
                            customAlert(error.message.split("\n")[0]);
                        });
                    }
                }else{
                    customAlert("The max length of a message must be of " + maxLength +  " characterers");
                }
            }else{
                customAlert("You cannot send an empty message");
            }
        }
    },

    getDateToString: (date) =>{
        let dateParse = Date.parse(date);
        let dateFinal = new Date(dateParse);
        let weekDayParse = dateFinal.getDay();
        let weekDay = getDayToString(weekDayParse);
        let day = dateFinal.getDate();
        let month = dateFinal.getMonth() + 1;
        let year = dateFinal.getFullYear();
        let result = weekDay + " " + day + "/" + month + "/" + year;

        return result;
    },

    getTimeToString: (date) =>{
        let dateParse = Date.parse(date);
        let dateFinal = new Date(dateParse);
        let hours = dateFinal.getHours();
        let minutes = dateFinal.getMinutes();
        // eslint-disable-next-line no-self-assign
        hours < 10 ? hours = "0" + hours : hours = hours;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // eslint-disable-next-line no-self-assign
        minutes < 10 ? minutes = "0" + minutes : minutes = minutes;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        
        return hours + ":" + minutes;
    }
}

export default socialLib;