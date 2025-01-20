import { FcAddImage } from "react-icons/fc";
import PostCard from "../components/PostCardForProfile";
import man from '../assets/man.png';
import ubed1 from '../assets/1701612771662.jpg'
import ubed2 from '../assets/Picsart_24-04-14_15-49-05-429.jpg'

const Profile = () => {
  return (
    <div className="flex flex-col items-center min-h-screen w-full md:h-screen md:overflow-y-scroll md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100">
      <div className="flex justify-center mt-10 md:w-[35%] w-[98%] p-2 md:p-0">
        <div className='flex flex-col w-full items-center'>
          <div className='flex flex-row w-full justify-between '>
            <div className='flex flex-col justify-center items-center gep-y-2'>
              <div className='border-[1px] border-primary-100 rounded-full p-[2px]'>
                <img src={man} alt="avtar" width={40} height={40} />
              </div>
              <h1>Username</h1>
            </div>
            <div className='flex justify-evenly gap-5'>
              <div className='flex flex-col items-center cursor-pointer'>
                <div className='text-text-100 font-semibold'>Posts</div>
                <div className='font-semibold text-primary-100'>10</div>
              </div>
              <div className='flex flex-col items-center cursor-pointer'>
                <div className='text-text-100 font-semibold'>Followers</div>
                <div className='font-semibold text-primary-100'>10</div>
              </div>
              <div className='flex flex-col items-center cursor-pointer'>
                <div className='text-text-100 font-semibold'>Following</div>
                <div className='font-semibold text-primary-100'>10</div>
              </div>
            </div>

          </div>
          <div className='flex flex-col gap-1 items-center cursor-pointer '>
            <FcAddImage size={30} className='' />
            <h1 className='flex justify-center items-center'>Add Post</h1>
          </div>
          <hr className='bg-primary-100 h-[1px] border-none w-full my-4 mx-1' />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:p-4">
        <PostCard title="hello" desc="hello" date="1122" blogImage={man} />
        <PostCard title="hello" desc="hello" date="1122" blogImage={ubed1} />
        <PostCard title="hello" desc="hello" date="1122" blogImage={ubed2} />
        <PostCard title="hello" desc="hello" date="1122" blogImage={man} />
        <PostCard title="hello" desc="hello" date="1122" blogImage={man} />
      </div>

    </div>
  )
}

export default Profile