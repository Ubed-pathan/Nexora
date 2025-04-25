
const UserSearchCard = (
    {
      avtar,
      userId,
      username,
      onUserClick,
    }: {
      avtar: string;
      userId: string;
      username: string;
      onUserClick: (userData: {
        id: string;
        username: string;
        avtar: string;
      }) => void;
    }
) => {
  return (
    <>
       <div className="bg-bg-200 p-2 border border-primary-100 rounded-lg shadow-lg cursor-pointer" onClick={() => onUserClick({id:userId, username:username, avtar})}>
        <div className="flex justify-between">
        <div className="flex justify-start gap-4">
        <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
            <img src={avtar} alt="Avatar" className="object-cover w-full h-full" />
          </div>
            <div className="flex justify-center items-center">
              <h1 className="text-text-100 font-semibold">{username}</h1>
              {/* <span className="text-text-200 text-sm">Followed by {followedBy}</span> */}
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default UserSearchCard