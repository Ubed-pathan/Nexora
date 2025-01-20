import { BrowserRouter as Router} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { MainApp } from './AppController';


function App() {
  return (
    <RecoilRoot>
      <Router>
        <MainApp />
      </Router>
    </RecoilRoot>
  );
}


// function MainApp() {
//   return (
//     <Router>
//       <div className="md:min-h-screen md:flex">
//         <div className="hidden md:block md:w-[20%]">
//           <SideNav />
//         </div>
//         <TopNav />
//         <main className='mt-11 w-[100%] md:mt-0 md:w-[60%]'>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/search" element={<Search />} />
//             <Route path="/allusers" element={<AllUsers />} />
//             <Route path="/saved" element={<Saved />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/signin" element={<SignIn/>} />
//           </Routes>
//         </main>
//         <div className='md:w-[25%]'>
//           <Suggestions />
//         </div>
//         <BottomNav />
//       </div>
//     </Router>
//   );
// }

export default App;
