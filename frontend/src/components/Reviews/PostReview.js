import * as reviewActions from "../../store/reviews";
import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useState } from "react";
import { useModal } from "../../Context/Modal";
import { useDispatch, useSelector } from 'react-redux';

function PostReview({ restaurantId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal('PostReview');
    const [message, setMessage] = useState('');
    const [value_rating, setValue_rating] = useState(1);
    const [food_rating, setFood_rating] = useState(1);
    const [service_rating, setService_rating] = useState(1);
    const [ambience_rating, setAmbience_rating] = useState(1);
  
    const updateMessage = (e) => setMessage(e.target.value);
    const updateValue_rating = (e) => setValue_rating(parseInt(e.target.value));
    const updateFood_rating = (e) => setFood_rating(parseInt(e.target.value));
    const updateService_rating = (e) => setService_rating(parseInt(e.target.value));
    const updateAmbience_rating = (e) => setAmbience_rating(parseInt(e.target.value));
    const reviews = useSelector((state) => state.reviews);
    const allReviews = Object.values(reviews);
    const oldReview = allReviews.find((review) => review.id == restaurantId);
  
    // Access restaurant_id from oldReview
    const restaurant_id = oldReview ? oldReview.restaurant_id : '';
  
    const restaurants = useSelector((state) => state.restaurants);
    const restaurantArray = Object.values(restaurants); // Initialize restaurantArray
  
    const oldRestaurant = restaurantArray.find((restaurant) => restaurant.id === restaurant_id);
 

    if (!oldRestaurant) {
        // Handle the error or set default values
        return <div>Restaurant not found</div>;
      }

      const {
        address = '',
        city = '',
        state = '',
        zip_code = '',
        open = '',
        close = '',
        name = '',
        description = '',
        phone = '',
        food_type = '',
        logo = '',
      } = oldRestaurant;
      
 function getRating(reviews, newReview) {
  const existingReview = reviews.find(review => review.id === newReview.review.id);

  let ratingSum = 0;
  let totalRatings = reviews.length * 4; // Multiply by 4 to account for all four rating categories

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];

    if (existingReview && review.id === existingReview.id) {
      // Exclude the existing review from the calculation
      totalRatings -= 4;
      continue;
    }

    ratingSum +=
      review.value_rating +
      review.food_rating +
      review.service_rating +
      review.ambience_rating;
  }

  const newRating = newReview.review;

  ratingSum +=
    newRating.value_rating +
    newRating.food_rating +
    newRating.service_rating +
    newRating.ambience_rating;
  totalRatings += 4; // Increment by 4 for the new review

  const overallRating = ratingSum / totalRatings;

  return overallRating.toFixed(1);
}
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const payload = {
          restaurantId,
          value_rating,
          food_rating,
          service_rating,
          ambience_rating,
          message,
        };
      
        try {
          let newRestaurant; // Declare newRestaurant variable
      
          const [updatedReview] = await Promise.all([
            dispatch(reviewActions.newReview(payload)),
          ]);
          if (updatedReview) {
            const rating = getRating(allReviews, updatedReview);
            newRestaurant = {
              ...oldRestaurant,
              address,
              city,
              state,
              zip_code,
              open,
              close,
              name,
              description,
              phone,
              food_type,
              logo,
              rating: rating,
            };

            const updatedRating = await dispatch(
              restaurantActions.editRestaurant(newRestaurant)
            );
      
            if (updatedRating) {
              return dispatch(restaurantActions.getRestaurant(oldRestaurant.id))
                .then(dispatch(reviewActions.getAllReviews(oldRestaurant.id)))
                .then(closeModal)
                .catch();
            }
          }
        } catch (error) {
          console.error(error);
          // Handle the error here, such as displaying an error message to the user
        }
      };
      

    
    return (
        <div>
                    <form onSubmit={handleSubmit} >
            <h1>How was your stay?</h1>
            <input type= "text" placeholder="Enter your Experience"
              required onChange={updateMessage} ></input>
           How Was the food? <input type="number" placeholder="How Was the food?" value={food_rating} onChange={updateFood_rating} min={1} max={5} />
           How was the value for the price?<input type="number" placeholder="How was the value for the price?" value={value_rating} onChange={updateValue_rating} min={1} max={5} />
           How Was the Service? <input type="number" placeholder="How Was the Service?" value={service_rating} onChange={updateService_rating} min={1} max={5} />
           How Was the Ambience? <input type="number" placeholder="How Was the Ambience?" value={ambience_rating} onChange={updateAmbience_rating} min={1} max={5} />
            <button type='submit'>Submit Your Review</button>
            </form>
        </div>
    );
}

export default PostReview;