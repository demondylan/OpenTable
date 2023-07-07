import { csrfFetch } from "./csrf";

const GET_ALL_RESERVATIONS_SUCCESS = 'reservations/getAllReservationsSuccess';

const getAllReservationsSuccess = (reservations) => {
  return {
    type: GET_ALL_RESERVATIONS_SUCCESS,
    reservations
  };
};

export const fetchAllReservations = (restaurantId) => async (dispatch) => {
  const response = await fetch(`/api/restaurants/${restaurantId}/reservations`);
  const data = await response.json();
  if (response.ok) {
    dispatch(getAllReservationsSuccess(data));
  }
};

const ADD_RESERVATION = 'reservations/addReservation';

const addReservation = (reservation) => {
  return {
    type: ADD_RESERVATION,
    reservation
  }
}

export const createReservation = (reservationData) => async (dispatch) => {
  const response = await csrfFetch('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData)
  });
  const data = await response.json();
  if (response.ok) {
    return dispatch(addReservation(data));
  }
};

const DELETE_RESERVATION = 'reservations/deleteReservation';

const deleteReservation = (reservationId) => {
  return {
    type: DELETE_RESERVATION,
    reservationId
  }
}

export const removeReservation = (reservationId) => async dispatch => {
  const response = await csrfFetch(`/api/reservations/${reservationId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (response.ok) {
    return dispatch(deleteReservation(data));
  }
};

const reservationReducer = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case GET_ALL_RESERVATIONS_SUCCESS:
      newState = { ...state };
      action.reservations.forEach((reservation) => {
        newState[reservation.id] = reservation;
      });
      return newState;
    case ADD_RESERVATION: {
      return { ...state, [action.reservation.id]: action.reservation };
    }
    case DELETE_RESERVATION: {
      newState = { ...state };
      delete newState[action.reservationId];
      return newState;
    }
    default:
      return state;
  }
}

export default reservationReducer;
