import { Link } from 'react-router-dom';
import avtar from '../assets/icon.png';
import man from '../assets/man.png';

export default function SideNav() {
    return (
        <div className="hidden md:block fixed top-0 left-0 w-64 h-screen bg-bg-300 border-r border-primary-100 text-text-100 p-4" style={{ borderRightWidth: '1px' }}>
            <div className="flex flex-col items-center justify-center gap-y-2">
                <div className='w-full flex flex-row justify-between'>
                    <img src={avtar} alt="avtar" width={30} height={30} />
                    <h1 className='justify-center text-xl font-semibold text-primary-100'>Nexora</h1>
                </div>
                <hr className="my-1 w-64 bg-primary-100 h-px border-none" />
                <div className="w-14 h-14 rounded-full border border-text-100 p-1 flex items-center justify-center">
                    <img src={man} alt="avtar" className="w-full h-full rounded-full" />
                </div>

                <div>
                    <h2>UserName</h2>
                </div>
                <div>
                    <h4>Email</h4>
                </div>
            </div>
            <hr className="my-4 bg-text-200  h-0.5 border-none" />
            <nav className="flex justify-center">
                <ul className="text-veryLightPurple font-bold text-lg flex flex-col gap-4">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/search">Search</Link>
                    </li>
                    <li>
                        <Link to="/allusers">AllUsers</Link>
                    </li>
                    <li>
                        <Link to="/saved">Saved</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
