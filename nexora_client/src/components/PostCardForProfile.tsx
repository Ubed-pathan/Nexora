import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { MdOutlineInsertComment } from "react-icons/md";
import React, { useState } from "react";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import axios from "axios";

export default function PostCardForProfile({
  postId,
  desc,
  date,
  imageUrl,
  like,
  disLikes,
  alReadyLike,
  alReadyDisLike,
  handleClickOnComment,
}: {
  postId: string;
  desc: string;
  date: string;
  imageUrl: string;
  like?: number;
  disLikes?: number;
  alReadyLike: boolean;
  alReadyDisLike: boolean;
  handleClickOnComment: (postId: string) => void;
}) {
  const [clickOnThreeDots, setClickOnThreeDots] = React.useState(false);
  const [isLiked, setIsLiked] = useState(alReadyLike);
  const [isDisliked, setIsDisliked] = useState(alReadyDisLike);
  const [likeCount, setLikeCount] = useState(like);
  const [dislikeCount, setDislikeCount] = useState(disLikes);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/post/like`,
        { postId: postId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLiked((prev) => !prev);
        setIsDisliked(false);
        setLikeCount(response.data.totalLikes as number);
        setDislikeCount(response.data.totalDislikes as number);
      }
    } catch (error) {
      //
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/post/${postId}/dislike`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsDisliked((prev) => !prev);
        setIsLiked(false);
        setDislikeCount(response.data.totalDisLikes as number);
        setLikeCount(response.data.totalLikes as number);
      }
    } catch (error) {
      //
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toISOString().split("T")[0];
    }
  };

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className=" flex flex-col h-full w-full bg-bg-200 md:border md:border-primary-100 shadow-lg md:rounded-lg mb-3 md:mb-6"
      onClick={() => {
        if (clickOnThreeDots) setClickOnThreeDots(false);
      }}
    >
      <div className="p-3">
        <div className=" flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">{formatTimeAgo(date)}</p>
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
              <div className="flex flex-col gap-2 bg-bg-300 border border-text-200 p-2 rounded-lg text-center absolute z-0 right-0 top-6 shadow-lg">
                <div
                  className="text-gray-800 cursor-pointer"
                  onClick={() => setClickOnThreeDots(!clickOnThreeDots)}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:px-3">
        {/* <div className="w-full aspect-w-16 aspect-h-9 md:rounded-lg overflow-hidden">
          <img
            src={blogImage}
            alt="Blog"
            className="object-cover w-full h-full max-h-[600px] md:max-h-[650px] sm:max-h-52"
          />
        </div> */}

        <div className="w-full overflow-hidden md:rounded-lg">
          <img
            src={imageUrl}
            alt="Blog"
            className="w-full h-auto max-h-[60vh] md:max-h-[450px] sm:max-h-[300px] object-contain"
          />
        </div>
      </div>
      {/* <p className="text-gray-600 mb-2 px-2">{desc}</p> */}
      <div className="group relative mx-4 my-3">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary-100/30 rounded-full" />
        <p
          className="pl-4 py-2 text-gray-700 text-[15px] leading-relaxed
    first-letter:text-2xl first-letter:font-bold first-letter:text-primary-100
    hover:bg-white/50 rounded-r-lg transition-all duration-300
    break-words whitespace-pre-wrap max-h-40 overflow-hidden"
        >
          {truncate(desc, 150)}
        </p>
      </div>

      <div className="px-3 pb-3 bottom-0 mt-auto left-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex flex-col items-center">
              <span className="text-gray-800">{likeCount}</span>
              {isLiked ? (
                <BiSolidLike
                  size={25}
                  className="cursor-pointer text-blue-500"
                  onClick={handleLike}
                />
              ) : (
                <BiLike
                  size={25}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleLike}
                />
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-800">{dislikeCount}</span>
              {isDisliked ? (
                <BiSolidDislike
                  size={25}
                  className="cursor-pointer text-red-500"
                  onClick={handleDislike}
                />
              ) : (
                <BiDislike
                  size={25}
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDislike}
                />
              )}
            </div>

            <div className="flex flex-col items-center"  onClick={() => handleClickOnComment(postId)}>
              <span className="text-gray-800">Comments</span>
              <MdOutlineInsertComment size={25} className="cursor-pointer" />
            </div>
          </div>
          {/* <div
          className="text-blue-600 font-semibold cursor-pointer"
          onClick={() => console.log("Read More clicked")}
        >
          Read More
        </div> */}
        </div>
      </div>
    </div>
  );
}
