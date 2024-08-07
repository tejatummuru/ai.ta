import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import GavelIcon from './components/GavelIcon';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBanging, setIsBanging] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      const res = await axios.post('http://localhost:3000/analyze-text', { text });
      setIsBanging(true);
      setTimeout(() => {
        setIsBanging(false);
        typeResult(res.data.result);
      }, 500);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResult('Error analyzing text.');
    } finally {
      setIsLoading(false);
    }
  };

  const typeResult = (fullText) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setResult((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-purple-700 flex flex-col justify-center items-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="text-center mb-4">
          <h1 className="text-yellow-300 text-2xl mb-2">AITA Detector</h1>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your story here..."
          />
          <GavelIcon onClick={handleSubmit} isBanging={isBanging} />
        </form>
        <div className="bg-yellow-300 p-4 rounded-md shadow-md">
          <h2 className="text-purple-700 font-bold">Result:</h2>
          <p className="text-purple-700">{result}</p>
        </div>
      </div>
    </div>
  );
}

export default App;