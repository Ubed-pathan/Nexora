import React, { useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import man from "../assets/OIP.jpg";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";

interface UserBasicInfo {
  id: string;
  username: string;
  secureImageUrl: string;
}

interface CommentPageProps {
  postId: string;
  likedUsers: UserBasicInfo[];
  dislikedUsers: UserBasicInfo[];
  comments: { commentId: string; message: string; userId: string;
    username: string;
    secureImageUrl: string;}[];
  onAddComment?: (postId:string, message: string) => void;
  handleDelete?: (commentId: string) => void;
  handleCloseComment: () => void;
}

const CommentPage: React.FC<CommentPageProps> = ({
  postId,
  likedUsers,
  dislikedUsers,
  comments,
  onAddComment,
  handleDelete,
  handleCloseComment,
}) => {
  const [activeTab, setActiveTab] = useState<"like" | "dislike" | "comment">(
    "comment"
  );

  const [newComment, setNewComment] = useState("");
  const auth = useRecoilValue(authState);

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(postId,newComment.trim());
      setNewComment("");
    }
  };

  const renderTabContent = () => {
    if (activeTab === "like") {
      return (
        <div className="space-y-3">
          {likedUsers.length === 0 ? (
            <p className="text-gray-500">No likes yet.</p>
          ) : (
            likedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-blue-50"
                >
                  <img
                    src={user.secureImageUrl || man}
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-blue-600">Liked this post</p>
                  </div>
                </div>
              ))
          )}
        </div>
      );
    }

    if (activeTab === "dislike") {
      return (
        <div className="space-y-3">
{dislikedUsers.length === 0 ? (
  <p className="text-gray-500">No dislikes yet.</p>
) : (
  dislikedUsers.map((user) => (
    <div
      key={user.id}
      className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-red-50"
    >
      <img
        src={user.secureImageUrl || man}
        alt="avatar"
        className="h-12 w-12 rounded-full object-cover border"
      />
      <div>
        <p className="font-semibold text-gray-800">{user.username}</p>
        <p className="text-sm text-red-600">Disliked this post</p>
      </div>
    </div>
  ))
)}

        </div>
      );
    }

    if (activeTab === "comment") {
      return (
        <div className="space-y-4">
          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="flex items-start justify-between gap-3 bg-gray-100 p-3 rounded-lg"
                >
                  <div className="flex gap-3">
                    <img
                      src={comment.secureImageUrl || man}
                      alt="avatar"
                      className="h-9 w-9 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{comment.username}</p>
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  </div>
              
                  {/* 👇 Show delete button if comment belongs to current user */}
                  {comment.userId === auth.id && (
                    <button
                      onClick={() => {
                         handleDelete?.(comment.commentId)
                        //  console.log(comment.commentId)
                        }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
              
            )}
          </div>

          {/* New Comment Input */}
          <div className="pt-4 border-t">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-bg-200 border rounded-lg shadow-md p-4">
      <div className="flex justify-around mb-4 flex-wrap gap-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            activeTab === "like"
              ? "bg-primary-100 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("like")}
        >
          <BiLike className="text-xl" />
          <span className="hidden sm:inline">Likes</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            activeTab === "dislike"
              ? "bg-red-400 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("dislike")}
        >
          <BiDislike className="text-xl" />
          <span className="hidden sm:inline">Dislikes</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            activeTab === "comment"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("comment")}
        >
          <MdOutlineInsertComment className="text-xl" />
          <span className="hidden sm:inline">Comments</span>
        </button>
      </div>

      <div className="overflow-y-auto max-h-[400px]">{renderTabContent()}</div>
    </div>
  );
};

export default CommentPage;
