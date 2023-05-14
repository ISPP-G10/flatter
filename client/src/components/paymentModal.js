import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { forwardRef, useRef, useImperativeHandle } from "react";

import FlatterModal from "./flatterModal";
import PropTypes from "prop-types";

const PaymentModal = forwardRef((props, ref) => {
        
    const [{ isPending }] = usePayPalScriptReducer();

    const paymentModalRef = useRef(null);

    useImperativeHandle(ref, () => {
        return {
            open: () => paymentModalRef.current.open(),
        }
    });

    return(
        <FlatterModal
            ref={paymentModalRef}
            maxHeight={1000}
            maxWidth={500}
            scrollableContent
        >
            <h2>Realizar pago</h2>
            {isPending ? <span>Loading...</span> : null}
            <div className="w-100">
                <PayPalButtons 
                    style={{layout: "vertical", shape: "pill", tagline: "false"}}
                    createOrder={(data, actions) => {
                        let price = parseFloat(props.price);
                        if (props.discount !== null && props.discount !== undefined) {
                            price = props.price * (1 - parseFloat(props.discount));
                        }
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: price.toFixed(2).toString(),
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            paymentModalRef.current.close();
                            props.resolve();
                        });
                    }}
                    onCancel={() => {
                        paymentModalRef.current.close();
                        props.reject();
                    }}
                />
            </div>
        </FlatterModal>
    );
});

PaymentModal.propTypes = {
    price: PropTypes.number,
    open: PropTypes.bool,
}

PaymentModal.defaultProps = {
    price: 0.01,
    open: false,
}

export default PaymentModal;