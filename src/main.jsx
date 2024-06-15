import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/loginPage/Login.jsx";
import Register from "./components/register/Register.jsx";
import MediaOverview from "./components/mediaOverview/MediaOverview.jsx";
import Favourites from "./components/Favourites.jsx";
import FooterData from "./components/FooterData.jsx";
import 'react-toastify/dist/ReactToastify.css';


import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="backgroundImage flex flex-col min-h-screen">
      {/* Place the ToastContainer component here, at the root level */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Navbar />

      <div className="flex-grow mt-16">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mediaOverview/:id" element={<MediaOverview />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>

      <footer className=" text-center">
        <FooterData />
      </footer>
    </div>
  </BrowserRouter>
);
