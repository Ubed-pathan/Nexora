import avtar from '../assets/icon.png';

export default function TopNav() {
    return (
        <div className="md:hidden fixed top-0 left-0 w-full py-1 bg-bg-300 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-1">
                <img src={avtar} alt="avtar" width={40} height={40} />
            </div>
            <div className='mr-1'>
                <h2 className='text-primary-100 text-xl font-semibold'>Nexora</h2>
            </div>
        </div>
    );
}
