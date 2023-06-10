import * as restaurantActions from "../../store/restaurants";

import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function DeleteRestaurant(restaurant) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    return dispatch(restaurantActions.deleteRestaurant(restaurant.prop))
      .then(closeModal)
      .catch(
      );
  };

  return (
    <div className="deletespot">
      Are you sure you want to delete this restaurant? This action cannot be reversed.
      <div className="deletebuttons"></div>
      <button type='submit' onClick={handleSubmit}>Yes(Delete Restaurant)</button>
      <button onClick={closeModal}>No(Keep Restaurant)</button>
    </div>
  );
}

export default DeleteRestaurant;