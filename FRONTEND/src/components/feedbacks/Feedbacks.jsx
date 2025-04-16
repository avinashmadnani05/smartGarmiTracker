import { StarIcon } from "lucide-react";
import React from "react";

const data = [{ username: "deep", rating: 4, comment: "very cold here soo much thandi" },{ username: "Avinash", rating: 2, comment: "very hot here soo much garmi" }];

const Feedbacks = () => {
   const HandleRating = (rating) =>{
    let i =0;
    while(rating!==0){
        i++
        rating --;
    }
 
   }
  return (
    <div className="flex flex-col gap-2">
      {data.map((dat, i) => {
        return (
          <div key={i} className="bg-cyan-600 px-2 py-0.5 w-92 rounded-xl">
            <div className="font-bold tracking-wide text-xl">{dat.username}</div>
            <div className="-m-0.5">{dat.comment} </div>
            <div>{HandleRating(dat.rating)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Feedbacks;
