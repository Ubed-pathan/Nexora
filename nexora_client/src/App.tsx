import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import Search from './pages/Search';
import AllUsers from './pages/AllUsers';
import Saved from './pages/Saved';
import { Suggestions } from './components/Suggestions';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex">
        <div className="hidden md:block md:w-[20%]">
          <SideNav />
        </div>
        <TopNav />
        <main className='mt-11 w-[100%] md:mt-0 md:w-[60%]'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/allusers" element={<AllUsers />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <div className='md:w-[25%]'>
          <Suggestions />
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
