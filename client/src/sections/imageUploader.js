import React, { useState } from "react";
import "../static/css/sections/imageUploader.css";

import PropTypes from "prop-types";

import DOMPurify from "dompurify";

function ImageUploader({ name }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      Promise.all(fileArray.map((file) => blobToBase64(file)))
        .then((base64Array) => {
          setImagePreviews(base64Array);

          document.querySelector(`input[type="hidden"][name="${name}"]`).value = base64Array;
        })
        .catch((error) => console.log(error));
    }
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      Promise.all(fileArray.map((file) => blobToBase64(file)))
        .then((base64Array) => {
          setImagePreviews(base64Array);
          document.getElementById("image-urls").value = JSON.stringify(
            base64Array
          );
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <div className="thumbnail-container">
        {selectedFiles.length > 0 &&
          imagePreviews.map((preview, index) => (
            <div
              className={`thumbnail ${
                mainImageIndex === index ? "selected" : ""
              }`}
              key={index}
            >
              <img src={preview} alt={`preview-${index}`} />
            </div>
          ))}
      </div>
      <div
        className="image-uploader-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="image-upload-placeholder">
          <span>Arrastra imágenes o haz click aquí</span>
          <input type="file" multiple onChange={handleImageChange} />
        </div>
      </div>
      <input type="hidden" id="image-urls" name={name} />
    </div>
  );
}

export default ImageUploader;
