import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/fandomLogo.svg";
import { Link } from "react-router-dom";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem } from "./ui/dropdown-menu";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Set loading to false when user state is updated
      },
      (error) => {
        console.error("Error getting user profile:", error);
        setLoading(false); // Set loading to false in case of error
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gray-900 shadow-sm text-white dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="">
            <img src={Logo} alt="logo" className="lg:w-[14%] w-[24%]" />
          </div>

          <div className="relative">
            {loading ? (
              <span>Loading...</span> // Show loading message while fetching user state
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="" asChild>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-sm focus:outline-none "
                  >
                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="w-[150px] lg:w-[90px] rounded-full border-2 border-red-700 cursor-pointer"
                    />
                    
                  </button>
                </DropdownMenuTrigger>
                {/* Dropdown menu */}
                {menuOpen && (
                  <DropdownMenuContent className="absolute top-full right-[-10px] w-[250px] h-auto bg-gray-800 border-none shadow-lg rounded">
                    <p></p>
                    <DropdownMenuItem className="hover:bg-gray-700 " >
                      <Link to="/favourites">
                        <Button
                          size="sm"
                          
                          className="block"
                          onClick={() => setMenuOpen(false)} // Close the menu after selecting favorites
                        >
                          Favorites
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Button
                        size="sm"
                       
                        className=""
                        onClick={() => {
                          handleSignOut();
                          setMenuOpen(false); // Close the menu after sign out
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
