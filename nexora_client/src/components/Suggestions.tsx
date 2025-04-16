import SuggestionCard from "./SuggestionCard"
import man from '../assets/OIP.jpg';
import {useEffect, useState} from 'react'
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";

interface suggestionUsers{
  id: string;
  username:string;
  secureImageUrl:string;

}

export const Suggestions = () => {
  const[suggestionUsers , setSuggestionUsers] = useState<suggestionUsers[]>();
  const [toggle, setToggle] = useState<boolean>(false);
  const auth = useRecoilValue(authState)

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
        />
      ))}
      </div>

      <div className=" flex flex-col text-center pt-5">
          <h1 className="text-primary-100 text-xl font-semibold">Nexora</h1>
          <h1 className="text-text-100 font-medium">© 2025 All rights reserved</h1>
      </div>
      
    </div>
  )
}
