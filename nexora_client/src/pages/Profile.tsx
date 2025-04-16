import { FcAddImage } from "react-icons/fc";
import PostCard from "../components/PostCardForProfile";
import defaultDp from '../assets/OIP.jpg';
import { authState, refreshUserState } from "../recoilStates/auth/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState, useRef } from "react";
import { AddPostFrom } from "../components/AddPostFrom";
import axios from "axios";
import { BsCameraFill } from "react-icons/bs";
import { XCircle } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Settings } from 'lucide-react';
import { LogOut } from 'lucide-react';
import FollowingFollowersPage from "./FollowingFollowersPage";
import Comment from '../components//Comment'

interface Post {
  id: string;
  createdAt: string;
  secureImageUrl: string;
  format: string;
  description: string;
  likeCount?: number;
  dislikeCount?: number;
  likedUsers?: []
  dislikedUsers?: []
}

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

const Profile = () => {
  const auth = useRecoilValue(authState);
  const [isOpen, setIsOpen] = useState(false);
  const [postAddedSuccess, setPostAddedSuccess] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [noPost, setNoPost] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingForProfileImage, setLoadingForProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [settingOpen, setSettingOpen] = useState(false)
  const setAuth = useSetRecoilState(authState);
  const [isFollowingFollowersOpen, setIsFollowingFollowersOpen] = useState(false);
  const [followersToggle, setFollowersToggle] = useState(1);
  const setRefreshUser = useSetRecoilState(refreshUserState)
  const refresh = useRecoilValue(refreshUserState)
  const [likedUsers , setLikedUsers] = useState<UserBasicInfo[]>([]);
  const [dislikedUsers , setDislikedUsers] = useState<UserBasicInfo[]>([]);
  const [comments , setComments] = useState<Comment[]>([]);
  const [showComment, setShowComment] = useState(false);
  const [postId, setPostId] = useState<string>();

  useEffect(() => {
    console.log(refresh.isRefreshed)
    setRefreshUser({ isRefreshed: !refresh.isRefreshed })
    console.log(refresh.isRefreshed)
  }
  , [])


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  
  const toggleFollowingFollowers = () => {
    setIsFollowingFollowersOpen(!isFollowingFollowersOpen);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setProfileImage(selectedFile);
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        toast.error("📁 Image size must be less than 5MB!", {
          position: "top-center",
          autoClose: 1200,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }
      setSelectedImage(URL.createObjectURL(selectedFile));
      setShowImageOptions(true);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setSelectedImage(null);
  };

  const handleAddProfileImage = async () => {
    if (!profileImage) {
      toast.error("⚠️ Please add an image first", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const fileSizeMB = profileImage.size / (1024 * 1024); // Convert bytes to MB
    if (fileSizeMB > 5) {
      toast.error("📁 Image size must be less than 5MB!", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    setLoadingForProfileImage(true);

    const formData = new FormData();
    if (profileImage) {
      formData.append("file", profileImage);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/user/addProfile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("😄 Post added successfully", {
          position: "top-center",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        setPostAddedSuccess(!postAddedSuccess);
        setTimeout(() => {
          setProfileImage(null);
          setSelectedImage(null);
          setLoadingForProfileImage(false);
          setShowImageOptions(false);
        }, 2000);
      }
    } catch (error) {
      toast.error("😓 Failed to add post", {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => {
        setProfileImage(null);
        setSelectedImage(null);
        setLoadingForProfileImage(false);
        setShowImageOptions(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getPostData();
    setLoading(true);
    async function getPostData() {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/post`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data)
      if (response.status === 200) {
        setPosts(response.data as Post[]);
        setLoading(false);
        setTotalPosts((response.data as Post[]).length);
        setNoPost((response.data as Post[]).length === 0);
      } else if (response.status === 404) {
        setNoPost(true);
        setLoading(false);
      } else {
        // handle error
        setLoading(false);
      }
    }
  }, [auth.isLoggedIn, postAddedSuccess]);


  async function logout(): Promise<void> {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/user/logout`,{}, {
            withCredentials: true
        });
        console.log(response.data);
        if (response.status === 200) {
            setAuth(
                {
                    isLoggedIn: false,
                    username: null,
                    email: null,
                    profileImageUrl: null,
                    id: null,
                    following: null,
                    followers: null
                }
            )
        }
        else {
            //
        }

    } catch (error) {
        // console.log(error);
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
    <div className="flex flex-col items-center min-h-screen w-full md:h-screen md:overflow-y-scroll md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100" onClick={() => settingOpen && setSettingOpen(false)}>
      <div className="relative mr-2 mt-3 ml-auto">
  <Settings
    size={20}
    className="text-black cursor-pointer"
    onClick={() => setSettingOpen(!settingOpen)}
  />
  {settingOpen && (
    <div className={`absolute right-0 top-full mt-2 bg-bg-300 w-24 py-2 px-1 rounded-lg shadow-lg z-10 
      transition-all duration-300 ease-in-out transform 
      ${settingOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
      <div className="flex justify-evenly items-center cursor-pointer" onClick={logout}>
        <LogOut size={20} className="text-black"/>
        <p className="text-black">logout</p>
      </div>
    </div>
  )}
</div>
      <div className="flex justify-center mt-4 md:w-[35%] w-[98%] p-2 md:p-0">
        <div className="flex flex-col w-full items-center">
          <div className="flex flex-row w-full justify-between ">
            <div className="flex flex-col justify-center items-center gap-y-2">
              <div className="relative group">
                <div className="border-[1px] border-primary-100 rounded-full p-[2px]">
                  <img
                    src={auth.profileImageUrl || defaultDp}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="object-cover h-11 w-11 rounded-full"
                  />
                  <div
                    className="absolute bottom-0 right-0 bg-primary-100 rounded-full p-1 
              cursor-pointer hover:scale-110 duration-300 "
                    onClick={handleImageClick}
                  >
                    <BsCameraFill size={14} className="text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <h1>{auth.username}</h1>

              {showImageOptions && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    {selectedImage && (
                      <div className="mb-4">
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex gap-4 justify-end">
                      <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        onClick={() => {
                          setShowImageOptions(false);
                          setSelectedImage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>

                      <button
                        className="px-4 py-2 bg-primary-100 text-white rounded transition-colors flex items-center justify-center"
                        onClick={handleAddProfileImage}
                        disabled={loadingForProfileImage}
                      >
                        {loadingForProfileImage ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                            Adding...
                          </>
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>{" "}
            <div className="flex justify-evenly gap-5">
              <div className="flex flex-col items-center cursor-pointer">
                <div className="text-text-100 font-semibold">Posts</div>
                <div className="font-semibold text-primary-100">
                  {totalPosts}
                </div>
              </div>
              <div className="flex flex-col items-center cursor-pointer" 
              onClick={() => {
                setIsFollowingFollowersOpen(true)
                setFollowersToggle(0);
                }}>
                <div className="text-text-100 font-semibold">Followers</div>
                <div className="font-semibold text-primary-100">
                  {auth.followers}
                </div>
              </div>
              <div className="flex flex-col items-center cursor-pointer" 
                onClick={() => {
                setIsFollowingFollowersOpen(true)
                setFollowersToggle(1);
                }}
                >
                <div className="text-text-100 font-semibold">Following</div>
                <div className="font-semibold text-primary-100">
                  {auth.following}
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex flex-col gap-1 items-center cursor-pointer "
            onClick={() => setIsOpen(true)}
          >
            <FcAddImage size={30} className="" />
            <h1 className="flex justify-center items-center">Add Post</h1>
          </div>
          <hr className="bg-primary-100 h-[1px] border-none w-full my-4 mx-1" />
        </div>
      </div>

      {isFollowingFollowersOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="relative bg-bg-200 p-4 rounded-lg shadow-lg w-[90%] md:w-[30%] h-[75%] md:h-[80%]">
            <button
              onClick={toggleFollowingFollowers}
              className="absolute top-2 right-2 text-gray-700 "
            >
              ✖
            </button>
            <FollowingFollowersPage followers={followersToggle == 0 ? true : false} />
          </div>
        </div>
      )}

      {isOpen && (
        <AddPostFrom
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          postAddedSuccess={postAddedSuccess}
          setPostAddedSuccess={setPostAddedSuccess}
        />
      )}
      {noPost && <div className="text-black flex flex-col justify-center items-center w-full">No Post</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:p-4">
        {loading && <div className="text-black">Loading...</div>}
        {posts.map((post) => {
          const alReadyLike = post.likedUsers.some(user => user.id === auth.id);
          const alReadyDisLike = post.dislikedUsers.some(user => user.id === auth.id)
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
          handleCloseComment={handleCloseComment}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  </>
)}


      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default Profile;


