import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";
import { RxDashboard } from "react-icons/rx";
import { GrAnalytics } from "react-icons/gr";
import logo from '@/assets/logo_d.png';
import "@fontsource/audiowide";

interface NavbarProps {
     onLogout: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
     const [open, setOpen] = useState(true);
     const navigate = useNavigate();
     const location = useLocation();

     const Menus = [
          { title: "Home", icon: <TiHomeOutline />, path: "/" },
          { title: "Dashboard", icon: <RxDashboard />, path: "/dashboard" },
          { title: "Analytics", icon: <GrAnalytics />, path: "/analytics" },
          { title: "Settings", icon: <IoMdSettings />, path: "/settings" },
     ];

     const handleNavigate = (path: string) => {
          navigate(path);
     };

     return (
          <div className="z-20 flex bg-gray-50">
               <div className={`bg-zinc-900 h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative flex flex-col shadow-md`}>
                    <BsArrowLeftShort
                         className={`bg-white text-black text-3xl rounded-lg absolute -right-3 top-9 border border-black cursor-pointer transition-transform duration-300 ${!open && "rotate-180"}`}
                         onClick={() => setOpen(!open)}
                    />
                    <div className="inline-flex items-center transition-none">
                         <img
                              src={logo} alt="Logo"
                              className={`bg-white text-4xl rounded cursor-pointer block float-left mr-2 duration-500 w-9 h-9 ${open && "rotate-[360deg]"}`}
                         />
                         <h1 className={`text-white origin-left font-medium font-audiowide text-2xl ${!open && "hidden"}`}>
                              <span className="font-bold text-transparent bg-gradient-to-br from-orange-400 to-pink-500 bg-clip-text">G</span>UARDIAN
                         </h1>
                    </div>

                    {/* Menu Items */}
                    <ul className="pt-3">
                         {Menus.map((menu, index) => (
                              <li
                                   key={index}
                                   className={`text-sm flex items-center gap-x-4 p-2 mb-3 cursor-pointer rounded-md transition-all duration-300 ${location.pathname === menu.path
                                        ? "bg-gray-700 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }`}
                                   onClick={() => handleNavigate(menu.path)}
                              >
                                   <div className="relative group">
                                        <span className="block float-left text-2xl">{menu.icon}</span>
                                        {!open && (
                                             <span className="absolute max-w-xs px-2 py-1 text-lg text-black transition-opacity duration-500 ease-in-out bg-white rounded-md shadow-md opacity-0 left-14 group-hover:opacity-100 min-w-max">
                                                  {menu.title}
                                             </span>
                                        )}
                                   </div>
                                   <span className={`text-lg font-medium flex-1 ${!open && "hidden"}`}>{menu.title}</span>
                              </li>
                         ))}
                    </ul>

                    {/* Logout Button */}
                    {/* Logout Button */}
                    <div className="mt-auto">
                         <ul>
                              <li className="pb-3">
                                   <div className={`flex items-center rounded-md bg-gray-700 mt-6 py-2 ${open ? "px-4" : "px-2.5"} hover:text-white transition-all cursor-pointer`}>
                                        <FaSearch className="block float-left text-xl text-white" />
                                        <input
                                             type="search"
                                             placeholder="Search..."
                                             className={`text-base bg-transparent w-full text-white ml-4 focus:outline-none ${!open && "hidden"}`}
                                        />
                                   </div>
                              </li>
                              <li
                                   className="flex items-center p-2 text-sm text-gray-300 transition-all duration-500 rounded-md cursor-pointer gap-x-4 hover:bg-gray-700 hover:text-white"
                                   onClick={() => onLogout()}
                              >
                                   <div className="relative group">
                                        <span className="block float-left text-2xl"><TbLogout2 /></span>
                                        {!open && (
                                             <span className="absolute max-w-xs px-2 py-1 text-lg text-black transition-opacity duration-500 ease-in-out bg-white rounded-md shadow-md opacity-0 left-14 group-hover:opacity-100 min-w-max">
                                                  Logout
                                             </span>
                                        )}
                                   </div>
                                   <span className={`text-lg font-medium flex-1 ${!open && "hidden"}`}>
                                        Logout
                                   </span>
                              </li>
                         </ul>
                    </div>
               </div>
          </div>
     );
};

export default Navbar;