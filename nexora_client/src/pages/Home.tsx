import { useEffect, useRef, useState } from "react";
import PostCard from "../components/PostCardForHome";
import { Loader } from "lucide-react";
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";
import man from "../assets/OIP.jpg";
import Comment from "../components/Comment";

interface UserBasicInfo {
  id: string;
  username: string;
  secureImageUrl: string;
}

interface Comment {
  commentId: string;
  message: string;
  user: UserBasicInfo;
} 

interface PostResponseDto {
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

const Home = () => {
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [lastPostDate, setLastPostDate] = useState<string | null>(null);
  const [likedUsers , setLikedUsers] = useState<UserBasicInfo[]>([]);
  const [dislikedUsers , setDislikedUsers] = useState<UserBasicInfo[]>([]);
  const [comments , setComments] = useState<Comment[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [postId, setPostId] = useState<string>();
  const [refreshOnAddPost, setRefreshOnAddPost] = useState<boolean>(false)

  const auth = useRecoilValue(authState);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const before = lastPostDate ? lastPostDate : new Date().toISOString();

    try {
      const res = await axios.get<PostResponseDto[]>(
        `${import.meta.env.VITE_SERVER_API}/feed/home`,
        {
          params: {
            before,
          },
          withCredentials: true,
        }
      );
      const newPosts = res.data;
      console.log("newPosts", newPosts);
    
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.id));
        console.log("existingPostIds", existingPostIds);
        const uniquePosts = newPosts.filter(
          (post) => !existingPostIds.has(post.id)
        );
        console.log("uniquePosts", uniquePosts)  

        if (uniquePosts.length === 0) {
          setHasMore(false);
          return prevPosts;
        }

        const last = uniquePosts[uniquePosts.length - 1];
        setLastPostDate(last.createdAt);

        return [...prevPosts, ...uniquePosts];
      });
    } catch (error) {
      // console.error("Failed to fetch posts:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  async function handleSave(postId: string) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/save/${auth.id}/${postId}/post`,{},
        { withCredentials: true }
      );
      if (response.status === 200) {
        // 
      }
    }
    catch (error) { 
      console.error("Error saving post:", error);
    }
  }

  async function handleClickOnComment(postId: string, ) {
    posts.forEach((post) => {
      if (post.id === postId) {
        setLikedUsers(post.likedUsers.filter((user) => user.id !== auth.id));
        setDislikedUsers(post.dislikedUsers.filter((user) => user.id !== auth.id));
      }
    })  
    setPostId(postId)
    const response = await axios.get<Comment[]>(
      `${import.meta.env.VITE_SERVER_API}/comment/${postId}/getCommentsForPost`,
      { withCredentials: true }
    );
    if (response.status === 200) {
      setComments(response.data);
      console.log("comments in home", comments);
    }
    else if(response.status === 202) {
      // setComments(response.data);
    }
    else{
      setComments([]);
    }

    
    setShowComment(true);
  
}

function handleCloseComment() {
  setLikedUsers([]);
  setDislikedUsers([]);
  setComments([]);
  setShowComment(false);
}

async function handleDelete(commentId: string): Promise<void> {
  if(!commentId){
      return;
  }

  const response = await axios.delete(`${import.meta.env.VITE_SERVER_API}/comment/${commentId}/delete`, {
    withCredentials: true,
  })
  if(response.status === 200){
    setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
  }
}

async function handleAddComment(postId:string, message:string): Promise<void>{
    if(!postId || !message) return;

const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/comment/${auth.id}/${postId}/addComment`,{
    message: message
},{
  withCredentials:true,
})

if(response.status === 200){
  await handleClickOnComment(postId);
}
}

  return (
    <div className="md:h-screen md:overflow-y-scroll md:mx-20 md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100">
      <div className="mt-4 mb-16 md:space-y-4 md:px-14">
        {posts.map((post) => {
          const alReadyLike = post.likedUsers.some(
            (user) => user.id === auth?.id
          );
          const alReadyDisLike = post.dislikedUsers.some(
            (user) => user.id === auth?.id
          );

          return (
            <PostCard
              key={post.id}
              postId={post.id}
              avtar={post.user.secureImageUrl || man}
              desc={post.description}
              date={post.createdAt}
              userName={post.user.username}
              blogImage={post.imageUrl}
              like={post.likeCount}
              disLikes={post.dislikeCount}
              alReadyLike={alReadyLike}
              alReadyDisLike={alReadyDisLike}
              handleSave={handleSave}
              handleClickOnComment={handleClickOnComment}
            />
          );
        })}

        {!loading && !hasMore && posts.length > 0 && (
          <div className="text-center text-gray-500 mt-6 text-sm">
            No more posts available.
          </div>
        )}

        {loading && <Loader />}
        <div ref={loaderRef}></div>
      </div>
      {showComment && (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-lg mt-0"></div>

    {/* Comments Container */}
    <div className="fixed inset-0 z-50 flex justify-center items-center h-screen">
      <div className="bg-bg-300 p-6 rounded-lg w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={handleCloseComment}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <Comment
          postId={postId}
          likedUsers={likedUsers}
          dislikedUsers={dislikedUsers}
          comments={comments}
          handleDelete={handleDelete}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default Home;
