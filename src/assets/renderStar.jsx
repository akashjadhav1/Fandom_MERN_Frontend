import { MdStarOutline, MdStar } from 'react-icons/md'; // Import star icons


export const renderStars = (rating) => {
    const stars = [];
    const roundedRating = (Math.round(rating/2)); // Round the rating to the nearest whole number

    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<MdStar className="text-yellow-500 text-lg" key={i} />);
      } else {
        stars.push(<MdStarOutline className="text-gray-400 text-lg" key={i} />);
      }
    }

    return stars;
  };