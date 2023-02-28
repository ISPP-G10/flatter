import React, { useState } from "react";
import "../static/css/components/toggleLandingForm.css";
import Switch from "../sections/switch"

const ToggleLandingForm = (props) => {
  const [isToggled, setIsToggled] = useState(false);

  const toggle = () => {
    setIsToggled(!isToggled);
  };

  const toggleChildren = () => {
    const first_toggle = (
      <div style={{ display: isToggled ? "block" : "none" }}>
        {props.children.props.children[0]}
      </div>
    );

    const second_toggle = (
      <div style={{ display: isToggled ? "none" : "block" }}>
        {props.children.props.children[1]}
      </div>
    );

    return (
      <>
        <div className="toggle-container">
            <span className="switch-label switch-label--left">Inquilino</span>
            <Switch isOn={isToggled} handleToggle={(isOn) => toggle(isOn)} />

            <span className="switch-label switch-label--right">Propietario</span>
        </div>
        <div className="toggle-content">
          {first_toggle}
          {second_toggle}
        </div>
      </>
    );
  };

  return <>{toggleChildren()}</>;
};

export default ToggleLandingForm;