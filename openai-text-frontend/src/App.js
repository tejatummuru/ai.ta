import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import GavelIcon from './components/GavelIcon';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBanging, setIsBanging] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult('');
    setExplanation('');

    try {
      const res = await axios.post('http://localhost:3000/analyze-text', { text });
      setIsBanging(true);
      setTimeout(() => {
        setIsBanging(false);
        splitResult(res.data.result);
      }, 500);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResult('Error analyzing text.');
    } finally {
      setIsLoading(false);
    }
  };

  const splitResult = (fullText) => {
    const [judgment, ...rest] = fullText.split('\n');
    setResult(judgment.trim());
    setExplanation(rest.join(' ').trim());
  };

  return (
    <div className="min-h-screen bg-purple-700 flex flex-col justify-center items-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="text-center mb-4">
          <h1 className="text-yellow-400 text-5xl mb-2 shadow-custom-border font-computer">AITA Detector</h1>
          <textarea
            className="w-full p-3 border bg-light-purple border-gray-300 shadow-custom-border font-roboto mb-2 mt-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your story here..."
          />
          <div className="gavel-container flex items-center justify-center">
            <GavelIcon onClick={handleSubmit} isBanging={isBanging} />
            <div className="result-text ml-2 text-xl font-computer">
              {result}
            </div>
          </div>
        </form>
        <div className="bg-yellow-300 p-4 rounded-md shadow-md">
          <h2 className="text-purple-700 font-bold">Result:</h2>
          <p className="text-purple-700">{explanation}</p>
        </div>
      </div>
    </div>
  );
}

export default App;