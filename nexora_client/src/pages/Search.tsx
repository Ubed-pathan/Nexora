import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import axios from "axios";
import UserSearchCard from "../components/UserSearchCard";
import { useRecoilValue } from "recoil";
import { authState } from "../recoilStates/auth/atom";
import defaultDp from '../assets/OIP.jpg';

const Search: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const auth = useRecoilValue(authState);

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
                key={user.username}
                avtar={user.profileImageUrl ? user.profileImageUrl : defaultDp}
                username={user.username}
                followedBy={user.followedBy || "Unknown"}
              />
            ))
          ) : (
            <p className="p-3 text-gray-500">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
