import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Audio from './components/Audio';
import Video from './components/Video';
import './app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1 style={{ textAlign: 'center', color: '#000',backgroundColor:'#fff',padding:'10px 0' }}>
      Online Audio & Video Recorder
    </h1>
    <h2 style={{ fontSize:'25px',lineHeight:'30px', textAlign: 'center', color: '#ffa500', fontWeight: 'normal' }}>
      Record. Preview. Download — All in Your Browser.
    </h2>

    <Audio />
    <Video />
  </React.StrictMode>
);
