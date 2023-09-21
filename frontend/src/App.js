import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for Axios requests
axios.defaults.baseURL = 'http://localhost:8000'; // Update with your FastAPI server URL

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Make an HTTP GET request to /hello
    axios.get('/')
      .then(response => {
        // Set the response data (e.g., "Hello, World!") in the state
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default App;