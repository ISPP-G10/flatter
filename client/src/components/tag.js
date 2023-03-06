import "../static/css/components/tag.css"
import PropTypes from 'prop-types';

const Tag = (props) => {
    return (
        <div className="tag" style={{backgroundColor: props.color}}>
            <span className="tag-name">{props.name}</span>
        </div>
    )
}

Tag.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string
}

Tag.defaultProps = {
    name: "",
    color: ""
}

export default Tag