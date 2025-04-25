import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import axios from "axios";
import UserSearchCard from "../components/UserSearchCard";
import defaultDp from "../assets/OIP.jpg";
import OtherUserProfileCard from "../components/OtherUserProfileCard";

const Search: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<SelectedUserdata | null>(
    null
  );

  // Function to fetch users (Debounced)
  const fetchUsers = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setUsers([]); // Don't search for short queries
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/user/search?query=${searchTerm}`,
        { withCredentials: true }
      );
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  // Debounce effect: Calls API after user stops typing for 300ms
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchUsers(query);
    }, 300);

    return () => clearTimeout(delaySearch); // Cleanup previous timeout
  }, [query]);

  const handleUserClick = (userData: {
    id: string;
    username: string;
    avtar: string;
  }) => {
    setSelectedUser({
      id: userData.id,
      username: userData.username,
      secureImageUrl: userData.avtar,
      following: null,
    });
  };

  function onFollowChange(userId: string, newStatus: boolean) {
    //
  }

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedUser]);

  return (
    <div className="relative w-[90%] md:w-full max-w-md mx-auto mt-20 md:mt-10">
      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-12 py-3 border border-gray-300 bg-bg-300 text-primary-100 rounded-full outline-none focus:ring-2 focus:ring-primary-100 transition placeholder:text-primary-100 pr-10"
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-100">
          <SearchIcon size={20} />
        </div>

        {/* Clear Button (X) */}
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-5 top-[48%] transform -translate-y-1/2 text-gray-700 hover:text-red-700 transition text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* Search Results */}
      {query.length >= 2 && (
        <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-3 text-gray-500">Loading...</p>
          ) : users.length > 0 ? (
            users.map((user: any) => (
              <UserSearchCard
                key={user.id}
                userId={user.id}
                avtar={user.secureImageUrl ? user.secureImageUrl : defaultDp}
                username={user.username}
                onUserClick={() =>
                  handleUserClick({
                    id: user.id,
                    username: user.username,
                    avtar: user.secureImageUrl || "",
                  })
                }
              />
            ))
          ) : (
            <p className="p-3 text-gray-500">No users found</p>
          )}
        </div>
      )}

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
              onFollowChange={onFollowChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
