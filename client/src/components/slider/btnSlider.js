import React from "react";
import '../../static/css/components/Slider.css'
import leftArrow from "../../static/files/icons/left-arrow.svg";
import rightArrow from "../../static/files/icons/right-arrow.svg";

export default function BtnSlider({ direction, moveSlide }) {
  //console.log(direction, moveSlide);
  return (
    <button
      onClick={moveSlide}
      className={direction === "next" ? "btn-slide next" : "btn-slide prev"}
    >
      <img src={direction === "next" ? rightArrow : leftArrow} alt="Siguiente"/>
    </button>
  );
}
