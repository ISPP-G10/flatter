import PropTypes from "prop-types";
import "../static/css/components/pricingOption.css";

const PricingOption = (props) => {
  return (
    <div className={`pricing-option ${"pricing-border-" + props.color} `}>
      {props.selectedOption && (
        <p className={`selected-pricing-option selected-${props.color}`}>
          Seleccionado {props.daysLeft && `(${props.daysLeft} días restantes)`}
        </p>
      )}
      {props.children}
    </div>
  );
};

PricingOption.propTypes = {
  selectedOption: PropTypes.bool,
  color: PropTypes.string,
  daysLeft: PropTypes.number,
};

PricingOption.defaultProps = {
  selectedOption: false,
  color: "red",
};

export default PricingOption;
