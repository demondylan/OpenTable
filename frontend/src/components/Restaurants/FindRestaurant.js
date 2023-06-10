import * as restaurantActions from "../../store/restaurants";
import * as reviewActions from "../../store/reviews"
import * as searchbarActions from "../../store/searchbar"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OpenMenu from '../Navigation/OpenMenu';
import PostReview from "../Reviews/PostReview";
import DeleteReview from "../Reviews/DeleteReview";
import './Restaurants.css';


const FindRestaurant = () => {

  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)
  const restaurant = useSelector((state) => state.restaurants);
  const sessionUser = useSelector((state) => state.session.user)
  let reviews = useSelector((state) => state.reviews)

  const allReviews = Object.values(reviews)
  reviews = allReviews.filter(review => review.restaurant_id == restaurantId)
 
  useEffect(() => {
    dispatch(restaurantActions.getRestaurant(restaurantId)).then(dispatch(reviewActions.getAllReviews(restaurantId))).then(dispatch(searchbarActions.getALLRestaurants())).then(() => setIsLoaded(true))
  }, [dispatch, restaurantId])
 
  const checkUser = reviews.filter(review => review.user_id === sessionUser.id)


  function getMonthName(num) {
    const months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "]
    return months[num-1]
    }
  
  return (
    <>
      <div>
        {isLoaded && <div>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.city},{restaurant.state},{restaurant.zip_code}</p>
          <div className="detailimage">
            <div className="column">
          {            <img src={restaurant.logo} onError={({ currentTarget }) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src='https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
  }}/>}
</div>
</div>
<div className="ownerreserves">
<div className="reservebox"><p>{restaurant.price} night</p>
<div className="ratingreviews">
<p>Rating:{!restaurant.rating ? "No Stars" : Math.round(`${restaurant.rating}` / .10) * .10} </p>
 Reviews:{reviews.length}
</div>
<div className="reservebutton"><button>Reserve Now</button></div></div></div>
<div className="detaildescription">
  {restaurant.description}</div>



  <div className="numberofreviews"><i className="fa fa-star" aria-hidden="true"></i> <div> {!restaurant.rating ? "No Stars" : Math.round(`${restaurant.rating}` / .10) * .10}</div> <div className="dot"> <i className="fa fa-circle" aria-hidden="true"></i> </div>{reviews.length} reviews</div>
                     <div className="reviewbox">
                     {reviews.map((restaurant) => (<div key={restaurant.id} className= "eachreviewbox">
<div><div className="reviewname">{restaurant?.User?.firstName}</div>
<div className="reviewdate">{getMonthName(restaurant.updatedAt.slice(0,7).split("-").reverse()[0])}
{restaurant.updatedAt.slice(0,4)}</div>
</div>
<p>{restaurant.message}</p>
<div>
{sessionUser.id === restaurant.user_id && (reviews.map(review => sessionUser.id === review.user_id && (<OpenMenu
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<DeleteReview reviewId={review.id}/>}
                    />)
                    ))}
</div>
</div>
))
}
</div>
<div className="postreviewbutton">
          {sessionUser && (checkUser.length === 0 && (sessionUser.id !== restaurant.owner_id && (<OpenMenu
                itemText="Post Your Review"
                onItemClick={closeMenu}
                modalComponent={<PostReview reviewId={restaurantId}/>}
                />)))}
                </div>
        </div>
        
        }
      </div>
    </>

  );
}

export default FindRestaurant;