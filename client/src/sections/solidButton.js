import '../static/css/sections/button.css';

import PropTypes from "prop-types";

const SolidButton = ({text, href, type, isSubmit, className, modalid, setIsMenuOpen}) => {

    let classes = 'button';
    classes += type.length>0 ? ` ${type}` : '';
    classes += className.length>0 ? ` ${className}` : '';

    const isOutlined = type==="outlined";

    return isSubmit ? (
        <button type="submit" className={classes} data-modalid={modalid}>{text} <SVGBorder show={isOutlined} /></button>
    ) : (
        <a href={href} className={classes} data-modalid={modalid} onClick={()=>{setIsMenuOpen(false)}}>{text} <SVGBorder show={isOutlined} /></a>
    );
}

SolidButton.propTypes = {
    text: PropTypes.string,
    href: PropTypes.string,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    className: PropTypes.string,
    modalid: PropTypes.string
}

SolidButton.defaultProps = {
    isSubmit: false,
    type: '',
    href: '',
    className: '',
    modalid: null
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