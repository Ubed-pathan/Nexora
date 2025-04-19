import { useEffect, useState } from "react";
import man from "../assets/OIP.jpg";
import { Loader } from "lucide-react";
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";
import SavedPostCard from "../components/SavedPostCard";

interface UserBasicInfo {
  id: string;
  username: string;
  secureImageUrl: string;
}

interface SavedPostResponseDto {
  id: string;
  description: string;
  format: string;
  imageUrl: string;
  secureImageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
  dislikeCount: number;
  likedUsers: UserBasicInfo[];
  dislikedUsers: UserBasicInfo[];
  user: UserBasicInfo;
}

const Saved = () => {
  const [loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPostResponseDto[]>([]);
  const auth = useRecoilValue(authState);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<SavedPostResponseDto[]>(
          `${import.meta.env.VITE_SERVER_API}/save/getSavedPosts`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSavedPosts(response.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, []);

  async function handleDeletePost(userId: string, postId: string) {
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/save/${userId}/${postId}/deletePost`,
      { withCredentials: true }
    );
    console.log(response);
    if (response.status === 200) {
      setSavedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    }
  }

  return (
    <>
      {savedPosts.length === 0 && (
        <div className="flex justify-center items-center h-screen w-full">
          <h1 className="text-2xl font-bold text-primary-100">
            No Saved Posts
          </h1>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-screen w-full">
          <Loader className="w-10 h-10 text-primary-100 animate-spin" />
        </div>
      )}

      {savedPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:p-4 overflow-y-scroll md:mb-0 mb-11">
          {savedPosts.map((post) => (
            <SavedPostCard
              key={post.id}
              postId={post.id}
              avtar={post.user.secureImageUrl || man}
              desc={post.description}
              date={post.createdAt}
              userName={post.user.username}
              blogImage={post.secureImageUrl || post.imageUrl}
              like={post.likeCount ?? 0}
              disLikes={post.dislikeCount ?? 0}
              alReadyLike={
                post.likedUsers?.some((user) => user.id === auth.id) ?? false
              }
              alReadyDisLike={
                post.dislikedUsers?.some((user) => user.id === auth.id) ?? false
              }
              handleDeletePost={handleDeletePost}
              userId={auth.id ?? ""}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Saved;
