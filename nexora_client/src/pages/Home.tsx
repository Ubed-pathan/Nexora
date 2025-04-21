import { useEffect, useRef, useState } from "react";
import PostCard from "../components/PostCardForHome";
import { Loader } from "lucide-react";
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";
import man from "../assets/OIP.jpg";
import Comment from "../components/Comment";
import OtherUserProfileCard from "../components/OtherUserProfileCard";

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

// interface User {
//   id: string;
//   secureImageUrl: string | null;
//   username: string;
//   following: boolean;
// }

// interface SelectedUserdata {
//   id: string;
//   username: string;
//   secureImageUrl: string | null;
//   following: boolean;
// }

const Home = () => {
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [lastPostDate, setLastPostDate] = useState<string | null>(null);
  const [likedUsers, setLikedUsers] = useState<UserBasicInfo[]>([]);
  const [dislikedUsers, setDislikedUsers] = useState<UserBasicInfo[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [postId, setPostId] = useState<string>();
  const [stopFetch, setStopFetch] = useState<boolean>(false);
  // const [selectedUser, setSelectedUser] = useState<SelectedUserdata | null>(
  //   null
  // );

  const auth = useRecoilValue(authState);

  const fetchPosts = async () => {
    if (loading || !hasMore || stopFetch) return;
    setLoading(true);

    const before = lastPostDate ? lastPostDate : new Date().toISOString();

    try {
      const res = await axios.get<PostResponseDto[]>(
        `${import.meta.env.VITE_SERVER_API}/feed/home`,
        {
          params: { before },
          withCredentials: true,
        }
      );

      const newPosts = res.data;

      if (newPosts.length === 0) {
        setHasMore(false);
        setStopFetch(true);
        return;
      }

      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.id));
        const uniquePosts = newPosts.filter(
          (post) => !existingPostIds.has(post.id)
        );

        if (uniquePosts.length === 0) {
          setHasMore(false);
          setStopFetch(true);
          return prevPosts;
        }

        const last = uniquePosts[uniquePosts.length - 1];
        setLastPostDate(last.createdAt);

        return [...prevPosts, ...uniquePosts];
      });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (stopFetch) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !stopFetch) {
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
  }, [stopFetch, hasMore, loading]);

  async function handleSave(postId: string) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/save/${auth.id}/${postId}/post`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        //
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  }

  async function handleClickOnComment(postId: string) {
    posts.forEach((post) => {
      if (post.id === postId) {
        setLikedUsers(post.likedUsers.filter((user) => user.id !== auth.id));
        setDislikedUsers(
          post.dislikedUsers.filter((user) => user.id !== auth.id)
        );
      }
    });
    setPostId(postId);
    const response = await axios.get<Comment[]>(
      `${import.meta.env.VITE_SERVER_API}/comment/${postId}/getCommentsForPost`,
      { withCredentials: true }
    );
    if (response.status === 200) {
      setComments(response.data);
    } else if (response.status === 202) {
      //
    } else {
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
    if (!commentId) {
      return;
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_API}/comment/${commentId}/delete`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    }
  }

  async function handleAddComment(
    postId: string,
    message: string
  ): Promise<void> {
    if (!postId || !message) return;

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/comment/${
        auth.id
      }/${postId}/addComment`,
      {
        message: message,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      await handleClickOnComment(postId);
    }
  }

  // const handleUserClick = (userData: {
  //   id: string;
  //   username: string;
  //   avtar: string;
  //   following: boolean;
  // }) => {
  //   setSelectedUser({
  //     id: userData.id,
  //     username: userData.username,
  //     secureImageUrl: userData.avtar,
  //     following: userData.following,
  //   });
  // };

  // function onFollowChange(userId:string, newStatus:boolean){
  //   // 
  // }

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
              userId={post.user.id}
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
              // onUserClick={() =>
              //   handleUserClick({
              //     id: post.user.id,
              //     username: post.user.username,
              //     avtar: post.user.secureImageUrl || "",
              //     following: user.following,
              //   })
              // }
            />
          );
        })}

        {!loading && !hasMore && posts.length > 0 && (
          <div className="text-center text-gray-500 mt-6 text-sm">
            No more posts available.
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-screen w-screen">
            <Loader className="w-10 h-10 text-primary-100 animate-spin" />
          </div>
        )}
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

      {/* {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-lg">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative bg-bg-100 p-4 shadow-lg z-10 w-[90%] h-[90%] overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-purple-500 text-xl font-bold hover:text-purple-700 transition"
              aria-label="Close"
            >
              ✖
            </button>

            <h1 className="text-xl text-center mb-4 text-primary-100">
              User Profile
            </h1>

            <OtherUserProfileCard
              user={selectedUser}
              onFollowChange={onFollowChange}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Home;
