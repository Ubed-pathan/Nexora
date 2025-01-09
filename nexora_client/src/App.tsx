import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import Search from './pages/Search';
import AllUsers from './pages/AllUsers';
import Saved from './pages/Saved';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex">
        <SideNav />
        <TopNav />
        <main className="flex-grow p-4 md:ml-64 my-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/allusers" element={<AllUsers />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
