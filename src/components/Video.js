import React, { useRef, useState, useEffect } from 'react';

function VideoRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(checkIOS);
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoPreviewRef.current.srcObject = stream;
    videoPreviewRef.current.play();

    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
      chunks.current = [];
      stream.getTracks().forEach((track) => track.stop()); // stop camera
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'recording.webm';
    a.click();
  };

  const handleIOSVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="videoOuter">
      <div className="videoInner container">
        <h2>Video Recorder</h2>
        <p>
          Capture video using your device’s camera and microphone. On iPhone, you'll be prompted to use the camera app.
        </p>

        {isIOS ? (
          <input
            type="file"
            accept="video/*"
            capture="user"
            onChange={handleIOSVideoUpload}
          />
        ) : (
          <>
            <video ref={videoPreviewRef} width="300" autoPlay muted></video><br />
            <button onClick={recording ? stopRecording : startRecording}>
              {recording ? 'Stop' : 'Start Recording Video'}
            </button>
          </>
        )}

        {videoUrl && (
          <div>
            <video src={videoUrl} controls width="300"></video><br />
            <button onClick={downloadVideo}>Download Video</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoRecorder;
