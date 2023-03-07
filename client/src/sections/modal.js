import '../static/css/sections/modal.css';

import { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Modal = (props) => {

    const [isOpened, setIsOpened] = useState(false);

    const close = () => {
        setIsOpened(false);
    }

    const toggle = () => {
        setIsOpened(!isOpened);
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        document.querySelectorAll(`*[data-modalid="${props.id}"]:not(.modal)`).forEach(ele => {
            ele.addEventListener('click', (e) => {
                toggle();
                e.preventDefault();
            });
        });
    });

    let classes = 'modal';
    classes += isOpened===true ? ' open' : '';

    return (
        <div className={classes} data-modalid={props.id} onClick={close}>
            <div onClick={ stopPropagation }>
                <div>
                    { props.title &&
                        <div className="modal-header">
                            <h3>{props.title}</h3>
                        </div>
                    }
                    <div className="modal-content">
                        { props.children }
                    </div>
                </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    onSubmit: PropTypes.func,
}

Modal.defaultProps = {
    title: '',
    onsubmit: undefined
}

export default Modal;