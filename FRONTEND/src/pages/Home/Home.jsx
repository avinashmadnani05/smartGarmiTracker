import React, { useState } from "react";
import Heatmap from "../../components/heatmap/heatmap";
import Ai from "../../components/AI/Ai";
import Feedbacks from "../../components/feedbacks/feedbacks";
import { Command, MessageCircle, MessageSquare } from "lucide-react";

const Home = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };
  return (
    <>
      <div className="w-full flex flex-col items-center gap-10">
        <div className="flex gap-10 w-full justify-between py-1 px-2">
            <Ai />
            <button className="bg-blue-500 w-10 rounded-4xl flex justify-center items-center"><MessageSquare/></button>
        </div>
        <div className="h-96 w-[600px] flex items-center flex-col">
          Local Heatmap
          <Heatmap />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-[400px] gap-2 p-2"
        >
          UNI- Calculator
          <label className="flex justify-between w-full">
            Average Temprature
            <input
              className="border-white border-2 rounded-md"
              type="number"
              name="avg_temp"
              value={formData.avg_temp || ""}
              onChange={handleChange}
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
            />
          </label>
          <button
            type="submit"
            className="w-fit bg-blue-800 px-4 py-0.5 rounded-2xl mt-2"
          >
            Submit
          </button>
        </form>
        
           
            <Feedbacks />
        
      </div>
    </>
  );
};

export default Home;
