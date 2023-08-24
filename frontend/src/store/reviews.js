import { csrfFetch } from "./csrf";

const SET_LATEST_REVIEWS = 'reviews/setLatestReviews';

const setLatestReviews = (reviews) => {
  return {
    type: SET_LATEST_REVIEWS,
    reviews
  };
};

export const setLatestReviewsData = (reviews) => async (dispatch) => {
  // You can sort the reviews here based on the creation date to get the latest ones.
  // Assuming the reviews have a 'createdAt' property representing the creation date.
  const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latestReviews = sortedReviews.slice(0, 4); // Get the latest 4 reviews.
  return dispatch(setLatestReviews(latestReviews));
};

const GET_ALL_REVIEWS = 'reviews/getReviews'

const getReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews
    }
}

export const getAllReviews = (restaurantId) => async dispatch => {
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`)
    const data = await response.json()
    if (response.ok) {
        return dispatch(getReviews(data))
    }
}

const ADD_REVIEW = 'reviews/addReviews'

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const newReview = (reviewData) => async (dispatch) => {
  let { restaurantId, value_rating, food_rating, service_rating, ambience_rating, message } = reviewData;
  console.log(restaurantId);
  const reviewId = Number(restaurantId);

  const response = await csrfFetch(`/api/restaurants/${reviewId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ value_rating, food_rating, service_rating, ambience_rating, message }),
  });
  const data = await response.json();
  if (response.ok) {
    return dispatch(addReview(data));
  }
};
const DELETED_REVIEW = 'reviews/deleteReview'

const deletedReview = (reviewId) => {
    return {
        type: DELETED_REVIEW,
        reviewId

    }
}

export const deleteReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    const data = await response.json()
    if (response.ok) {
        return dispatch(deletedReview(data))
    }
}
const UPDATED_REVIEW = 'reviews/updateReview'
 const updatedReview = (review) => {
    return{
        type: UPDATED_REVIEW,
        review
    }
}
export const editReview = (reviewData) => async dispatch => {
    const { restaurantid, value_rating, food_rating, service_rating, ambience_rating, message } = reviewData;
    console.log(reviewData);
    const response = await csrfFetch(`/api/reviews/${reviewData.restaurantid.reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ value_rating, food_rating, service_rating, ambience_rating, message })
    })
    const newReview = await response.json()
    if (response.ok) {
        return dispatch(updatedReview(newReview))
    }
}
const initialState = {
    latestReviews: []
  };
const reviewReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case SET_LATEST_REVIEWS: {
            newState = { ...state, latestReviews: action.reviews };
            return newState;
          }
        case GET_ALL_REVIEWS: {
            newState = { ...state }
            action.reviews.forEach((review) => {
                newState[review.id] = review;
            });
            }
            return newState;
        case ADD_REVIEW: {
            const newState = { ...state };
            return { ...newState, [action.review.id]: action.review };
        }
            case UPDATED_REVIEW: {
            const newState = { ...state}
            return {...newState, [action.review.id]: action.review}
            }
        case DELETED_REVIEW: {
            const newState = { ...state };
            delete newState[action.reviewId.id];
            return newState;
          }
        default:
            return state
    }
}

export default reviewReducer;
