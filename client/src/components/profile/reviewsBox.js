import '../../static/css/components/reviewsBox.css'
import PropTypes from 'prop-types';

const ReviewsBox = (props) => {

    return (
        <div class="reviews-box-container">
            <h3 className="reviews-box-title">Puntuación</h3>
            <div class="reviews-box-stars">
                <img className="reviews-box-img" src={require("../../static/files/icons/yellow-star.png")} alt="Icono estrella"></img>
                <p className="reviews-box-average">{`${props.total > 0 ? parseFloat(props.average).toFixed(2) + ' / 5.00' : '- / -'}`}</p>
            </div>
            <div className="reviews-box-total">
                <p className="reviews-box-total-text">Dispone de {parseInt(props.total)} {`${props.total === 1 ? 'valoración' : 'valoraciones'}`}</p>
            </div>
        </div>
    );
}

ReviewsBox.propTypes = {
    average: PropTypes.number,
    total: PropTypes.number
}

ReviewsBox.defaultProps = {
    average: 0.0,
    total: 0
}

export default ReviewsBox;