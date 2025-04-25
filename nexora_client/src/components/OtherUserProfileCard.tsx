    import PostCard from "../components/PostCardForOtherUsers";
    import defaultDp from "../assets/OIP.jpg";
    import { authState, refreshUserState } from "../recoilStates/auth/atom";
    import { useRecoilValue, useSetRecoilState } from "recoil";
    import { useEffect, useState } from "react";
    import Comment from './Comment';
    import axios from "axios";
import { Loader } from "lucide-react";

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

    interface Post {
    id: string;
    createdAt: string;
    secureImageUrl: string;
    format: string;
    description: string;
    likeCount?: number;
    dislikeCount?: number;
    likedUsers?: [];
    dislikedUsers?: [];
    }

    type OtherUserProfileCardProps = {
    user: {
        id: string;
        username: string;
        secureImageUrl: string | null;
        following: boolean | null;
    };
    onFollowChange?: (userId: string, newStatus: boolean) => void;
    };

    const OtherUserProfileCard = ({ user, onFollowChange }: OtherUserProfileCardProps) => {
    const auth = useRecoilValue(authState);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [noPost, setNoPost] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const setRefreshUser = useSetRecoilState(refreshUserState);
    const refresh = useRecoilValue(refreshUserState);
    const [isFollowing, setIsFollowing] = useState(user.following);
    const [likedUsers, setLikedUsers] = useState<UserBasicInfo[]>([]);
    const [dislikedUsers, setDislikedUsers] = useState<UserBasicInfo[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComment, setShowComment] = useState(false);
    const [postId, setPostId] = useState<string>();
    const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);

    useEffect(() => {
      async function executeCheckFollowing() {
        if (user.following === null) {
          await checkFollowing();
        }else{
          setIsFollowing(user.following);
        }
        
      }
      executeCheckFollowing();
      async function checkFollowing() {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/${user.id}/checkFollowing`,
            { withCredentials: true }
          );
          if (response.status === 200) {
            setIsFollowing(response.data);
          } else {
            setIsFollowing(false);
          }
        }
        catch(err){
          setIsFollowing(false);
        }
      }

      async function checkFollowerAndFollowingCount(){
        try{
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_API}/follow/${user.id}/countFollowerAndFollowing`,
            { withCredentials: true }
          );
          if (response.status === 200) {
            setFollower(response.data.followers);
            setFollowing(response.data.following);
          } else {
            setFollower(0);
            setFollowing(0);
          }
        }
        catch(err){
          setFollower(0);
          setFollowing(0);
        }
      }
      checkFollowerAndFollowingCount();
    }, []);
    

    useEffect(() => {
        setRefreshUser({ isRefreshed: !refresh.isRefreshed });
    }, [isFollowing]);

    const toggleFollow = async () => {
    try {
        const endpoint = `${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/${user.id}/${isFollowing ? "unfollow" : "follow"}`;
        await axios.post(endpoint, {}, { withCredentials: true });

        const newFollowStatus = !isFollowing;
        setIsFollowing(newFollowStatus);
        onFollowChange?.(user.id, newFollowStatus);
        setFollower((prev) => (newFollowStatus ? prev + 1 : prev - 1));
    } catch (err) {
        // console.error("Error while toggling follow:", err);
    }
    };

    useEffect(() => {
        getPostData();
        setLoading(true);
        async function getPostData() {
        try {
            const response = await axios.get(
            `${import.meta.env.VITE_SERVER_API}/post/${user.id}/getAllPosts`,
            { withCredentials: true }
            );
            if (response.status === 200) {
            setPosts(response.data);
            setTotalPosts(response.data.length);
            setNoPost(response.data.length === 0);
            } else {
            setNoPost(true);
            }
        } catch (err) {
            setNoPost(true);
        } finally {
            setLoading(false);
        }
        }
    }, [auth.isLoggedIn]);


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

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
        <div className="flex justify-center mt-4 md:w-[35%] w-[98%] p-2 md:p-0">
            <div className="flex flex-col w-full items-center">
            <div className="flex flex-row w-full justify-between ">
                <div className="flex flex-col justify-center items-center gap-y-2">
                <div className="relative group">
                    <div className="border-[1px] border-primary-100 rounded-full p-[2px]">
                    <img
                        src={user.secureImageUrl || defaultDp}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="object-cover h-11 w-11 rounded-full"
                    />
                    </div>
                </div>
                <h1>{user.username}</h1>
                </div>{" "}
                <div className="flex justify-evenly gap-5">
                <div className="flex flex-col items-center cursor-pointer">
                    <div className="text-text-100 font-semibold">Posts</div>
                    <div className="font-semibold text-primary-100">
                    {totalPosts}
                    </div>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                    <div className="text-text-100 font-semibold">Followers</div>
                    <div className="font-semibold text-primary-100">
                    {follower}
                    </div>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                    <div className="text-text-100 font-semibold">Following</div>
                    <div className="font-semibold text-primary-100">
                    {following}
                    </div>
                </div>
                </div>
            </div>
            <button
                onClick={toggleFollow}
                className={`mt-2 px-4 py-1 rounded-lg text-white font-semibold transition ${
                isFollowing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                {isFollowing ? "Remove" : "Follow"}
            </button>
            <hr className="bg-primary-100 h-[1px] border-none w-full my-4 mx-1" />
            </div>
        </div>

        {noPost && (
            <div className="text-black flex flex-col justify-center items-center w-full">
            No Post
            </div>
        )}
        {loading && <div className="flex justify-center items-center h-screen w-screen">
            <Loader className="w-10 h-10 text-primary-100 animate-spin" />
          </div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:p-4">
            
            {posts.map((post) => {
            const alReadyLike = post.likedUsers.some(
                (user) => user.id === auth.id
            );
            const alReadyDisLike = post.dislikedUsers.some(
                (user) => user.id === auth.id
            );
            return (
                <PostCard
                key={post.id}
                postId={post.id}
                desc={post.description}
                date={post.createdAt}
                imageUrl={post.secureImageUrl}
                like={post.likeCount}
                disLikes={post.dislikeCount}
                alReadyLike={alReadyLike}
                alReadyDisLike={alReadyDisLike}
                handleSave={handleSave}
                handleClickOnComment={handleClickOnComment}
                />
            );
            })}
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

    export default OtherUserProfileCard;
