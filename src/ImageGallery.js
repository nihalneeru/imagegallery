import React, { useState } from 'react';
import { Button, Flex, Heading, TextField, View } from '@aws-amplify/ui-react';
import { FaEdit, FaCheck } from 'react-icons/fa';
import './ImageGallery.css';
import mooSound from './moo.mp3'; // Import the moo sound

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file), // Generate a temporary URL for the image
      file,
      caption: '',
      isEditing: true,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);

    // Play moo sound on successful upload
    const moo = new Audio(mooSound);
    moo.play();
  };

  const handleDelete = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const handleCaptionChange = (id, newCaption) => {
    setImages(
      images.map((image) =>
        image.id === id ? { ...image, caption: newCaption } : image
      )
    );
  };

  const handleCaptionEdit = (id) => {
    setImages(
      images.map((image) =>
        image.id === id ? { ...image, isEditing: true } : image
      )
    );
  };

  const handleCaptionSave = (id) => {
    setImages(
      images.map((image) =>
        image.id === id ? { ...image, isEditing: false } : image
      )
    );
  };

  const handleExpand = (image) => {
    setExpandedImage(image);
  };

  const handleClose = () => {
    setExpandedImage(null);
  };

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" padding="20px" className="gallery-container">
      <Heading level={2} color="#4285F4" marginBottom="20px">Your Image Gallery</Heading>
      <input id="file-upload" type="file" onChange={handleFileChange} multiple hidden />
      <label htmlFor="file-upload" className="upload-button">
        Upload Images
      </label>
      <p className="volume-notice">Volume Up!!!</p>
      <View className="image-grid">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="image-grid-item">
              <img
                src={image.id}
                alt="Uploaded"
                className="grid-image"
                onClick={() => handleExpand(image)}
              />
              {image.isEditing ? (
                <div className="caption-container">
                  <TextField
                    placeholder="Enter a caption"
                    value={image.caption}
                    onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                    className="caption-input"
                  />
                  <Button
                    onClick={() => handleCaptionSave(image.id)}
                    className="icon-button"
                  >
                    <FaCheck />
                  </Button>
                </div>
              ) : (
                <div className="caption-container">
                  <span>{image.caption}</span>
                  <Button
                    onClick={() => handleCaptionEdit(image.id)}
                    className="icon-button"
                  >
                    <FaEdit />
                  </Button>
                </div>
              )}
              <Button
                onClick={() => handleDelete(image.id)}
                className="delete-button"
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No images to display.</p>
        )}
      </View>

      {expandedImage && (
        <div className="modal-container" onClick={handleClose}>
          <img src={expandedImage.id} alt="Expanded" className="expanded-image" />
        </div>
      )}
    </Flex>
  );
};

export default ImageGallery;
