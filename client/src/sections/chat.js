import { useState, useRef, useEffect } from "react";
import Conversation from "../components/chat/conversation";
import Groups from "../components/chat/groups";
import Settings from "../components/chat/settings";
import "../static/css/sections/chat.css";
import socialLib from "../libs/socialLib";
import { useApolloClient } from "@apollo/client";

const Chat = () => {

    const [showChat, setShowChat] = useState(true);
    const [showGroups, setShowGroups] = useState(false);
    const [listHeights, setListHeights] = useState([]);
    const [changeTab, setChangeTab] = useState(true);
    const [chatId, setChatId] = useState(null);
    const MAX_LEN = 140; //maxLength of caracters allowed when writing comments
    const client = useApolloClient();

    let chatBtn = useRef();
    let chatSlide = useRef();
    let chat = useRef();
    let chatInput = useRef();
    let chatWrite = useRef();
    let chatSlideHeader = useRef();
    let chatSlideHeader2 = useRef();
    let groupsHeader = useRef();
    let groups = useRef();
    let settings = useRef();
    let footer = useRef();
    let search = useRef();
    let chatHeaderTitle = useRef();
    let chatHeaderActive = useRef();
    let nodesList = [];

    const sendMessage = () => {
        socialLib.sendMessage(client, chatInput, chatId, MAX_LEN);
    }

    const setChangeTabTrue = () => {
        setChangeTab(true);
    }

    const setChangeTabFalse = () => {
        setChangeTab(false);
    }

    const handleShowChat = () => {

        setShowChat(!showChat);

        if (showChat) {
            chatSlide.current.style.display = "block";
            chatSlide.current.style.top = (window.scrollY+75) + "px";
            if (window.innerWidth > 1300) {
                chatSlide.current.style.left = "74%";
                chatSlide.current.style.width = "25%";
                chatSlide.current.style.height = "90%";
            } else if (window.innerWidth > 768) {
                chatSlide.current.style.left = "12.5%";
                chatSlide.current.style.width = "100%";
                chatSlide.current.style.height = "100%";
            } else{
                chatSlide.current.style.top = window.scrollY+"px";
                chatSlide.current.style.width = "100vw";
                chatSlide.current.style.height = "100vh";
            }

            if (changeTab) {
                groups.current.style.display = "block";
            } else {
                settings.current.style.display = "block";
            }

            footer.current.style.display = "block";
            chatSlideHeader2.current.style.display = "block";
            chat.current.style.display = "none";
            chatSlideHeader.current.style.display = "none";
            chatWrite.current.style.display = "none";

            if (chatInput.current.innerHTML === '' || chatInput.current.innerHTML === '<br>') {
                chatInput.current.innerHTML = 'Escribe tu mensaje aquí...';
                chatInput.current.style.color = "#FFFFFF)";
            }

            if (groups.current.style.display === "block" && groups.current.scrollHeight === groups.current.offsetHeight) {
                groupsHeader.current.style.display = "block";
                groups.current.style.maxHeight = "79%";
                groups.current.style.marginTop = "130px";
            } else if (groups.current.style.display === "block" && groups.current.scrollHeight > groups.current.offsetHeight) {
                groupsHeader.current.style.display = "none";
                groups.current.style.maxHeight = "86%";
                groups.current.style.marginTop = "67px";
                groups.current.style.transition = "all 0s";
                groupsHeader.current.style.transition = "all 0s";
            }
        } else {
            chatSlide.current.style.display = "none";
        }
    };

    const handleShowGroup = () => {

        setShowGroups(!showGroups);

        if (showGroups) {
            chat.current.style.display = "none";
            chatWrite.current.style.display = "none";
            chatSlideHeader.current.style.display = "none";
            groupsHeader.current.style.display = "none";
            chatSlideHeader2.current.style.display = "block";
            groups.current.style.display = "block";
            groups.current.scrollTop = 1;
            footer.current.style.display = "block";
            settings.current.style.display = "none";
            setChatId(null);
        } else {
            chat.current.style.display = "block";
            chat.current.scrollTop = chat.current.scrollHeight;
            chatWrite.current.style.display = "block";
            chatSlideHeader.current.style.display = "block";
            groupsHeader.current.style.display = "none";
            chatSlideHeader2.current.style.display = "none";
            groups.current.style.display = "none";
            footer.current.style.display = "none";
            settings.current.style.display = "none";
        }

        if (groups.current.style.display === "block" && groups.current.scrollHeight === groups.current.offsetHeight) {
            groupsHeader.current.style.display = "block";
            groups.current.style.maxHeight = "79%";
            groups.current.style.marginTop = "130px";
        }
    };

    const setInputHeight = (e) => {
        let chatInputHeight = chatInput.current.offsetHeight;
        if (chatInputHeight >= 112) {
            chat.current.style.maxHeight = "80%";
            chat.current.scrollTop = chat.current.scrollHeight;
        } else if (chatInputHeight >= 92) {
            chat.current.style.maxHeight = "82%";
            chat.current.scrollTop = chat.current.scrollHeight;
        }
        else if (chatInputHeight >= 85) {
            chat.current.style.maxHeight = "84%";
            chat.current.scrollTop = chat.current.scrollHeight;
        }
        else if (chatInputHeight >= 68) {
            chat.current.style.maxHeight = "84%";
            chat.current.scrollTop = chat.current.scrollHeight;
        } else {
            chat.current.style.maxHeight = "87%";
            chat.current.scrollTop = chat.current.scrollHeight;
        }

        if (e.keyCode === 13) {
            sendMessage();
        }
    }

    const setPlaceholderOut = () => {
        if (chatInput.current.innerHTML === 'Escribe tu mensaje aquí...') {
            chatInput.current.innerHTML = '';
            chatInput.current.style.color = "#FFFFFF";
        }
    }

    const setPlaceholderOn = () => {
        if (chatInput.current.innerHTML === '' || chatInput.current.innerHTML === '<br>') {
            chatInput.current.innerHTML = 'Escribe tu mensaje aquí...';
            chatInput.current.style.color = "#FFFFFF";
        }
    }

    const searchScroll = () => {
        setListHeights([...listHeights, groups.current.scrollTop]);

        if (!showGroups && groups.current.scrollTop <= 0) {
            groupsHeader.current.style.display = "block";
            groups.current.style.maxHeight = "79%";
            groups.current.style.marginTop = "130px";
            groups.current.style.transition = "all 0.5s";
            groupsHeader.current.style.transition = "all 0.5s";
        } else {
            groupsHeader.current.style.display = "none";
            groups.current.style.maxHeight = "86%";
            groups.current.style.marginTop = "67px";
            groups.current.style.transition = "all 0s";
            groupsHeader.current.style.transition = "all 0s";
            if (groups.current.scrollHeight === groups.current.offsetHeight) {
                groupsHeader.current.style.display = "block";
                groups.current.style.maxHeight = "79%";
                groups.current.style.marginTop = "130px";
            }
        }
    };

    useEffect(() => {
        if (groups.current.scrollTop <= listHeights[listHeights.length - 2] && groups.current.scrollTop < groups.current.offsetHeight && groups.current.scrollHeight - groups.current.scrollTop > groups.current.offsetHeight) {
            groups.current.style.transition = "all 0.5s";
            groupsHeader.current.style.transition = "all 0.5s";
            groupsHeader.current.style.display = "block";
        }
        if (listHeights.length > 2) {
            listHeights.shift();
            setListHeights(listHeights);
        }
    }, [listHeights])

    useEffect(() => {
        if (changeTab && groups.current.style.display === "none") {
            groups.current.style.display = "block";
            settings.current.style.display = "none";
            groupsHeader.current.style.display = "block";
        } else {
            settings.current.style.display = "block";
            groups.current.style.display = "none";
            groupsHeader.current.style.display = "none";
        }
    }, [changeTab])

    useEffect(() => {
        dragElement(document.getElementById("chatSlide"));

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById("chatSlideHeader2") && !showGroups) {
                document.getElementById("chatSlideHeader2").onmousedown = dragMouseDown;
            } else if (document.getElementById("chatSlideHeader") && showGroups) {
                /* if present, the header is where you move the DIV from:*/
                document.getElementById("chatSlideHeader").onmousedown = dragMouseDown;
            } else {
                /* otherwise, move the DIV from anywhere inside the DIV:*/
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }, [showGroups]);

    const searchGroups = () => {
        let searchValue = search.current.value.toLowerCase().trim();
        let parent = groups.current.firstChild;
        let nodesOrdered = [];
        let searchMessage = document.createElement("h4");
        let newContent = document.createTextNode("La búsqueda no tuvo ningún resultado. Por favor, pruebe de nuevo.");
        searchMessage.appendChild(newContent);
        searchMessage.style.color = "#000000";
        searchMessage.classList.add("ml-2");
        searchMessage.classList.add("mr-2");

        if (parent.parentNode.lastChild.innerText === "La búsqueda no tuvo ningún resultado. Por favor, pruebe de nuevo.") {
            parent.parentNode.removeChild(parent.parentNode.lastChild);
        }

        if (groups.current.hasChildNodes()) {
            for (let i = 0; i < nodesList.length; i++) {
                parent.appendChild(nodesList[i]);
                if (nodesList[i] === nodesList[nodesList.length - 1]) {
                    nodesList = [];
                }
            }

            let child = groups.current.firstChild.firstChild;

            while (child !== null && searchValue !== "") {
                let name = child.firstChild.firstChild.nextSibling.firstChild.firstChild.innerHTML;
                name = name.toLowerCase().trim();
                if (!name.includes(searchValue)) {
                    nodesList.push(child);
                } else {
                    if (name.startsWith(searchValue)) {
                        nodesOrdered.unshift(child);
                    } else {
                        nodesOrdered.push(child);
                    }
                }

                child = child.nextSibling;
            }

            for (let node of nodesOrdered) {
                parent.removeChild(node);
                parent.appendChild(node);
            }

            for (let node of nodesList) {
                parent.removeChild(node);
            }

            if (parent.firstChild === null && parent.parentNode.lastChild.innerText !== "La búsqueda no tuvo ningún resultado. Por favor, pruebe de nuevo.") {
                parent.parentNode.appendChild(searchMessage);
            }
        }
    }

    return (
        <>
            <div className="class-button-chat d-flex justify-content-center align-items-center" ref={chatBtn}>
                <div className="class-chat-btn d-flex justify-content-center align-items-center mb-2 mr-2" onClick={handleShowChat}>
                    <img className="class-chat-img " src={require("../static/files/icons/chat.png")} alt="Chat button" />
                </div>
            </div>
            <div ref={chatSlide} id="chatSlide" className="class-chat-slide">
                <div ref={chatSlideHeader}>
                    <div id="chatSlideHeader" className="d-flex justify-content-between align-items-center">
                        <div className="class-chat-arrow" onClick={handleShowGroup}></div>
                        <div className="d-flex justify-content-center align-items-center">
                            <h3 className="class-chat-title" ref={chatHeaderTitle}>Chat</h3>
                            <span ref={chatHeaderActive} className="ml-2"></span>
                        </div>
                        <div className="class-close-chat" onClick={handleShowChat}></div>
                    </div>
                </div>
                <div ref={chatSlideHeader2}>
                    <div id="chatSlideHeader2" className="d-flex justify-content-between align-items-center w-100">
                        <h3 className="class-chat-title ml-1">Chats</h3>
                        <div className="class-close-chat" onClick={handleShowChat}></div>
                    </div>
                </div>
                <div ref={groupsHeader}>
                    <div className="class-groups-header d-flex justify-content-center align-items-center">
                        <input ref={search} id="chat-search" className="class-chat-search" type="Search"
                            placeholder="Busca tus chats" title="Busca tus chats por nombre" onKeyUp={searchGroups} required />
                    </div>
                </div>
                <div ref={chat} className="chat">
                    <Conversation chatId={chatId} />
                </div>
                <div ref={chatWrite}>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <div ref={chatInput} id="chatInput" data-placeholder="Escribe tu mensaje aquí..." contentEditable="true" className="class-message-input class-write-message" onKeyUp={setInputHeight} onFocus={setPlaceholderOut} onBlur={setPlaceholderOn}></div>
                        <button type="submit" className="class-button-send" onClick={sendMessage}></button>
                    </div>
                </div>
                <div ref={groups} className="class-chat-groups" onScroll={searchScroll}>
                    <div onClick={handleShowGroup}>
                        <Groups setChatId={setChatId} />
                    </div>
                </div>
                <div ref={settings} className="class-chat-settings">
                    <Settings />
                </div>
                <div ref={footer}>
                    <div className="class-chat-footer d-flex justify-content-around align-items-center">
                        <div className="class-chat-footer-left d-flex justify-content-center align-items-center" onClick={setChangeTabTrue}>
                            <img className="class-img-footer" src={require("../static/files/icons/chats.png")} alt="Footer-chat" />
                        </div>
                        <div className="class-chat-footer-right d-flex justify-content-center align-items-center" onClick={setChangeTabFalse}>
                            <img className="class-img-footer" src={require("../static/files/icons/settings.png")} alt="Footer-settings" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;