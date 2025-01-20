import React,{useEffect, useState} from 'react'
import { useSetRecoilState } from 'recoil'
import axios from 'axios'
import { authState } from '../recoilStates/auth/atom'

const UserState = () => {
    const [loading, setLoading] = useState(true); 
    const setAuthState = useSetRecoilState(authState)
        useEffect(
          () => {
            console.log("user state called")
          async function getUserState() {
            try{
            const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/check-userstate`,{
                withCredentials: true,
            })

            if(response.status == (200)){

                console.log(response.data)
                setAuthState({
                    isLoggedIn : true,
                    username: response.data.username,
                    email: response.data.email,
                    profileImageUrl: response.data.profileImageUrl,
                })
            }
            else{
                setAuthState({
                    isLoggedIn : false,
                    username: null,
                    email: null,
                    profileImageUrl: null,
                })
            }
          }
          catch(err){
// 
          }
          finally{
            setLoading(false);
          }
        }
          
          getUserState();
        }, [])
        return { loading };
};

export default UserState;