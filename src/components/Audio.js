import React, { useState, useRef, useEffect } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS on load
  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(checkIOS);
  }, []);

  // Start recording for supported devices
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      chunks.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'recording.webm';
    a.click();
  };

  // iOS file input handler
  const handleIOSAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="audioOuter">
      <div className="audioInner container">
        <h2>Audio Recorder</h2>
        <p>
          Record your voice or any audio using your device's microphone.
          Works in modern browsers. iPhone users will use the native recorder.
        </p>

        {isIOS ? (
          <>
            <input
              type="file"
              accept="audio/*"
              capture="microphone"
              onChange={handleIOSAudioUpload}
            />
          </>
        ) : (
          <>
            <button onClick={recording ? stopRecording : startRecording}>
              {recording ? 'Stop Recording' : 'Start Recording Audio'}
            </button>
          </>
        )}

        {audioUrl && (
          <div style={{ marginTop: '20px' }}>
            <audio controls src={audioUrl}></audio>
            <br />
            <button onClick={downloadAudio}>Download Audio</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioRecorder;
