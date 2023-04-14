import {useEffect, useRef} from "react";

import FlatterModal from "../../components/flatterModal";
import ReactDOM from 'react-dom/client';
import { toast } from "react-hot-toast";

const alert = ReactDOM.createRoot(document.getElementById('alert'));
let environment = process.env.NODE_ENV

function customAlert(string, type, top=true) {

    switch (environment) {
        case "production":
            switch(type){
                case "error":
                    toast.error("Se ha producido un error.\nSi el problema persiste, contacte con el equipo de soporte.", {position: top===true?"top-center":"bottom-center"});
                    break;
                case "success":
                    toast.success(string, {position: top===true?"top-center":"bottom-center"});
                    break;
                case "warning":
                    toast(string, {icon : "⚠️", position: top===true?"top-center":"bottom-center", duration: 10000});
                    break;
                case "info":
                    toast(string, {icon : "ℹ️", position: top===true?"top-center":"bottom-center",});
                    break;
                default:
                    const Alert = () => {

                        const alertRef = useRef(null);
                
                        useEffect(() => {
                            alertRef.current.open();
                        }, []);
                
                        return (
                            <FlatterModal maxHeight={250} ref={alertRef} border={"2px solid black"}>
                                <h3 style={{textAlign: 'center'}}>{string}</h3>
                            </FlatterModal>
                        );
                    }
                
                    alert.render(<Alert/>);
                    break;

            }
            break;
        default:
            const Alert = () => {

                const alertRef = useRef(null);
        
                useEffect(() => {
                    alertRef.current.open();
                }, []);
        
                return (
                    <FlatterModal maxHeight={250} ref={alertRef} border={"2px solid black"}>
                        <h3 style={{textAlign: 'center'}}>{string}</h3>
                    </FlatterModal>
                );
            }
        
            alert.render(<Alert/>);
            break;
    }

}

export default customAlert;