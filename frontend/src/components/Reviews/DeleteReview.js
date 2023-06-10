import * as reviewActions from "../../store/reviews";
import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../Context/Modal";



function DeleteReview(reviewId) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const restaurantId = useSelector((state) => state.restaurants);

    const handleSubmit = (e) => {
        e.preventDefault();
        return dispatch(reviewActions.deleteReview(reviewId.reviewId))
        .then(dispatch(restaurantActions.getRestaurant(restaurantId.id)))
            .then(closeModal)
            .catch(
        );
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