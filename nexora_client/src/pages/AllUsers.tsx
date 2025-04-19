import { useEffect, useState } from "react";
import AllUsersCard from "../components/AllUsersCard";
import axios from "axios";
import { authState } from "../recoilStates/auth/atom";
import { useRecoilValue } from "recoil";
import OtherUserProfileCard from "../components/OtherUserProfileCard";
import { Loader } from "lucide-react";

interface User {
  id: string;
  secureImageUrl: string | null;
  username: string;
  following: boolean;
}

interface SelectedUserdata {
  id: string;
  username: string;
  secureImageUrl: string | null;
  following: boolean;
}

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useRecoilValue(authState);
  const [selectedUser, setSelectedUser] = useState<SelectedUserdata | null>(
    null
  );

  const handleUserClick = (userData: {
    id: string;
    username: string;
    avtar: string;
    following: boolean;
  }) => {
    setSelectedUser({
      id: userData.id,
      username: userData.username,
      secureImageUrl: userData.avtar,
      following: userData.following,
    });
  };

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User[]>(
          `${import.meta.env.VITE_SERVER_API}/user/allusers`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setAllUsers(response.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  const handleFollowToggle = async (
    userId: string,
    currentlyFollowing: boolean
  ) => {
    try {
      const endpoint = `${import.meta.env.VITE_SERVER_API}/follow/${
        auth.id
      }/${userId}/${currentlyFollowing ? "unfollow" : "follow"}`;
      await axios.post(
        endpoint,
        {},
        {
          withCredentials: true,
        }
      );

      setAllUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, following: !currentlyFollowing }
            : user
        )
      );
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden"; // Lock scroll
    } else {
      document.body.style.overflow = "auto"; // Unlock scroll
    }

    // Clean up in case component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedUser]);

  return (
    <>
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-lg">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative bg-bg-100 p-4 shadow-lg z-10 w-[90%] h-[90%] overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-rounded md:scrollbar-thumb-bg-300 md:scrollbar-track-bg-100">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-purple-500 text-xl font-bold hover:text-purple-700 transition"
              aria-label="Close"
            >
              ✖
            </button>

            <h1 className="text-xl text-center mb-4 text-primary-100">
              User Profile
            </h1>

            <OtherUserProfileCard
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onFollowChange={(userId, newStatus) => {
                setAllUsers((prev) =>
                  prev.map((u) =>
                    u.id === userId ? { ...u, following: newStatus } : u
                  )
                );
                setSelectedUser((prev) =>
                  prev && prev.id === userId
                    ? { ...prev, following: newStatus }
                    : prev
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center w-full min-h-screen p-4">
        <div className="w-full max-w-md">
          <h1 className="text-xl text-center mb-4 text-primary-100">
            All Users
          </h1>
          {loading && (
            <div className="flex justify-center items-center h-96">
              <Loader className="w-10 h-10 text-primary-100 animate-spin" />
            </div>
          )}

          {!loading && allUsers.length !== 0 ? (
            <div className="space-y-2 w-full">
              {allUsers.map((user) => {
                return (
                  <AllUsersCard
                    key={user.id}
                    avtar={user.secureImageUrl}
                    username={user.username}
                    id={user.id}
                    isFollowing={user.following}
                    onFollowToggle={handleFollowToggle}
                    onUserClick={() =>
                      handleUserClick({
                        id: user.id,
                        username: user.username,
                        avtar: user.secureImageUrl || "",
                        following: user.following,
                      })
                    }
                  />
                );
              })}
            </div>
          ) : null}

          {!loading && allUsers.length === 0 && (
            <div className="flex justify-center items-center">
              <h1 className="text-text-100 font-semibold">No Users Found</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
