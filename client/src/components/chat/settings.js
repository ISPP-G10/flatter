import { useEffect, useRef} from "react";

const Settings = () => {

    let addToGroupsInput = useRef();
    let explicitContentInput = useRef();

    useEffect(() => {
        if(sessionStorage.explicitContent === "true"){
            explicitContentInput.current.checked = true;
        }
        if(sessionStorage.addToGroups === "true"){
            addToGroupsInput.current.checked = true;
        }
    }, [])


    const handleAddToGroups = () => {
    }

    const handleExplicitContent = () => {
    }


    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h4 className="class-chat-settings-title mt-3">Preferencias</h4>
            <div className="class-chat-settings-box">
                <div className="d-flex justify-content-between align-items-center mt-5">
                    <span className="class-chat-settings-name">Permitir ser añadido a grupos</span>
                    <input type="checkbox" className="ios-switch ios-switch class-checkbox" id="chat-checkbox-1" ref={addToGroupsInput} onChange={handleAddToGroups}></input>
                    <label htmlFor="chat-checkbox-1"></label>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="class-chat-settings-name">Permitir lenguaje inapropiado</span>
                    <input type="checkbox" className="ios-switch ios-switch class-checkbox" id="chat-checkbox-2" ref={explicitContentInput} onChange={handleExplicitContent}></input>
                    <label htmlFor="chat-checkbox-2"></label>
                </div>
            </div>
        </div>
    )
}

export default Settings;