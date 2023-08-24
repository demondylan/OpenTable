import * as restaurantActions from "../../store/restaurants";
import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function DeleteRestaurant({ prop }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(restaurantActions.deleteRestaurant(prop))
      .then(closeModal)
      .catch((error) => {
        // Handle any error that occurs during the deletion process
        console.error("Error deleting restaurant:", error);
      });
  };

  return (
    <div className="deletespot">
      Are you sure you want to delete this restaurant? This action cannot be reversed.
      <div className="deletebuttons"></div>
      <button type="submit" onClick={handleSubmit}>
        Yes (Delete Restaurant)
      </button>
      <button onClick={closeModal}>No (Keep Restaurant)</button>
    </div>
  );
}

export default DeleteRestaurant;
