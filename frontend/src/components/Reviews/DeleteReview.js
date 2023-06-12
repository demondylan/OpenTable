import * as reviewActions from "../../store/reviews";
import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../Context/Modal";



function DeleteReview(reviewId) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const reviews = useSelector((state) => state.reviews)
    const allReviews = Object.values(reviews)
    const oldReview = allReviews.filter(review => review.id == reviewId.reviewId)
    const restaurants = useSelector((state) => state.restaurants)
    const getALLRestaurants = Object.values(restaurants)
    const olderRestaurant = getALLRestaurants.filter(restaurant => restaurant.id == oldReview[0]?.restaurant_id)
    const oldRestaurant = olderRestaurant[0];
    const [address, setAddress] = useState(oldRestaurant?.address);
    const [city, setCity] = useState(oldRestaurant?.city);
    const [state, setState] = useState(oldRestaurant?.state);
    const [zip_code, setZip_code] = useState(oldRestaurant?.zip_code);
    const [open, setOpen] = useState(oldRestaurant?.open);
    const [close, setClose] = useState(oldRestaurant?.close);
    const [name, setName] = useState(oldRestaurant?.name);
    const [description, setDescription] = useState(oldRestaurant?.description);
    const [phone, setPhone] = useState(oldRestaurant?.phone)
    const [food_type, setFood_type] = useState(oldRestaurant?.food_type);
    const [logo, setLogo] = useState(oldRestaurant?.logo)

    function getRating(reviews) {
        let rating = 0;
        for (let i = 0; i < reviews.length; i++ ) {
            let oldRating = (reviews[i].value_rating + reviews[i].food_rating + reviews[i].service_rating + reviews[i].ambience_rating)
            rating += oldRating/4
            
            console.log(reviews[i].value_rating, reviews[i].food_rating, reviews[i].service_rating, reviews[i].ambience_rating)
        }
        return (rating/reviews.length).toFixed(1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedReview = await dispatch(reviewActions.deleteReview(reviewId.reviewId))
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
            Are you sure you want to delete this review? This action cannot be reversed.
            <button type='submit' onClick={handleSubmit}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default DeleteReview;