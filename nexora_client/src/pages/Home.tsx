import PostCard from "../components/PostCard";
import man from '../assets/man.png';
import ubed1 from '../assets/1701612771662.jpg'
import ubed2 from '../assets/Picsart_24-04-14_15-49-05-429.jpg'

const Home = () => {
  return (
    <div className="md:h-screen md:overflow-y-scroll md:mx-20 md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100">
      <div className="mt-4 mb-16 md:space-y-4 md:px-14">
        <PostCard avtar={man} title="hello" desc="hello" date="1122" userName="asa" blogImage={man} />
        <PostCard avtar={ubed1} title="hello" desc="hello" date="1122" userName="asa" blogImage={ubed1} />
        <PostCard avtar={ubed2} title="hello" desc="hello" date="1122" userName="asa" blogImage={ubed2} />
        <PostCard avtar={man} title="hello" desc="hello" date="1122" userName="asa" blogImage={man} />
        <PostCard avtar={man} title="hello" desc="hello" date="1122" userName="asa" blogImage={man} />
      </div>
    </div>
  );
};

export default Home;
