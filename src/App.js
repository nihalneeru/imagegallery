import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports'; 
import ImageGallery from './ImageGallery';
Amplify.configure(awsExports);

function App() {
  return (
    <div>
      <ImageGallery />
    </div>
  );
}

export default App;
