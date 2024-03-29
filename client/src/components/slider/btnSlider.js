import React from "react";
import '../../static/css/components/slider-style.css'
import leftArrow from "../../static/files/icons/left-arrow.svg";
import rightArrow from "../../static/files/icons/right-arrow.svg";

export default function BtnSlider({ direction, moveSlide }) {
  return (
    <button
      onClick={moveSlide}
      className={direction === "next" ? "btn-slide next" : "btn-slide prev"}
    >
      <img src={direction === "next" ? rightArrow : leftArrow} alt="Siguiente"/>
    </button>
  );
}
