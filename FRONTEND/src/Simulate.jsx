// frontend/src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';


function Simuate() {
  const [sensorValue, setSensorValue] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [feedback, setFeedback] = useState({ location: '', temperature_reported: '', description: '' });
  const [feedbackResponse, setFeedbackResponse] = useState(null);

  const handlePredict = async () => {
    try {
      const res = await axios.get('http://localhost:8000/predict', {
        params: { current_temp: sensorValue }
      });
      setPrediction(res.data.predicted_temperature);
    } catch (error) {
      console.error("Prediction error", error);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/feedback', feedback);
      setFeedbackResponse(res.data.message);
    } catch (error) {
      console.error("Feedback error", error);
    }
  };

  return (
    <div className="App">
      <h1>Urban Heat Island Prediction</h1>
      <div>
        <input
          type="number"
          placeholder="Enter sensor temperature"
          value={sensorValue}
          onChange={(e) => setSensorValue(e.target.value)}
        />
        <button onClick={handlePredict}>Predict Temperature</button>
        {prediction && (
          <p>Predicted Temperature: {prediction.toFixed(2)} °C</p>
        )}
      </div>
      <hr />
      <h2>Submit Feedback</h2>
      <form onSubmit={handleFeedbackSubmit}>
        <input
          type="text"
          placeholder="Location (e.g., downtown)"
          value={feedback.location}
          onChange={(e) => setFeedback({...feedback, location: e.target.value})}
        /><br />
        <input
          type="number"
          placeholder="Reported temperature"
          value={feedback.temperature_reported}
          onChange={(e) => setFeedback({...feedback, temperature_reported: e.target.value})}
        /><br />
        <textarea
          placeholder="Feedback description"
          value={feedback.description}
          onChange={(e) => setFeedback({...feedback, description: e.target.value})}
        /><br />
        <button type="submit">Submit Feedback</button>
      </form>
      {feedbackResponse && <p>{feedbackResponse}</p>}
    </div>
  );
}

export default Simuate;
