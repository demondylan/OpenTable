import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GoogleMap, LoadScript, useJsApiLoader, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";
import * as restaurantActions from "../../store/restaurants";
import * as reviewActions from "../../store/reviews";
import * as searchbarActions from "../../store/searchbar";
import OpenMenu from '../Navigation/OpenMenu';
import PostReview from "../Reviews/PostReview";
import EditReview from "../Reviews/EditReview";
import DeleteReview from "../Reviews/DeleteReview";
import './Restaurants.css';

const FindRestaurant = ({ isPageLoaded }) => {
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => state.restaurants[restaurantId]);
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const center = useMemo(() => ({ lat: restaurant?.lat, lng: restaurant?.lng }), [restaurant?.lat, restaurant?.lng]);
  const allReviews = Object.values(reviews);



  const [filteredReviews, setFilteredReviews] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getRestaurant(restaurantId));
      await dispatch(reviewActions.getAllReviews(restaurantId));
      await dispatch(searchbarActions.getALLRestaurants());
    };

    fetchData();
  }, [dispatch, restaurantId]);

  useEffect(() => {
    const filteredReviews = allReviews.filter(review => review.restaurant_id == restaurantId);
    setFilteredReviews(filteredReviews);
  }, [restaurantId]);

  const checkUser = filteredReviews.filter(review => sessionUser && review.user_id === sessionUser.id);

  function getMonthName(num) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[num - 1];
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC5C0oGe2ocK8EuDGIljCwsiXrWJ48gPWw",
  });
  function getStatus(restaurant, status) {
    const currentTime = new Date();
    const openingTime = new Date();
    const closingTime = new Date();

    openingTime.setHours(parseInt(restaurant.open.split(':')[0]), parseInt(restaurant.open.split(':')[1]));
    closingTime.setHours(parseInt(restaurant.close.split(':')[0]), parseInt(restaurant.close.split(':')[1]));

    if (currentTime >= openingTime && currentTime < closingTime) {
      return "Open " + openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "-" + closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return "Closed Opens Tomorrow At " + openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  return (
    <>
      <div>
        {restaurant && isLoaded && !loadError && (
          <div>
            <div className="backgroundlogo">
              <img
                src={restaurant.logo}
                onError={(event) => {
                  event.target.src = 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
                }}
                alt="Restaurant Logo"
              />
            </div>
            <div className="restarauntname">{restaurant.name}</div>
            <p>{`${restaurant.address}, ${restaurant.city}, ${restaurant.state}, ${restaurant.zip_code}`}</p>
            <div className="map">
              {restaurant ? (
                <LoadScript googleMapsApiKey="AIzaSyC5C0oGe2ocK8EuDGIljCwsiXrWJ48gPWw">
                  <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={15}
                  >
                    {/* Child components, such as markers, info windows, etc. */}
                    <Marker onLoad={onLoad} position={center} />
                  </GoogleMap>
                </LoadScript>
              ) : (
                <div>Loading restaurant data...</div>
              )}
            </div>
            <div className="ownerreserves">
              <div className="reservebox">
                <p>{getStatus(restaurant)}</p>
                <div className="ratingreviews">
                  <p>Rating: {!restaurant.rating ? "No" : restaurant.rating}</p>
                  Reviews: {filteredReviews.length}
                </div>
                <div className="reservebutton"><button>Reserve Now</button></div>
              </div>
            </div>
            <div className="detaildescription">
              {restaurant.description}
            </div>
            <div className="reviewNcreate">
              <div className="numberofreviews">
                <i className="fa fa-star" aria-hidden="true"></i> <div>Overall Rating: {!restaurant.rating ? "No Stars" : restaurant.rating}</div>
                <div className="dot"> <i className="fa fa-circle" aria-hidden="true"></i> </div>
                {filteredReviews.length} reviews
              </div>
              <div className="postreviewbutton">
                {sessionUser && checkUser.length === 0 && sessionUser.id !== restaurant.owner_id && (
                  <OpenMenu
                    itemText="Post Your Review"
                    onItemClick={closeMenu}
                    modalComponent={<PostReview reviewId={restaurantId} />}
                  />
                )}
              </div>
            </div>
            <div className="reviewbox">
              {filteredReviews.map((review) => (
                <div key={review.id} className="eachreviewbox">
                  <div className="nameNdate">
                    <div className="reviewname">{review?.User?.firstName}</div>
                    <div className="reviewdate">
                      {`${getMonthName(review.updatedAt.slice(0, 7).split("-").reverse()[0])} ${review.updatedAt.slice(5, 7)} ${review.updatedAt.slice(0, 4)}`}
                    </div>
                  </div>
                  <div className="ratingsboxreview">
                    <div className="bold">Value Rating:</div>
                    <div className="redbold">{review.value_rating}</div>
                    <div className="bold">Food Rating:</div>
                    <div className="redbold">{review.food_rating}</div>
                    <div className="bold">Service Rating:</div>
                    <div className="redbold">{review.service_rating}</div>
                    <div className="bold">Ambience Rating:</div>
                    <div className="redbold">{review.ambience_rating}</div>
                  </div>
                  <p>{review.message}</p>
                  <div className="reviewbuttons">
                    {sessionUser && sessionUser.id === review.user_id && (
 <div className="edit-review-button">
 <OpenMenu
   itemText="Edit Your Review"
   onItemClick={closeMenu}
   modalComponent={<EditReview reviewId={review.id} />}
 />
</div>
)}
                    {sessionUser && sessionUser.id === review.user_id && (
                       <div className="edit-review-button">
                      <OpenMenu
                        itemText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteReview reviewId={review.id} />}
                      />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {loadError && <div>Error loading Google Maps</div>}
      </div>
    </>
  );
};

export default FindRestaurant;
