import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/analyze-text', { text });
      setResponse(res.data.result);
    } catch (error) {
      console.error(error);
      setResponse('Error analyzing text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">AITA Detector</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Enter your story..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h2 className="text-xl font-bold">Result:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;