
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter,Route ,Routes} from "react-router-dom";
import Login from "./components/loginPage/Login.jsx";
import Register from "./components/register/Register.jsx";
import MoviesOverview from "./components/register/moviesOverview/MoviesOverview.jsx";
import Favourites from "./components/Favourites.jsx";
import FooterData from "./components/FooterData.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(

  

    <BrowserRouter>
      <div>
        <div>
          <Navbar />
        </div>
       
        <div className="mt-16">
        <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/moviesOverview/:id" element={<MoviesOverview/>}/>
        <Route path='/favourites' element={<Favourites/>}/>
        </Routes>
        </div>

       <footer>
       <FooterData/>
       </footer>
      </div>
    </BrowserRouter>

);
