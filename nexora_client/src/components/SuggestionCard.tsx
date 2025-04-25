const SuggestionCard = ({
  id,
  avtar,
  username,
  handleFollow,
  onUserClick,
}: {
  id:string;
  avtar: string;
  username: string;
  handleFollow(id : string ) : void;
  onUserClick: (userData: {
    id: string;
    username: string;
    avtar: string;
  }) => void;
}) => {
  return (
    <div className="bg-bg-200 p-2 border border-primary-100 rounded-lg shadow-lg" onClick={() => onUserClick({id, username:username, avtar})}>
        <div className="flex justify-between">
        <div className="flex justify-start gap-4">
        <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
            <img src={avtar} alt="Avatar" className="object-cover w-full h-full" />
          </div>
            <div>
              <h1 className="text-text-100 font-semibold">{username}</h1>
              {/* <span className="text-text-200 text-sm">Followed by {followedBy}</span> */}
            </div>
        </div>
        <div className="flex justify-center items-center">
          <h1 className="text-blue-700 font-semibold cursor-pointer hover:text-primary-100" onClick={() => handleFollow(id)}>
          Follow
          </h1>
        </div>
        </div>
    </div>
  )
}

export default SuggestionCard