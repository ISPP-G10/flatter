import '../static/css/sections/hero.css';

import PropTypes from "prop-types";

const Hero = (props) => {

    const coverBg = require(`../static/files/images/${props.background}`);

    let classes = 'hero';
    classes += props.class.length ? ` ${props.class}` : '';

    return (
        <div className={classes} style={{height: `${props.height}vh`, backgroundImage: `url(${coverBg})`}}>
            {props.children}
        </div>
    );
}

Hero.propTypes = {
    height: PropTypes.number,
    background: PropTypes.string,
    class: PropTypes.string
}

Hero.defaultProps = {
    height: 100/3,
    class: '',
    background: 'hero-home-background.jpg'
}

export default Hero;