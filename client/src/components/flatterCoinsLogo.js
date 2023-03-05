import PropTypes from 'prop-types';

const FlatterCoinsCounter = ({height, iconWidth, amount}) => {
    return(
        <div className="flatter-coins-row" style={{width: `100%`, height: height ? `${height}px` : 'auto'}}>
            <div style={{width: `${iconWidth}px`, height: `${iconWidth}px`, backgroundColor: "orange"}}></div>
            <span style={{fontSize: `${iconWidth}px`}}>{amount}</span>
        </div>
    );
}

FlatterCoinsCounter.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    iconWidth: PropTypes.number,
    amount: PropTypes.number
}

FlatterCoinsCounter.defaultProps = {
    width: 0,
    height: null,
    iconWidth: 0,
    amount: 0
}

export default FlatterCoinsCounter;