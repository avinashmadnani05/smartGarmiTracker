import { StarIcon } from "lucide-react";
import React from "react";

const data = [
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
];

const Feedbacks = () => {
  return (
    <div className="flex flex-col gap-2">
      {data.map((dat, i) => {
        return (
          <div key={i} className="bg-cyan-600 px-2 py-0.5 w-92 rounded-xl">
            <div className="font-bold tracking-wide text-xl">
              {dat.username}
            </div>
            <div className="-m-0.5">{dat.comment} </div>
            <div>rating: {dat.rating}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Feedbacks;
