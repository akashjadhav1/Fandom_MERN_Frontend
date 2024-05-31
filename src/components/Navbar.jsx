import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/fandomLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { toast } from "react-toastify";
import defaultProfile from '@/assets/profileLogo.png';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting user profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      toast.success("User logged out successfully", toastConfig);
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Error signing out", toastConfig);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gray-900 shadow-sm text-white dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div>
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                className="lg:w-[14%] md:w-[20%] w-[23%]"
              />
            </Link>
          </div>

          <div className="relative">
            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-sm focus:outline-none"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-[11rem] lg:w-[90px] md:w-[140px] rounded-full border-2 border-red-700 cursor-pointer"
                      />
                    ) : (
                      <div className="flex justify-center items-center border-4 border-yellow-700 bg-white  w-11 h-11 rounded-full">
                        <img src={defaultProfile} className="" alt="profile" />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                {menuOpen && (
                  <DropdownMenuContent className="absolute top-0 right-[-10px] w-[250px] h-auto bg-gray-800 border-none shadow-blue-400 shadow-md rounded">
                    <DropdownMenuItem>
                      {user.photoURL && user.email ? (
                        <div className="flex items-center mt-5">
                          <img
                            src={user.photoURL}
                            className="w-9 h-9 rounded-full"
                            alt="profile"
                          />
                          <p className="mx-2">{user.email}</p>
                        </div>
                      ) : (
                        <p className="text-center">{user.email}</p>
                      )}
                    </DropdownMenuItem>
                    <hr className="mt-2" />
                    <Link to="/favourites">
                      <DropdownMenuItem className="hover:bg-gray-700">
                        <Button
                          size="sm"
                          className="block"
                          onClick={() => setMenuOpen(false)}
                        >
                          Favorites
                        </Button>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Button
                        size="sm"
                        onClick={() => {
                          handleSignOut();
                          setMenuOpen(false);
                        }}
                      >
                        Sign out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button size="sm" className="rounded" variant="outline">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded" variant="outline">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
