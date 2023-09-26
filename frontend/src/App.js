import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import Dnd from "./components/Dnd";
// // Set the base URL for Axios requests
// axios.defaults.baseURL = "http://localhost:8000"; // Update with your FastAPI server URL

function App() {
  //   const [message, setMessage] = useState("");

  //   useEffect(() => {
  //     // Make an HTTP GET request to /hello
  //     axios
  //       .get("/")
  //       .then((response) => {
  //         // Set the response data (e.g., "Hello, World!") in the state
  //         setMessage(response.data.message);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Dnd />
      </div>
    </DndProvider>
  );
}

export default App;
