import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import GavelIcon from './components/GavelIcon';
import { FaPlus, FaKeyboard, FaImage, FaMicrophone } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';

function App() {
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBanging, setIsBanging] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState('text');
  const [imagePreview, setImagePreview] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const waveformRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current && audioData) {
      const blobUrl = URL.createObjectURL(audioData);
      console.log('Audio Blob URL:', blobUrl);
      waveformRef.current.load(blobUrl);
    }
  }, [audioData]);

  useEffect(() => {
    if (inputType === 'audio' && !waveformRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
      });
    }
  }, [inputType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setVerdict('');
    setExplanation('');

    try {
      if (inputType === 'text') {
        const res = await axios.post('http://localhost:3000/analyze-text', { text });
        setIsBanging(true);
        setTimeout(() => {
          setIsBanging(false);
          setVerdict(res.data.verdict);
          setExplanation(res.data.explanation);
        }, 500);
      } else if (inputType === 'image') {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('http://localhost:3000/analyze-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setVerdict(res.data.verdict);
        setExplanation(res.data.explanation);
      } else if (inputType === 'audio') {
        console.log('Audio Data:', audioData);
        const formData = new FormData();
        formData.append('audio', audioData, 'audio.wav');
        console.log('FormData:', formData);
        const res = await axios.post('http://localhost:3000/analyze-audio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setVerdict(res.data.verdict);
        setExplanation(res.data.explanation);
      }
    } catch (error) {
      console.error(`Error analyzing ${inputType}:`, error);
      setVerdict(`Error analyzing ${inputType}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconClick = (type) => {
    setInputType(type);
    if (type === 'image') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.error('File input element not found');
      }
    } else if (type === 'text') {
      setText('');
      setFile(null);
      setImagePreview(null);
      setAudioData(null);
    } else if (type === 'audio') {
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log('Audio Blob:', audioBlob);
        setAudioData(audioBlob);
        setIsRecording(false);
      });
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-purple-700 flex flex-col justify-center items-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="text-center mb-4 relative">
          <h1 className="text-yellow-400 text-5xl mb-2 shadow-custom-border font-computer">AITA Detector</h1>
          {inputType === 'text' && (
            <textarea
              className="w-full p-3 border bg-light-purple border-gray-300 shadow-custom-border font-roboto mb-2 mt-8"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your story here..."
            />
          )}
          {inputType === 'image' && (
            <>
              <input 
                type="file" 
                id="fileInput" 
                ref={fileInputRef}
                className="file-input w-full p-3 border bg-light-purple border-gray-300 shadow-custom-border font-roboto mb-2 mt-8"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the file input
              />
              {imagePreview && <img src={imagePreview} alt="Uploaded" className="w-full max-w-xs mx-auto mt-4" />}
            </>
          )}
          {inputType === 'audio' && (
            <>
              <div id="waveform" className="w-full max-w-xs mx-auto mt-4"></div>
              {isRecording && (
                <div className="recording-indicator">Recording...</div>
              )}
            </>
          )}
          <div className="toolbar flex items-center justify-center mb-4">
            <FaPlus 
              className="text-yellow-400 text-2xl cursor-pointer" 
              onClick={() => setShowIcons(!showIcons)} 
            />
            {showIcons && (
              <div className="flex space-x-2 ml-2">
                <FaKeyboard 
                  className="text-yellow-400 text-2xl cursor-pointer" 
                  onClick={() => handleIconClick('text')} 
                />
                <FaImage 
                  className="text-yellow-400 text-2xl cursor-pointer" 
                  onClick={() => handleIconClick('image')} 
                />
                <FaMicrophone 
                  className={`text-yellow-400 text-2xl cursor-pointer ${isRecording ? 'text-red-500' : ''}`} 
                  onClick={() => handleIconClick('audio')} 
                />
              </div>
            )}
          </div>
          <div className="gavel-container flex items-center justify-center">
            <GavelIcon onClick={handleSubmit} isBanging={isBanging} />
            <div className="result-text ml-2 text-xl font-computer">
              {verdict}
            </div>
          </div>
        </form>
        <div className="bg-yellow-300 p-4 rounded-md shadow-md">
          <h2 className="text-purple-700 font-bold">Explanation:</h2>
          <p className="text-purple-700">{explanation}</p>
        </div>
      </div>
    </div>
  );
}

export default App;