import React, { useState, useRef, useEffect } from "react";
import "../static/css/sections/rangeSelector.css";

const RangeSelector = ({ min, max, onClick }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [minThumbActive, setMinThumbActive] = useState(false);
  const [maxThumbActive, setMaxThumbActive] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = (event, thumb) => {
    event.preventDefault();
    if (thumb === "min") {
      setMinThumbActive(true);
    } else if (thumb === "max") {
      setMaxThumbActive(true);
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    setMinThumbActive(false);
    setMaxThumbActive(false);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    if (minThumbActive || maxThumbActive) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const sliderLeft = sliderRef.current.getBoundingClientRect().left;
      const mouseX = event.clientX;
      const range = max - min;
      const step = 1;
      const stepSize = (sliderWidth / range) * step;

      let newValue =
        Math.round((mouseX - sliderLeft) / stepSize) * step + min;

      if (minThumbActive && newValue <= maxValue && newValue >= min) {
        setMinValue(newValue);
        onClick(newValue, maxValue);
      } else if (maxThumbActive && newValue >= minValue && newValue <= max) {
        setMaxValue(newValue);
        onClick(minValue, newValue);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [minThumbActive, maxThumbActive]);

  return (
    <div
      className="range-selector"
      ref={sliderRef}
      onMouseDown={(event) => handleMouseDown(event, null)}
    >
      <div
        className="thumb left"
        style={{ left: ((minValue - min) / (max - min)) * 100 + "%" }}
        onMouseDown={(event) => handleMouseDown(event, "min")}
      />
      <div
        className="thumb right"
        style={{ left: ((maxValue - min) / (max - min)) * 100 + "%" }}
        onMouseDown={(event) => handleMouseDown(event, "max")}
      />
      <div
        className="track"
        style={{
          left: ((minValue - min) / (max - min)) * 100 + "%",
          width: ((maxValue - minValue) / (max - min)) * 100 + "%",
        }}
      />
    </div>
  );
};

export default RangeSelector;