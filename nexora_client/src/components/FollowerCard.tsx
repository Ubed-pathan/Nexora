import defaultDp from '../assets/OIP.jpg'

const FollowerCard = (
    {
      avtar,
      username,
      id,
      activeTab,
      onUnfollowAndRemove
    }: {
      avtar: string;
      username: string;
      id: string;
      activeTab: string;
      onUnfollowAndRemove: (userId: string, operation:boolean) => void;
    }
) => {
    console.log(avtar)
  return (
    <div className="bg-bg-200 p-2 border border-primary-100 rounded-lg shadow-lg cursor-pointer relative w-[95%]">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 border-2 border-primary-100 rounded-full overflow-hidden">
                    <img src={avtar != null ? avtar : defaultDp} alt="Avatar" className="object-cover w-full h-full" />
                </div>
                <h1 className="text-text-100 font-semibold">{username}</h1>
            </div>

            {activeTab === "followers" ? (
              <h1 className="absolute top-1/2 right-4 transform -translate-y-1/2 text-red-500 cursor-pointer hover:text-red-700" onClick={() => onUnfollowAndRemove(id, false)} >
              Remove
              </h1>
            ) : (
                <h1 className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-600 cursor-pointer hover:text-primary-100" onClick={() => onUnfollowAndRemove(id, true)}>
                unfollow
                </h1>
            )}
        </div>
  )
}

export default FollowerCard;