import SuggestionCard from "./SuggestionCard"
import man from '../assets/OIP.jpg';
import {useEffect, useState} from 'react'
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";
import OtherUserProfileCard from "./OtherUserProfileCard";

interface suggestionUsers{
  id: string;
  username:string;
  secureImageUrl:string;

}

export const Suggestions = () => {
  const[suggestionUsers , setSuggestionUsers] = useState<suggestionUsers[]>();
  const [toggle, setToggle] = useState<boolean>(false);
  const auth = useRecoilValue(authState)
  const [selectedUser, setSelectedUser] = useState<SelectedUserdata | null>(
    null
  );

  useEffect(() => {
    const fetchSuggestionUsers = async () => {
      const response = await axios.get<suggestionUsers[]>(`${import.meta.env.VITE_SERVER_API}/user/getSuggestions`, {
        withCredentials: true,
      });
      if(response.status === 200){
        setSuggestionUsers(response.data);
      }
    }
    fetchSuggestionUsers()
  },[toggle]);

  async function handleFollow(userId:string){
      const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/follow/${auth.id}/${userId}/follow`,{},{
        withCredentials: true,
      })

      if(response.status === 200){
        setToggle(!toggle)
      }
  }

  const handleUserClick = (userData: {
    id: string;
    username: string;
    avtar: string;
  }) => {
    setSelectedUser({
      id: userData.id,
      username: userData.username,
      secureImageUrl: userData.avtar,
      following: null,
    });
  };

  function onFollowChange(userId: string, newStatus: boolean) {
    //
  }

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedUser]);

  return (
    <div className="hidden md:block w-full min-h-screen bg-bg-300">
      <div>
        <h1 className="text-primary-100 font-semibold ml-2 py-2 text-xl">
          Suggested for you
        </h1>
      </div>
      <div className="flex flex-col px-1 gap-y-2 w-full max-h-[450px] overflow-y-scroll scrollbar-thin scrollbar-thin custom-scrollbar "> 
      {suggestionUsers?.map((user) => (
        <SuggestionCard 
        key={user.id} 
        id={user.id}
        avtar={user.secureImageUrl ? user.secureImageUrl : man} 
        username={user.username} 
        handleFollow={handleFollow}
        onUserClick={() =>
          handleUserClick({
            id: user.id,
            username: user.username,
            avtar: user.secureImageUrl || "",
          })
        }
        />
      ))}
      </div>

      <div className=" flex flex-col text-center pt-5">
          <h1 className="text-primary-100 text-xl font-semibold">Nexora</h1>
          <h1 className="text-text-100 font-medium">© 2025 All rights reserved</h1>
      </div>

      {selectedUser && (
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
      )}
      
    </div>
  )
}
