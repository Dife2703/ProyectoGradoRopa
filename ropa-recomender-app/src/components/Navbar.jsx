import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { HomeIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const userEmail = auth.currentUser?.email;

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`group px-4 py-3 flex justify-between items-center
        bg-red-500 text-white shadow-md
        md:bg-transparent md:shadow-none md:text-gray-600
        md:hover:bg-red-500 md:hover:text-white
        md:transition-colors md:duration-300
        backdrop-blur-md`}
    >
      {/* Casa con animación y texto al hover */}
      <div className="relative flex items-center">
        <HomeIcon
          onClick={() => navigate("/")}
          className="h-8 w-8 cursor-pointer transition-all duration-300 transform md:group-hover:-translate-y-1 md:group-hover:scale-105 md:group-hover:opacity-90 md:group-hover:text-white"
        />
        <span
          className="hidden md:inline-block absolute left-10 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-lg font-medium"
        >
          Inicio
        </span>
      </div>

      {/* Botones a la derecha */}
      <div className="flex items-center gap-5 relative">
        <button
          onClick={() => navigate("/estado-animo")}
          className="text-lg transition-all duration-300 transform md:hover:-translate-y-1 md:hover:scale-105 md:hover:opacity-90 group-hover:text-white"
        >
          Repetir Test
        </button>

        {/* Icono con dropdown */}
        <div className="relative" ref={menuRef}>
          <UserCircleIcon
            onClick={() => setShowMenu((prev) => !prev)}
            className="h-9 w-9 cursor-pointer transition-transform duration-300 transform md:hover:scale-105 group-hover:text-white"
          />

          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-lg shadow-lg z-50 p-4">
              <p className="text-sm mb-3 font-medium truncate">{userEmail}</p>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100 text-red-600 transition-all duration-200"
              >
                {/* Ícono SVG personalizado */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#dc2626"
                  viewBox="0 0 256 256"
                >
                  <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>
                </svg>
                <span className="flex-1 text-left">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;