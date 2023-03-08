const FIRST_ELEMENT = 0;

function sameDate(date1, date2){
    let dateParse1 = Date.parse(date1);
    let dateParse2 = Date.parse(date2);
    let dateFinal1 = new Date(dateParse1);
    let dateFinal2 = new Date(dateParse2);

    let day1 = dateFinal1.getDate();
    let day2 = dateFinal2.getDate();
    let month1 = dateFinal1.getMonth();
    let month2 = dateFinal1.getMonth();
    let year1 = dateFinal1.getYear();
    let year2 = dateFinal2.getYear();

    return day1 === day2 && month1 === month2 && year1 === year2;
}

function getDayToString(day){
    switch (day){
        case 0: return "Sun"
        case 1: return "Mon"
        case 2: return "Tue"
        case 3: return "Wed"
        case 4: return "Thu"
        case 5: return "Fri"
        case 6: return "Sat"
        default: return ""
    }
}

function getMessagesByDate(result, messages){
    for (let i = 0; i < messages.length; i++){
        let prevMessage = messages[i - 1];
        let message = messages[i];
        if (i !== FIRST_ELEMENT && !sameDate(prevMessage.date, message.date)){
            result.push(i);
        }
    }
    
    result.push(messages.length - 1);

    return result;
}

function getMessagesByDays(result, messagesByDate, messages){
    let j = 0;
    let messagesByDays = [];
    for (let i = 0; i < messages.length; i++){
        let message = messages[i];
        if (i === messages.length - 1){
            if (messagesByDate[j] === i && messagesByDate.filter((value) => (value === messages.length-1)).length>1){
                result.push(messagesByDays);
                messagesByDays = [];
                messagesByDays.push(message);
            } else{
                messagesByDays.push(message);
            }
        }
        if (i < messagesByDate[j]){
            messagesByDays.push(message);
        } else{
            result.push(messagesByDays);
            messagesByDays = [];
            messagesByDays.push(message);
            j++;
        }
    }
    return result;
}

function getMessagesClassifiedByUsers(result, messagesList){
    let mineMessages = [];
    let yoursMessages = [];
    let orderedMessages = [];
    let yoursMessagesClassified = [];
    let yoursMessagesClassifiedList = [];
    for (let i = 0; i < messagesList.length; i++){
        for (let j = 0; j < messagesList[i].length; j++){
            let message = messagesList[i][j];
            if (message.user.id === sessionStorage.userId){
                mineMessages.push(message);
            } else{
                yoursMessages.push(message);
            }
        }
        if (yoursMessages.length > 0){
            for (let k = 0; k < yoursMessages.length; k++){
                let message = yoursMessages[k];
                if (k !== FIRST_ELEMENT){
                    let prevMessage = yoursMessages[k - 1];
                    if (message.user.id === prevMessage.user.id){
                        yoursMessagesClassified.push(message);
                        yoursMessagesClassifiedList.push(yoursMessagesClassified);
                    } else{
                        yoursMessagesClassifiedList.push(yoursMessagesClassified);
                        yoursMessagesClassified = [];
                        if (k === yoursMessages.length - 1){
                            yoursMessagesClassified.push(message);
                            yoursMessagesClassifiedList.push(yoursMessagesClassified);
                            yoursMessagesClassified = [];
                        } else{
                            yoursMessagesClassified.push(message);
                        }

                    }
                } else{
                    yoursMessagesClassified.push(message);
                    if (yoursMessages.length === 1){
                        yoursMessagesClassifiedList.push(yoursMessagesClassified);
                        yoursMessagesClassified = [];
                    }
                }
            }
            orderedMessages.push(yoursMessagesClassifiedList);
            yoursMessagesClassifiedList = [];
        }
        yoursMessages = [];
        orderedMessages.push(mineMessages);
        mineMessages = [];
        result.push(orderedMessages);
        orderedMessages = [];
    }
    return result;
}

function getLiveMessages(result, messagesList){
    messagesList = messagesList[FIRST_ELEMENT][FIRST_ELEMENT];
    for(let i = 0; i < messagesList.length; i++){
        if(i<messagesList.length-1){
            if(messagesList[i]!==messagesList[i+1] || !result.includes(messagesList[i])){
                if(!result.includes(messagesList[i])){
                    result.push(messagesList[i]);
                }
            }
        } else{
            if(!result.includes(messagesList[i])){
                result.push(messagesList[i]);
            }
        }
    }
    return [[result]];
}

const socialLib ={

    sendMessage: (element, maxLength) =>{
        if(element.current){
            let text = element.current.innerText;
            if(text.trim().length > 0){
                text = text.replace(/(\r\n|\n|\r)/gm, "");
                if(text.length <= maxLength){
                    if(element.current.style.color !== "rgb(165, 165, 165)"){
                        // messagesAPI.createMessage(text).then(message =>{
                        //     element.current.innerHTML = "";
                        // }).catch(error => console.log(error));
                    }
                }else{
                    alert("The max length of a message must be of " + maxLength +  " characterers");
                }
            }else{
                alert("You cannot send an empty message");
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