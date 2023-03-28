import FlatterModal from "../../components/flatterModal";

import {render} from "react-dom";

import {useEffect, useRef} from "react";

function customAlert(string) {

    const Alert = () => {

        const alertRef = useRef(null);

        useEffect(() => {
            alertRef.current.open();
        }, []);

        return (
            <FlatterModal maxHeight={250} ref={alertRef}>
                <h3 style={{textAlign: 'center'}}>{string}</h3>
            </FlatterModal>
        );
    }

    render(<Alert/>, document.getElementById('alert'));
}

export default customAlert;