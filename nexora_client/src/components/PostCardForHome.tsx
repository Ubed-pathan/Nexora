import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { MdOutlineInsertComment } from "react-icons/md";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import React, { useState } from "react";
import axios from "axios";

export default function PostCardForHome({
  postId,
  avtar,
  desc,
  date,
  userName,
  blogImage,
  like = 0,
  disLikes = 0,
  alReadyLike = false,
  alReadyDisLike = false,
  handleSave,
  handleClickOnComment,
  onUserClick
}: {
  postId: string;
  avtar: string;
  desc: string;
  date: string;
  userName: string;
  blogImage: string;
  like?: number;
  disLikes?: number;
  alReadyLike?: boolean;
  alReadyDisLike?: boolean;
  handleSave: (postId: string) => void;
  handleClickOnComment: (postId: string) => void;
  onUserClick: (userData: {
    id: string;
    username: string;
    avtar: string;
  }) => void;
}) {
  const [clickOnThreeDots, setClickOnThreeDots] = useState(false);
  const [isLiked, setIsLiked] = useState(alReadyLike);
  const [isDisliked, setIsDisliked] = useState(alReadyDisLike);
  const [likeCount, setLikeCount] = useState(like);
  const [dislikeCount, setDislikeCount] = useState(disLikes);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/post/like`,
        { postId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLiked((prev) => !prev);
        setIsDisliked(false);
        setLikeCount(response.data.totalLikes);
        setDislikeCount(response.data.totalDislikes);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/post/${postId}/dislike`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsDisliked((prev) => !prev);
        setIsLiked(false);
        setDislikeCount(response.data.totalDisLikes);
        setLikeCount(response.data.totalLikes);
      }
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return d.toISOString().split("T")[0];
  };

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className="w-full bg-bg-200 md:border md:border-primary-100 shadow-lg md:rounded-lg mb-3 md:mb-6"
      onClick={() => clickOnThreeDots && setClickOnThreeDots(false)}
    >
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
              <img
                src={avtar}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {userName}
              </h3>
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
              <div className="flex flex-col gap-2 bg-bg-300 border border-text-200 p-2 rounded-lg text-center absolute z-10 right-0 top-6 shadow-lg">
                <div
                  className="text-gray-800 cursor-pointer"
                  onClick={() => {
                    setClickOnThreeDots(false)
                    handleSave(postId);
                  }}
                >
                  Save
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:px-3">
        <div className="w-full aspect-w-16 aspect-h-9 md:rounded-lg overflow-hidden">
          <img
            src={blogImage}
            alt="Blog"
            className="object-contain w-full h-full max-h-[450px] md:max-h-[600px] sm:max-h-52"
          />
        </div>
      </div>

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

      <div className="px-3 pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 text-gray-600">
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

            <div className="flex flex-col items-center"
            onClick={() => handleClickOnComment(postId)}>
              <span className="text-gray-800">Comments</span>
              <MdOutlineInsertComment size={25} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
