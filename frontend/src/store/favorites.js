import { csrfFetch } from './csrf';

const GET_ALL_FAVORITES_SUCCESS = 'favorites/getAllFavoritesSuccess';
const ADD_FAVORITE_SUCCESS = 'favorites/addFavoriteSuccess';
const REMOVE_FAVORITE_SUCCESS = 'favorites/removeFavoriteSuccess';

const loadFavoritesSuccess = (favorites) => {
  return {
    type: GET_ALL_FAVORITES_SUCCESS,
    favorites
  };
};

const addFavoriteSuccess = (favorite) => {
  return {
    type: ADD_FAVORITE_SUCCESS,
    favorite
  };
};

const removeFavoriteSuccess = (favorite) => {
  return {
    type: REMOVE_FAVORITE_SUCCESS,
    favorite
  };
};

export const getALLFavorites = () => async (dispatch) => {
    const response = await fetch("/api/favorites");
    const data = await response.json();
    if (response.ok) {
     return dispatch(loadFavoritesSuccess(data.favorites || []));
    }
  };

export const addFavorite = (restaurantId) => async (dispatch) => {
  const response = await csrfFetch(`/api/favorites/${restaurantId}`, {
    method: 'POST',
  });

  if (response.ok) {
    const newFavorite = await response.json();
    dispatch(addFavoriteSuccess(newFavorite));
    return newFavorite;
  }
};

export const removeFavorite = (favoriteId) => async (dispatch) => {
  const response = await csrfFetch(`/api/favorites/${favoriteId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const removedFavorite = await response.json();
    dispatch(removeFavoriteSuccess(removedFavorite));
    return removedFavorite;
  }
};


const initialState = [];

const favoritesReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_FAVORITES_SUCCESS:
        return [...action.favorites]; // Update state with a new array
        
      case ADD_FAVORITE_SUCCESS:
        return [...state, action.favorite]; // Add new favorite to the state array
      case REMOVE_FAVORITE_SUCCESS:
        return state.filter((favorite) => favorite.id !== action.favorite.id); // Remove the favorite from the state array
      default:
        return state;
    }
  };



export default favoritesReducer;
