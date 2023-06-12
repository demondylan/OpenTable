import * as reviewActions from "../../store/reviews";
import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useState } from "react";
import { useModal } from "../../Context/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';


function EditReview(restaurantid) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const { restaurantId } = useParams()
    const reviews = useSelector((state) => state.reviews)
    const allReviews = Object.values(reviews)
    const oldReview = allReviews.filter(review => review.id == restaurantid.reviewId)
    const [message, setMessage] = useState(oldReview[0].message)
    const [value_rating, setValue_rating] = useState(oldReview[0].value_rating)
    const [food_rating, setFood_rating] = useState(oldReview[0].food_rating)
    const [service_rating, setService_rating] = useState(oldReview[0].service_rating)
    const [ambience_rating, setAmbience_rating] = useState(oldReview[0].ambience_rating)
    const restaurants = useSelector((state) => state.restaurants)
    const getALLRestaurants = Object.values(restaurants)
    const olderRestaurant = getALLRestaurants.filter(restaurant => restaurant.id == oldReview[0].restaurant_id)
    const oldRestaurant = olderRestaurant[0];
    const [address, setAddress] = useState(oldRestaurant.address);
    const [city, setCity] = useState(oldRestaurant.city);
    const [state, setState] = useState(oldRestaurant.state);
    const [zip_code, setZip_code] = useState(oldRestaurant.zip_code);
    const [open, setOpen] = useState(oldRestaurant.open);
    const [close, setClose] = useState(oldRestaurant.close);
    const [name, setName] = useState(oldRestaurant.name);
    const [description, setDescription] = useState(oldRestaurant.description);
    const [phone, setPhone] = useState(oldRestaurant.phone)
    const [food_type, setFood_type] = useState(oldRestaurant.food_type);
    const [logo, setLogo] = useState(oldRestaurant.logo)
    const updateMessage = (e) => setMessage(e.target.value)
    const updateValue_rating = (e) => setValue_rating(e.target.value)
    const updateFood_rating = (e) => setFood_rating(e.target.value)
    const updateService_rating = (e) => setService_rating(e.target.value)
    const updateAmbience_rating = (e) => setAmbience_rating(e.target.value)
    console.log(oldRestaurant)
    function getRating(reviews) {
        let rating = 0;
        for (let i = 0; i < reviews.length; i++ ) {
            let oldRating = (reviews[i].value_rating + reviews[i].food_rating + reviews[i].service_rating + reviews[i].ambience_rating)
            rating += oldRating/4
            
        }
        return (rating/reviews.length).toFixed(1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
restaurantid, value_rating, food_rating, service_rating, ambience_rating, message
        }
        let updatedReview = await dispatch(reviewActions.editReview(payload))
       let newRestaurantid = Number(restaurantid.reviewId)
  
       if (updatedReview) {
        const rating = getRating(allReviews)
        const newRestaurant = {
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
            rating,
        };
        let updatedRating = await dispatch(restaurantActions.editRestaurant(newRestaurant))
        if(updatedRating) {
        return dispatch(reviewActions.getAllReviews(oldRestaurant.id))
        .then(dispatch(restaurantActions.getRestaurant(oldRestaurant.id)))
            .then(closeModal)
            .catch();
       }
    }
    };

    return (
        <div>
                    <form onSubmit={handleSubmit} >
            <h1>Edit Your Review</h1>
            <input type= "text" placeholder="Enter your Experience"
              required value={message} onChange={updateMessage} ></input>
           How Was the food? <input type="number" placeholder="How Was the food?" value={food_rating} onChange={updateFood_rating} min={1} max={5} />
           How was the value for the price?<input type="number" placeholder="How was the value for the price?" value={value_rating} onChange={updateValue_rating} min={1} max={5} />
           How Was the Service? <input type="number" placeholder="How Was the Service?" value={service_rating} onChange={updateService_rating} min={1} max={5} />
           How Was the Ambience? <input type="number" placeholder="How Was the Ambience?" value={ambience_rating} onChange={updateAmbience_rating} min={1} max={5} />
            <button type='submit'>Submit Your Review</button>
            </form>
        </div>
    );
}

export default EditReview;