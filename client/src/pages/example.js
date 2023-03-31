import PaymentModal from "../components/paymentModal";
import customAlert from "../libs/functions/customAlert";
import { useRef } from "react";
import customConfirm from "../libs/functions/customConfirm";

const Example = () => {

    const paymentModal = useRef(null);

    function handleAlert(){
        customAlert("Esta es una alerta personalizada");
    }

    function handleConfirm(){
        customConfirm("Esta es una confirmación personalizada, ¿quieres continuar?")
        .then((response) => {
            customAlert("Has aceptado la confirmación");
        })
        .catch((error) => {
            customAlert("Has rechazado la confirmación");
        });
    }

    function handlePayment(){
        paymentModal.current.open();
    }

    function handleCorrectPayment(){
        customAlert("El pago se ha realizado correctamente");
    }

    function handleBadPayment(){
        customAlert("El pago no se ha realizado correctamente");
    }

    return (
        <>
            <div>
                <h1>Example</h1>
                <button onClick={handleAlert}>Custom Alert</button>
                <button onClick={handleConfirm}>Custom Confirm</button>
                <button onClick={handlePayment}>Payment (5€)</button>
            </div>
            <PaymentModal 
                        price={5}
                        resolve={handleCorrectPayment}
                        reject={handleBadPayment}
                        ref={paymentModal}/>
        </>
    );
};

export default Example;