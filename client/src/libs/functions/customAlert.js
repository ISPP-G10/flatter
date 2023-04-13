import {useEffect, useRef} from "react";

import FlatterModal from "../../components/flatterModal";
import ReactDOM from 'react-dom/client';

const alert = ReactDOM.createRoot(document.getElementById('alert'));
let environment = process.env.NODE_ENV

function customAlert(string) {

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
}

export default customAlert;