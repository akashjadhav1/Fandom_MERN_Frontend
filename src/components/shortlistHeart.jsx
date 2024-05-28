import {
    addToShortlist,
    removeFromShortlist,
  } from "@/features/userData/userDataThunks";
 
  import { GoHeart, GoHeartFill } from "react-icons/go";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  
  function ShortListHeart({moviesId}) {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const shortlist = useSelector((state) => state.userData.shortlist);
    const isShortlisted = isAuthenticated && shortlist.includes(moviesId);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleHeartClick = (e) => {
      e.stopPropagation();
      if (isAuthenticated) {
        dispatch(
          isShortlisted
            ? removeFromShortlist(moviesId)
            : addToShortlist(moviesId)
        );
      } else {
        navigate("/login");
      }
    };
  
    return (
      <div onClick={handleHeartClick}>
        {isShortlisted ? (
          <GoHeartFill className="text-red-500" />
        ) : (
          <GoHeart className="text-gray-500" />
        )}
      </div>
    );
  }
  
  export default ShortListHeart;
  