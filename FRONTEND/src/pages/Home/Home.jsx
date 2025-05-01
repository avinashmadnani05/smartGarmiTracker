import React, { useState } from "react";
import Heatmap from "../../components/heatmap/heatmap";
import Ai from "../../components/AI/Ai";
import Feedbacks from "../../components/feedbacks/Feedbacks";
import { MessageSquare } from "lucide-react";
import axios from "axios"; // Make sure axios is installed

const Home = () => {
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null); // For showing result

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        avg_temp: parseFloat(formData.avg_temp),
        vegetation_index: parseFloat(formData.vegetation_index),
        pollution_level: parseFloat(formData.pollution_level),
      });
      setPrediction(response.data.uhi_severity);
    } catch (error) {
      console.error("Error getting prediction:", error);
      setPrediction("Error getting prediction");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="flex gap-10 w-full justify-between py-1 px-2">
        <Ai />
      </div>

      <div className="h-96 lg:w-[1000px] lg:h-[500px] w-[600px] flex items-center flex-col">
        Local Heatmap
        <Heatmap />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[400px] gap-2 p-2"
      >
        <div>UHI Calculator</div>
        <label className="flex justify-between w-full">
          Average Temperature
          <input
            className="border-white border-2 rounded-md"
            type="number"
            name="avg_temp"
            value={formData.avg_temp || ""}
            onChange={handleChange}
            step="0.1"
          />
        </label>
        <label className="flex justify-between w-full">
          Vegetation Index
          <input
            className="border-white border-2 rounded-md"
            type="number"
            name="vegetation_index"
            value={formData.vegetation_index || ""}
            onChange={handleChange}
            step="0.01"
          />
        </label>
        <label className="flex justify-between w-full">
          Pollution Level
          <input
            className="border-white border-2 rounded-md"
            type="number"
            name="pollution_level"
            value={formData.pollution_level || ""}
            onChange={handleChange}
            step="0.01"
          />
        </label>
        <button
          type="submit"
          className="w-fit bg-blue-800 px-4 py-0.5 rounded-2xl mt-2"
        >
          Submit
        </button>
        {prediction && (
          <div className="mt-4 text-xl font-semibold text-green-200">
            Predicted UHI Severity: {prediction}
          </div>
        )}
      </form>

      <Feedbacks />
    </div>
  );
};

export default Home;
