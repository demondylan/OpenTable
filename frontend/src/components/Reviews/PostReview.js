import * as reviewActions from "../../store/reviews";
import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function PostReview(restaurantid) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [message, setMessage] = useState('')
    const [value_rating, setValue_rating] = useState(1)
    const [food_rating, setFood_rating] = useState(1)
    const [service_rating, setService_rating] = useState(1)
    const [ambience_rating, setAmbience_rating] = useState(1)
    const updateMessage = (e) => setMessage(e.target.value)
    const updateValue_rating = (e) => setValue_rating(e.target.value)
    const updateFood_rating = (e) => setFood_rating(e.target.value)
    const updateService_rating = (e) => setService_rating(e.target.value)
    const updateAmbience_rating = (e) => setAmbience_rating(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
restaurantid, value_rating, food_rating, service_rating, ambience_rating, message
        }
       let newRestaurantid = Number(restaurantid.reviewId)
  

        return dispatch(reviewActions.newReview(payload))
        .then(dispatch(restaurantActions.getRestaurant(newRestaurantid)))
        .then(dispatch(reviewActions.getAllReviews(newRestaurantid)))
            .then(closeModal)
            .catch();
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