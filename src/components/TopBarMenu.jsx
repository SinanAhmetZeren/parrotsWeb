import "../assets/css/date-range-custom.css";

export const TopBarMenu = () => {
  return (
<nav className="flex space-x-12 sm:space-x-12 overflow-x-auto sm:overflow-x-visible">
<a href="#home" className="hover:text-gray-300 font-bold text-xl">
        Home
      </a>
      <a href="#profile" className="hover:text-gray-300 font-bold text-xl ">
        Profile
      </a>
      <a href="#voyage" className="hover:text-gray-300 font-bold text-xl">
        Voyages
      </a>
      <a href="#favorites" className="hover:text-gray-300 font-bold text-xl">
        Favorites
      </a>
      <a href="#connect" className="hover:text-gray-300 font-bold text-xl">
        Connect
      </a>
      <a href="#logout" className="hover:text-gray-300 font-bold text-xl">
        Logout
      </a>
    </nav>
  );
};
