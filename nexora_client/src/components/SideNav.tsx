import { Link } from 'react-router-dom';
import avtar from '../assets/icon.png';
import man from '../assets/man.png';
import { IoHomeOutline } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import { LuSaveAll } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { authState } from '../recoilStates/auth/atom'
import { useRecoilValue } from 'recoil';

export default function SideNav() {
    const auth = useRecoilValue(authState);
    return (
        <div className="h-screen bg-bg-300 border-r border-primary-100 text-text-100 p-4" style={{ borderRightWidth: '1px' }}>
            <div className="flex flex-col items-center justify-center gap-y-2">
                <div className='w-full flex flex-row justify-between'>
                    <img src={avtar} alt="avtar" width={30} height={30} />
                    <h1 className='justify-center text-xl font-semibold text-primary-100'>Nexora</h1>
                </div>
                <hr className="my-1 w-[100%] bg-primary-100 h-px border-none" />
                <div className="w-14 h-14 rounded-full border border-text-100 p-1 flex items-center justify-center">
                    <img src={
                        auth.profileImageUrl ? auth.profileImageUrl : man
                    } alt="avtar" className="w-full h-full rounded-full" />
                </div>

                <div>
                    <h2>{auth.username}</h2>
                </div>
                <div>
                    <h4>{auth.email}</h4>
                </div>
            </div>
            <hr className="my-4 bg-text-200  h-0.5 border-none" />
            <nav className="flex justify-start">
                <ul className=" w-full text-text-100 font-bold text-lg flex flex-col gap-4">
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                        <Link to="/" className='flex justify-start gap-5'><IoHomeOutline size={25} className='text-primary-100'/> <span>Home</span></Link>
                    </li>
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                        <Link to="/search" className='flex justify-start gap-5'><RiSearchLine size={25} className='text-primary-100'/><span>Search</span></Link>
                    </li>
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                        <Link to="/allusers" className='flex justify-start gap-5'><IoPeopleOutline size={25} className='text-primary-100'/><span>AllUsers</span></Link>
                    </li>
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                        <Link to="/saved" className='flex justify-start gap-5'><LuSaveAll size={25} className='text-primary-100'/><span>Saved</span></Link>
                    </li>
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                    <Link to='/profile' className='flex gap-3'>
                    <div className="w-8 h-8 rounded-full border border-primary-100 p-1 flex items-center justify-center">
                    <img src={man} alt="avtar" className="w-full h-full rounded-full" />
                    </div>
                    <span>Profile</span>
                    </Link>
                    </li>
                    <li className='hover hover:bg-bg-200 w-full rounded-lg p-3 transform duration-300'>
                        <Link to="/saved" className='flex justify-start gap-5'><FiLogOut size={25} className='text-primary-100'/><span>LogOut</span></Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
