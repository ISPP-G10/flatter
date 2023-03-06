import { useState, useEffect } from "react";
import "../static/css/components/slideShow.css";

const SlideShow = ({ images }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[n - 1].style.display = "block";
  }

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  function plusSlides(n) {
    if (n === -1 && slideIndex === 1) {
      setSlideIndex(images.length);
      return;
    } else if (n === 1 && slideIndex === images.length) {
      setSlideIndex(1);
      return;
    } else {
      setSlideIndex(slideIndex + n);
    }
  }

  return (
    <>
      <div className="slideshow-container">
        {images.map((image, index) => (
          <div className="mySlides fade" key={index}>
            <div className="numbertext">
              {index + 1} / {images.length}
            </div>
            <img
              src={image}
              style={{ width: "100%" }}
              alt={"Slide" + (index + 1)}
            />
          </div>
        ))}{" "}
        <button className="prev arrow" onClick={() => plusSlides(-1)}>
          &#10094;
        </button>
        <button className="next arrow" onClick={() => plusSlides(1)}>
          &#10095;
        </button>
      </div>
    </>
  );
};

export default SlideShow;
