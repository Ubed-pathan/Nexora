import { atom } from "recoil";

export const authState = atom({
    key: 'authState',
    default: {isLoggedIn: true, username: null , email: null, profileImageUrl: null},
})