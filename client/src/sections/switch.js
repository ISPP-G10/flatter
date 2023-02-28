import "../static/css/sections/switch.css";

const Switch = ({ isOn, handleToggle }) => {

    const toggle = () => {
        isOn = !isOn;
        handleToggle(isOn);
    };
    
    return (
      <div className="switch" onClick={toggle}>
        <div className={`switch-toggle ${isOn ? "switch-toggle--on switch-toggle--blue" : "switch-toggle--orange"}`}
      ></div>
      </div>
    );
  };

export default Switch;