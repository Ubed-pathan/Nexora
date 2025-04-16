import { useState } from "react";
import defaultDp from "../assets/OIP.jpg";

type AllUsersCardProps = {
  avtar: string;
  username: string;
  id: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string, currentlyFollowing: boolean) => void;
  onUserClick: (userData: {
    id: string;
    username: string;
    avtar: string;
  }) => void;
};

const AllUsersCard = ({
  avtar,
  username,
  id,
  isFollowing,
  onFollowToggle,
  onUserClick,
}: AllUsersCardProps) => {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const handleFollowToggle = () => {
    onFollowToggle(id, isFollowingState);
    setIsFollowingState(!isFollowingState);
  };
  return (
    <div className="bg-bg-200 p-2 border border-primary-100 rounded-lg shadow-lg cursor-pointer">
      <div
        className="flex justify-between"
        onClick={() => onUserClick({ id, username, avtar })}
      >
        <div className="flex justify-start gap-4">
          <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
            <img
              src={avtar ? avtar : defaultDp}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-text-100 font-semibold">{username}</h1>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <h1
            className="text-blue-700 font-semibold cursor-pointer hover:text-primary-100"
            onClick={(e) => {
              e.stopPropagation(); // Prevents parent click
              handleFollowToggle();
            }}
          >
            {isFollowingState ? "Unfollow" : "Follow"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AllUsersCard;
