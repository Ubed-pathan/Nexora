import { Link } from 'react-router-dom'; 
import { IoHomeOutline } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import { LuSaveAll } from "react-icons/lu";
import { IoPeopleOutline } from "react-icons/io5";
import man from '../assets/OIP.jpg';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoilStates/auth/atom';

export default function BottomNav() {
    const auth = useRecoilValue(authState);
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full py-2 bg-bg-300 flex items-center justify-evenly">
            <Link to='/'><IoHomeOutline size={28}/></Link>
            <Link to='/search'><RiSearchLine size={28}/></Link>
            <Link to='/allusers'><IoPeopleOutline size={28} /></Link>
            <Link to='/saved'><LuSaveAll size={28} /></Link>
            <Link to='/profile' className="w-9 h-9 rounded-full border border-text-100 p-[2px] flex items-center justify-center"><img src={auth.profileImageUrl || man} alt="avtar" className="w-full h-full rounded-full" /></Link>
        </div>
    );
}
