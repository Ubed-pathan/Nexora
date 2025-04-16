import { atom } from "recoil";

export const authState = atom({
    key: 'authState',
    default: {isLoggedIn: false, id: null, username: null , email: null, profileImageUrl: null, following: null, followers:null}
})

export const refreshUserState = atom({
    key: 'refreshUserState',
    default: {isRefreshed: false}
})