import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { MdOutlineInsertComment } from "react-icons/md";
import React from "react";

export default function PostCard({
  avtar,
  title,
  desc,
  date,
  userName,
  blogImage,
}: {
  avtar: string;
  title: string;
  desc: string;
  date: string;
  userName: string;
  blogImage: string;
}) {
  const [clickOnThreeDots, setClickOnThreeDots] = React.useState(false);

  return (
    <div
      className="w-full bg-bg-200 border border-primary-100 shadow-lg rounded-lg p-6 mb-6"
      onClick={() => {
        if (clickOnThreeDots) setClickOnThreeDots(false);
      }}
    >
      <div className=" flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
            <img src={avtar} alt="Avatar" className="object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{userName}</h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        <div className="relative">
          <div
            className="text-gray-600 cursor-pointer"
            onClick={() => setClickOnThreeDots(!clickOnThreeDots)}
          >
            <PiDotsThreeOutlineVertical size={20} />
          </div>
          {clickOnThreeDots && (
            <div className="flex flex-col gap-2 bg-bg-300 border border-text-200 p-2 rounded-lg text-center absolute z-10 right-0 top-6 shadow-lg">
              <div
                className="text-gray-800 cursor-pointer"
                onClick={() => setClickOnThreeDots(!clickOnThreeDots)}
              >
                Save
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <img
            src={blogImage}
            alt="Blog"
            className="object-cover w-full h-full max-h-[600px] md:max-h-[650px] sm:max-h-52"
          />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{desc}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-gray-600">
          <SlLike size={25} className="cursor-pointer" />
          <SlDislike size={25} className="cursor-pointer" />
          <MdOutlineInsertComment size={25} className="cursor-pointer" />
        </div>
        <div
          className="text-blue-600 font-semibold cursor-pointer"
          onClick={() => console.log("Read More clicked")}
        >
          Read More
        </div>
      </div>
    </div>
  );
}
