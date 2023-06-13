import { csrfFetch } from './csrf';

const GET_ALL_RESTAURANTS = 'restaurants/getALLRestaurants';

 const loadRestaurants = (restaurants) => {
    return {
        type: GET_ALL_RESTAURANTS,
        restaurants
    }
};

export const getALLRestaurants = () => async dispatch => {
    const response = await fetch("/api/restaurants");
        const data = await response.json();
        dispatch(loadRestaurants(data));
};

const FIND_RESTAURANT = 'restaurants/getSingleRestaurant';

 const findRestaurant = (restaurant) => {
    return {
        type: FIND_RESTAURANT,
        restaurant
    };
};

export const getRestaurant = (restaurantid) => async dispatch => {
    const response = await fetch(`/api/restaurants/${restaurantid}`);
        const data = await response.json();
        dispatch(findRestaurant(data));
};

export const createRestaurant = (restaurantData) => async dispatch => {
    const { address, city, zip_code, description, open, close, name, phone, state, logo, food_type, lat, lng } = restaurantData;
    const response = await csrfFetch(`/api/restaurants`, {
        method: 'POST',
        body: JSON.stringify({ address, city, zip_code, description, open, close, name, phone, state, logo, food_type, lat, lng }),
    })
    if (response.ok) {
        const newRestaurant = await response.json();
        dispatch(findRestaurant(newRestaurant));
        return newRestaurant;
    }
};

const UPDATED_RESTAURANT = 'restaurant/updateRestaurant'
 const updatedRestaurant = (restaurant) => {
    return{
        type: UPDATED_RESTAURANT,
        restaurant
    }
}
export const editRestaurant = (restaurantData) => async dispatch => {
    const { address, city, zip_code, description, open, close, name, logo, state, phone, rating, food_type } = restaurantData;
console.log(restaurantData);
    const response = await csrfFetch(`/api/restaurants/${restaurantData.id}`, {
        method: 'PUT',
        body: JSON.stringify({ address, city, zip_code, description, open, close, name, logo, state, phone, rating, food_type })
    })
    const newRestaurant = await response.json()
    if (response.ok) {
        return dispatch(updatedRestaurant(newRestaurant))
    }
}
export const getUserRestaurants = (user) => async dispatch => {
    const response = await csrfFetch('/api/restaurants')
    const data = await response.json()

    let filterRestaurants = Object.values(data)
    const ownerRestaurants = filterRestaurants.filter(restaurant => restaurant.ownerId === user.user.id)

    let ownedRestaurantsObj = {}

    ownerRestaurants.map(restaurant => ownedRestaurantsObj[restaurant.id]=restaurant)
    return dispatch(getALLRestaurants(ownedRestaurantsObj))
}
const DELETED_RESTAURANT = 'restaurants/deleted_Restaurant'
const deletedRestaurant = (restaurant) => {
    return{
        type: DELETED_RESTAURANT,
        restaurant
    }
}
export const deleteRestaurant = (restaurant) => async dispatch => {
    const response = await csrfFetch(`/api/restaurants/${restaurant.id}`, {
        method:'DELETE'
    })
    const data = await response.json()
    if(response.ok){
        dispatch(deletedRestaurant(data))
    }
}
const initialState = {};
const restaurantsReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
      case GET_ALL_RESTAURANTS: 
        Object.values(action.restaurants).forEach(restaurant => newState[restaurant.id] = restaurant)
        return {...newState}
      case FIND_RESTAURANT:
      case UPDATED_RESTAURANT: {
        const restaurant = action.restaurant;
        return { ...state, [restaurant.id]: restaurant };
      }
      case DELETED_RESTAURANT: {
        const restaurantId = action.restaurant.id;
        const newState = { ...state };
        delete newState[restaurantId];
        return newState;
      }
      default:
        return state;
    }
  };

export default restaurantsReducer;