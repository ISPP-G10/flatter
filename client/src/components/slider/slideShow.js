import { useState, useEffect } from "react";
import "../../static/css/components/slideShow.css";

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

  function handleMouseOver(e, image) {
    const imageZoom = document.getElementById("imageZoom");
    const img = e.target;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    img.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const bgPosX = Math.min(
        Math.max((mouseX * scaleX - (imageZoom.clientWidth / 2)) * -1, -(img.naturalWidth - imageZoom.clientWidth)),
        0
      );
      const bgPosY = Math.min(
        Math.max((mouseY * scaleY - (imageZoom.clientHeight / 2)) * -1, -(img.naturalHeight - imageZoom.clientHeight)),
        0
      );

      imageZoom.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

      const magnifier = document.getElementById("magnifier");
      magnifier.style.display = "block";
      magnifier.style.left = `${e.clientX - magnifier.clientWidth / 2}px`;
      magnifier.style.top = `${e.clientY - magnifier.clientHeight / 2}px`;

      const offsetX = Math.max(rect.left, Math.min(rect.right - magnifier.clientWidth, e.clientX - magnifier.clientWidth / 2));
      const offsetY = Math.max(rect.top, Math.min(rect.bottom - magnifier.clientHeight, e.clientY - magnifier.clientHeight / 2));
      magnifier.style.left = `${offsetX}px`;
      magnifier.style.top = `${offsetY}px`;
    });

    imageZoom.style.backgroundImage = `url(${image})`;
    imageZoom.style.display = "block";
  }

  function removeMouseMove(e) {
    e.target.removeEventListener("mousemove", null);
  }

  function handleMouseOut() {
    const imageZoom = document.getElementById("imageZoom");
    imageZoom.style.display = "none";
    const magnifier = document.getElementById("magnifier");
    magnifier.style.display = "none";
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
              onMouseOver={(e) => handleMouseOver(e, image)}
              onMouseOut={(e) => {
                handleMouseOut();
                removeMouseMove(e);
              }}
            />
          </div>
        ))}
        <button className="prev arrow" onClick={() => plusSlides(-1)}>
          &#10094;
        </button>
        <button className="next arrow" onClick={() => plusSlides(1)}>
          &#10095;
        </button>
      </div>
      <div id="imageZoom" className="image-zoom"></div>
      <div className="magnifier" id="magnifier"></div>
    </>
  );
}

export default SlideShow;