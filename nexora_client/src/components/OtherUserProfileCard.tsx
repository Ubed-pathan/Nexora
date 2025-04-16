    import PostCard from "../components/PostCardForProfile";
    import defaultDp from "../assets/OIP.jpg";
    import { authState, refreshUserState } from "../recoilStates/auth/atom";
    import { useRecoilValue, useSetRecoilState } from "recoil";
    import { useEffect, useState, useRef } from "react";
    import axios from "axios";

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
        following: boolean;
    };
    onClose: () => void;
    onFollowChange?: (userId: string, newStatus: boolean) => void;
    };

    const OtherUserProfileCard = ({ user, onClose, onFollowChange }: OtherUserProfileCardProps) => {
    const auth = useRecoilValue(authState);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [noPost, setNoPost] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const setRefreshUser = useSetRecoilState(refreshUserState);
    const refresh = useRecoilValue(refreshUserState);
    const [isFollowing, setIsFollowing] = useState(user.following);

    useEffect(() => {
        setIsFollowing(user.following);
    }, [user]);
    

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
                    {auth.followers}
                    </div>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                    <div className="text-text-100 font-semibold">Following</div>
                    <div className="font-semibold text-primary-100">
                    {auth.following}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:p-4">
            {loading && <div className="text-black">Loading...</div>}
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
                />
            );
            })}
        </div>
        </div>
    );
    };

    export default OtherUserProfileCard;
