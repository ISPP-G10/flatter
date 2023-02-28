import '../static/css/sections/hero.css';

import PropTypes from "prop-types";
import useWindowDimensions from '../hooks/useWindowDimesions';

import {useEffect, useRef} from 'react';

const Hero = (props) => {

    const horizontalBg = require(`../static/files/images/${props.horizontalBackground}`);
    const verticalBg = require(`../static/files/images/${props.verticalBackground}`);

    const {height, width} = useWindowDimensions();

    let heroDiv = useRef(null);

    let classes = 'hero';
    classes += props.class.length ? ` ${props.class}` : '';

    useEffect(() => {
        if (width < height) {
            heroDiv.current.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${verticalBg})`;
        }else{
            heroDiv.current.style.backgroundImage = `url(${horizontalBg})`;
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div ref={heroDiv} className={classes} style={{height: `${props.height}vh`, backgroundSize: 'cover'}}>
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