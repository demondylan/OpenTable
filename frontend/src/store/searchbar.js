import { csrfFetch } from './csrf';

const GET_ALL_RESTAURANTS = 'searchbar/getALLRestaurants';

 const loadRestaurants = (searchbar) => {
    return {
        type: GET_ALL_RESTAURANTS,
        searchbar
    }
};

export const getALLRestaurants = () => async dispatch => {
    const response = await fetch("/api/restaurants");
        const data = await response.json();
        dispatch(loadRestaurants(data));
};


const searchbarReducer = (state = {}, action) => {
    let newState = {}
    switch (action.type) {
        case GET_ALL_RESTAURANTS: 
        Object.values(action.searchbar).forEach(restaurant => newState[restaurant.id] = restaurant)
        return {...newState}
        default:
            return state;
    }
};

export default searchbarReducer;