import React, { useState, useEffect } from 'react';
import { Button, Flex, Heading, TextField, View } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { FaEdit, FaCheck } from 'react-icons/fa';
import './ImageGallery.css';
import mooSound from './moo.mp3';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('images')) || [];
    setImages(storedImages);
  }, []);

  const createThumbnail = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 150;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (const file of files) {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const thumbnailDataUrl = await createThumbnail(file);

      newImages.push({ key: uniqueFileName, caption: file.name, isEditing: false, thumbnail: thumbnailDataUrl });
    }

    setImages((prevImages) => {
      const updatedImages = [...prevImages, ...newImages];
      localStorage.setItem('images', JSON.stringify(updatedImages));
      return updatedImages;
    });

    const moo = new Audio(mooSound);
    moo.play();
  };

  const handleDelete = async (key) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((image) => image.key !== key);
      localStorage.setItem('images', JSON.stringify(updatedImages));
      return updatedImages;
    });
  };

  const handleCaptionChange = (key, newCaption) => {
    setImages(
      images.map((image) =>
        image.key === key ? { ...image, caption: newCaption } : image
      )
    );
  };

  const handleCaptionSave = async (key) => {
    const image = images.find(img => img.key === key);
    if (image) {
      console.log(`Saving caption "${image.caption}" for image with key "${key}"`);
    }

    setImages(
      images.map((image) =>
        image.key === key ? { ...image, isEditing: false } : image
      )
    );
  };

  const handleCaptionEdit = (key) => {
    setImages(
      images.map((image) =>
        image.key === key ? { ...image, isEditing: true } : image
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
      <Heading level={2} color="#4285F4" marginBottom="20px">My S3 Image Gallery</Heading>
      <input id="file-upload" type="file" onChange={handleFileChange} multiple hidden />
      <label htmlFor="file-upload" className="upload-button">
        Upload Images
      </label>
      <View className="image-grid">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.key} className="image-grid-item">
              <img
                src={image.thumbnail}
                alt={image.caption}
                className="grid-image"
                onClick={() => handleExpand(image)} 
                onLoad={(e) => {
                  e.target.style.display = 'block';
                }}
              />
              <StorageImage
                imgKey={image.key}
                alt={image.caption}
                className="grid-image"
                style={{ display: 'none' }}
                onLoad={(e) => {
                  e.target.previousSibling.style.display = 'none'; 
                  e.target.style.display = 'block';
                }}
                onClick={() => handleExpand(image)} 
              />
              {image.isEditing ? (
                <div className="caption-container">
                  <TextField
                    placeholder="Enter a caption"
                    value={image.caption}
                    onChange={(e) => handleCaptionChange(image.key, e.target.value)}
                    className="caption-input"
                  />
                  <Button
                    onClick={() => handleCaptionSave(image.key)}
                    className="icon-button"
                  >
                    <FaCheck />
                  </Button>
                </div>
              ) : (
                <div className="caption-container">
                  <span>{image.caption}</span>
                  <Button
                    onClick={() => handleCaptionEdit(image.key)}
                    className="icon-button"
                  >
                    <FaEdit />
                  </Button>
                </div>
              )}
              <Button
                onClick={() => handleDelete(image.key)}
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
          <div className="modal-content">
            <StorageImage imgKey={expandedImage.key} alt={expandedImage.caption} className="expanded-image" />
          </div>
        </div>
      )}
    </Flex>
  );
};

export default ImageGallery;
