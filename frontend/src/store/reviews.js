import { csrfFetch } from "./csrf";

const GET_ALL_REVIEWS = 'restaurants/getReviews'

const getReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews
    }
}

export const getAllReviews = (restaurantId) => async dispatch => {
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`)
    const data = await response.json()
    dispatch(getReviews(data))
}

const ADD_REVIEW = 'restaurants/addReviews'

const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const newReview = (reviewData) => async dispatch => {
    let { restaurantid, value_rating, food_rating, service_rating, ambience_rating, message } = reviewData
    console.log(reviewData)
    restaurantid = Number(restaurantid.reviewId)
    
    const response = await csrfFetch(`/api/restaurants/${restaurantid}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ value_rating, food_rating, service_rating, ambience_rating, message })
    })
    const data = await response.json()
    dispatch(addReview(data))

}

const DELETED_REVIEW = 'restaurants/deleteReview'

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
        dispatch(deletedReview(data))
    }
}


const reviewReducer = (state = {}, action) => {
    let newState = {}
    switch (action.type) {
        case GET_ALL_REVIEWS:
            newState = { ...state }
            Object.values(action.reviews).forEach(review => newState[review.id] = review)
            return { ...newState }
        case ADD_REVIEW:
            newState = { ...state }
            newState[action.review.id] = action.review
            return newState
        case DELETED_REVIEW:
            newState = { ...state }
            delete newState[action.reviewId.id]
            return newState
        default:
            return state
    }
}

export default reviewReducer;
