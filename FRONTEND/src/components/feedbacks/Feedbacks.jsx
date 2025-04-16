import React, { useState } from "react";
import { Delete, DeleteIcon, StarIcon, Trash2 } from "lucide-react";

const Feedbacks = () => {
  // Initial feedback data stored in state.
  const [data, setData] = useState([
    {
      username: "deep",
      rating: 4,
      comment: "very hot here need to increase forest cover",
    },
    {
      username: "Avinash",
      rating: 2,
      comment: "local ponds are drying up cause of heat",
    },
  ]);

  // Local state for the form inputs.
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(0); // Rating stored as a number.
  const [comment, setComment] = useState("");

  // Handle form submission to add a new feedback.
  const handleSubmit = (e) => {
    e.preventDefault();

    const newFeedback = {
      username,
      rating, // Already a number.
      comment,
    };

    // Append the new feedback item to current data.
    setData([...data, newFeedback]);

    // Clear form inputs for the next entry.
    setUsername("");
    setRating(0);
    setComment("");
  };

  // Handle deletion of a feedback entry.
  const handleDelete = (indexToDelete) => {
    setData(data.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Form for adding feedback */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 border rounded"
      >
        <div className="flex flex-col">
          <label className="font-semibold">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-2 py-1 border rounded"
          />
        </div>

        {/* Star selection for rating */}
        <div className="flex flex-col">
          <label className="font-semibold">Rating:</label>
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`w-6 h-6 transition-colors ${
                    i < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="px-2 py-1 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Feedback
        </button>
      </form>

      {/* Display all feedback items */}
      <div className="flex flex-col gap-2">
        {data.map((dat, i) => (
          <div
            key={i}
            className="bg-cyan-600 px-2 py-0.5 w-92 rounded-xl flex flex-col gap-1 relative"
          >
            <div className="font-bold tracking-wide text-xl">
              {dat.username}
            </div>
            <div className="-m-0.5">{dat.comment}</div>
            <div className="flex gap-1">
              {Array.from({ length: dat.rating }, (_, idx) => (
                <StarIcon key={idx} className="text-yellow-500 w-5 h-5" />
              ))}
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="bg-red-300 absolute bottom-0 right-0 text-white px-2 py-1 rounded hover:bg-red-600 transition self-start"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
