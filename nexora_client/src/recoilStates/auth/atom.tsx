import { atom } from "recoil";

export const authState = atom({
    key: 'authState',
    default: {isLoggedIn: false, id: null, username: null , email: null, profileImageUrl: null, posts: null, following: null, followers:null}
})