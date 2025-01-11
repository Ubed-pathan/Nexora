import SuggestionCard from "./SuggestionCard"
import man from '../assets/man.png';


export const Suggestions = () => {
  return (
    <div className="hidden md:block w-full min-h-screen bg-bg-300">
      <div>
        <h1 className="text-primary-100 font-semibold ml-2 py-2 text-xl">
          Suggested for you
        </h1>
      </div>
      <div className="flex flex-col px-1 gap-y-2 w-full max-h-[450px] overflow-y-scroll scrollbar-thin scrollbar-thin custom-scrollbar ">
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/>
      <SuggestionCard avtar={man} username="adam" followedBy="jack"/> 
      </div>

      <div className=" flex flex-col text-center pt-5">
          <h1 className="text-primary-100 text-xl font-semibold">Nexora</h1>
          <h1 className="text-text-100 font-medium">© 2025 All rights reserved</h1>
      </div>
      
    </div>
  )
}
