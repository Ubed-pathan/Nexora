import { useRecoilValue } from "recoil";
import { authState } from './recoilStates/auth/atom'
import SideNav from "./components/SideNav";
import { Suggestions } from "./components/Suggestions";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AllUsers from "./pages/AllUsers";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import UserState from "./components/UserState";

import { ReactElement } from "react";
import { Loader } from "lucide-react";

function ProtectedRoute({ element, isLoggedIn }: { element: ReactElement; isLoggedIn: boolean }) {
    return isLoggedIn ? element : <Navigate to="/signin" />;
}


export function MainApp() {
    const auth = useRecoilValue(authState);
    const {loading} = UserState();
    const location = useLocation();  // Get the current location

    const showSuggestions = ["/", "/search", "/allusers"].includes(location.pathname);

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen w-screen">
            <Loader className="w-10 h-10 text-primary-100 animate-spin" />
          </div>
        );
      }      
    
    return (
        <>
        {auth.isLoggedIn && <>
            <div className="md:min-h-screen md:flex">
                        <div className="hidden md:block md:w-[20%]">
                            <SideNav />
                        </div>
                        <TopNav />
                        <main className={`mt-11 w-[100%] md:mt-0 ${showSuggestions ? 'md:w-[55%]' : 'md:w-[80%]'}`}>
                            <Routes>
                                <Route path="/" element={<ProtectedRoute element={<Home />} isLoggedIn={auth.isLoggedIn} />} />
                                <Route path="/search" element={<ProtectedRoute element={<Search />} isLoggedIn={auth.isLoggedIn} />} />
                                <Route path="/allusers" element={<ProtectedRoute element={<AllUsers />} isLoggedIn={auth.isLoggedIn} />} />
                                <Route path="/saved" element={<ProtectedRoute element={<Saved />} isLoggedIn={auth.isLoggedIn} />} />
                                <Route path="/profile" element={<ProtectedRoute element={<Profile />} isLoggedIn={auth.isLoggedIn} />} />
                                <Route path="/signin" element={<Navigate to='/' />} />
                                <Route path="/signup" element={<Navigate to='/' />} />
                            </Routes>
                        </main>
                        {showSuggestions && (
                        <div className='md:w-[25%]'>
                            <Suggestions />
                        </div>
                    )}
                        <BottomNav />
                        </div>
                    </>
                }

                {!auth.isLoggedIn &&
                    <>
                        <div className="w-full">
                            <Routes>
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="*" element={<Navigate to='/signin' />} />
                            </Routes>
                        </div>
                    </>
                }
            
        </>
    );
}