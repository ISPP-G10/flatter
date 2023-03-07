import React, { useState } from "react";
import '../static/css/sections/imageUploader.css';

import PropTypes from "prop-types";

import DOMPurify from 'dompurify';

function ImageUploader({name}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      const previewArray = fileArray.map((file) => DOMPurify.sanitize(URL.createObjectURL(file)));
      setImagePreviews(previewArray);
    }
  };  

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
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewArray);
    }
  };

  const handleRemoveImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    const newImagePreviews = [...imagePreviews];
    if (index !== mainImageIndex) {
      newSelectedFiles.splice(index, 1);
      newImagePreviews.splice(index, 1);
      setSelectedFiles(newSelectedFiles);
      setImagePreviews(newImagePreviews);
      if (mainImageIndex > index) {
        setMainImageIndex(mainImageIndex - 1);
      }
    }
  };

  const handleMainImageClick = (index) => {
    setMainImageIndex(index);
  };

  return (
    <div>
      <div className="image-preview-container">
        <div className="main-image-preview">
          {selectedFiles.length > 0 && (
            <img
              src={DOMPurify.sanitize(imagePreviews[mainImageIndex])}
              alt={`preview-${mainImageIndex}`}
            />
          )}
        </div>
        <div className="thumbnail-container">
          {selectedFiles.length > 0 &&
            imagePreviews.map((preview, index) => (
              <div
                className={`thumbnail ${
                  mainImageIndex === index ? "selected" : ""
                }`}
                key={index}
                onClick={() => handleMainImageClick(index)}
              >
                <img src={DOMPurify.sanitize(preview)} alt={`preview-${index}`} />
                <button type="button" onClick={() => handleRemoveImage(index)}>x</button>
              </div>
            ))}
        </div>
      </div>
      <div
        className="image-uploader-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="image-upload-placeholder">
          <span>Arrastra imágenes o haz click aquí</span>
          <input name={ name } type="file" multiple onChange={handleImageChange} />
        </div>
      </div>
    </div>
  );
}

ImageUploader.propTypes = {
  name: PropTypes.string
}

ImageUploader.defaultProps = {
  name: ""
}

export default ImageUploader;
