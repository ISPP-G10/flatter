import '../static/css/sections/button.css';

import PropTypes from "prop-types";

const SolidButton = ({text, type, onClick, className}) => {

    className = className.length ? ` ${className}` : '';
    
    let classes = `button${className}`;
    classes += type.length>0 ? ` ${type}` : '';

    const isOutlined = type==="outlined";

    return (
        <button type="submit" className={classes} onClick={onClick} style={{fontSize: "14px"}}>{text} <SVGBorder show={isOutlined}/></button>
    );
}

SolidButton.propTypes = {
    text: PropTypes.string,
    href: PropTypes.string,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    className: PropTypes.string,
    modalid: PropTypes.string,
    onClick: PropTypes.func
}

SolidButton.defaultProps = {
    isSubmit: false,
    type: '',
    href: '',
    className: '',
    modalid: null,
    onClick: () => {}
}

const SVGBorder = ({show}) => {
    
    return show === true ? (
        <svg className="outline" viewBox="0 0 250 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">
                    <stop stopColor="#08AEEA" offset="0%"></stop>
                    <stop stopColor="#2AE88A" offset="100%"></stop>
                </linearGradient>
            </defs>
            <path fill="none" d='M50,95 a45,45 0 0,1 0,-90 h150 a45,45 0 1,1 0,90 h-150' />
            <path className="icon--plain" fill="url(#linearGradient-1)" d='M50,95 a45,45 0 0,1 0,-90 h150 a45,45 0 1,1 0,90 h-150' />
        </svg>
    ) : '';
}

SVGBorder.propTypes = {
    show: PropTypes.bool
}

SVGBorder.defaultProps = {
    show: false
}

export default SolidButton;