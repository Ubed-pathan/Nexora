import { useState, useEffect } from "react";
import axios from "axios";
import FollowerCard from "../components/FollowerCard";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../recoilStates/auth/atom";

interface FollowingFollowersPageProps {
  followers: boolean;
}

const FollowingFollowersPage: React.FC<FollowingFollowersPageProps> = ({ followers }) => {
  console.log(followers)
  const [activeTab, setActiveTab] = useState<"followers" | "following">(followers ? "followers" : "following");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useRecoilValue(authState);
  const setAuthValue = useSetRecoilState(authState);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  console.log(activeTab)

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "followers"
          ? `${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/followers`
          : `${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/following`;

      const response = await axios.get(endpoint, { withCredentials: true });
      setData(response.data);
    } catch (error) {
// 
    }
    setLoading(false);
  };

  async function hangleUnfollowAndRemove(userId: string, operation:boolean) {
    try{
      if(operation) {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/${userId}/unfollow`, {}, { withCredentials: true });
        
        if(response.status === 200) {
          setAuthValue((prev) => ({
            ...prev,
            following: Math.max((prev.following || 0) - 1, 0), // Ensure following is a non-negative number
          }));
        }
      }
      else {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/follow/${userId}/${auth.id}/unfollow`, {}, { withCredentials: true });
        if(response.status === 200) {
          setAuthValue((prev) => ({
            ...prev,
            followers: Math.max((prev.followers || 0) - 1, 0), // Ensure followers is a non-negative number
          }));
        }
      }
      setData((prev) => prev.filter((user) => user.id !== userId));
    }
    catch(error) {
      console.error(`Failed to ${operation ? 'unfollow' : 'follow'} user`, error);
    }
  }

  return (
    <div className="border rounded-lg shadow-lg mt-6 bg-bg-100 h-[430px] md:h-[500px] w-full">
      <div className="flex w-full justify-around border-b-2">
        <button
          className={`w-1/2 py-2 text-lg ${activeTab === "followers" ? "border-b-4 border-primary-100 font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`w-1/2 py-2 text-lg ${activeTab === "following" ? "border-b-4 border-primary-100 font-bold" : "text-gray-500"}`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>


      <div className="mt-4 w-full h-[400px] overflow-y-auto flex flex-col items-center">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length > 0 ? (
          <ul className="w-full">
            {data.map((user) => (
              <li key={user.id} className="p-2 border-b flex justify-center">
                <FollowerCard 
                  avtar={user.profileImageUrl} 
                  username={user.username} 
                  id={user.id} 
                  activeTab={activeTab}
                  onUnfollowAndRemove={hangleUnfollowAndRemove}
                  />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="text-center text-gray-500">No {activeTab} found.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FollowingFollowersPage;
