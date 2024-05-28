import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/fandomLogo.svg";
import { Link } from "react-router-dom";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "react-toastify";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark"
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
      toast.success('User logged out successfully', toastConfig);
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error('Error signing out', toastConfig);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gray-900 shadow-sm text-white dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div>
          <Link to="/">
          <img src={Logo} alt="logo" className="lg:w-[14%] w-[24%]" />
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
                        className="w-[150px] lg:w-[90px] rounded-full border-2 border-red-700 cursor-pointer"
                      />
                    ) : (
                      <span className="flex justify-center items-center border-4 border-yellow-700 text-pink-600 w-10 h-10 font-bold text-xl rounded-full">{user.email.substring(0,1).toUpperCase()}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                {menuOpen && (
                  <DropdownMenuContent className="absolute top-full right-[-10px] w-[250px] h-auto bg-gray-800 border-none shadow-lg rounded">
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Link to="/favourites">
                        <Button
                          size="sm"
                          className="block"
                          onClick={() => setMenuOpen(false)}
                        >
                          Favorites
                        </Button>
                      </Link>
                    </DropdownMenuItem>
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
