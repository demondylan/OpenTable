# [OpenTable]

## Database Schema Design

![db-schema]

[db-schema]: ./images/dbSchema.png

## API Documentation
## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required",
      "statusCode": 401
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden",
      "statusCode": 403
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: true
* Request
  * Method: GET
  * URL: /session
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /session
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
      }
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Invalid credentials",
      "statusCode": 401
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": [
        "Email or username is required",
        "Password is required"
      ]
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /users
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "token": ""
      }
    }
    ```

* Error response: User already exists with the specified email
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already exists",
      "statusCode": 403,
      "errors": [
        "User with that email already exists"
      ]
    }
    ```

* Error response: User already exists with the specified username
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already exists",
      "statusCode": 403,
      "errors": [
        "User with that username already exists"
      ]
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": [
        "Invalid email",
        "Username is required",
        "First Name is required",
        "Last Name is required"
      ]
    }
    ```

## RESTAURANTS

### Get all RESTAURANTS

Returns all the restaurants.

* Require Authentication: false
* Request
  * Method: GET
  * URL: /restaurants
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Restauraunts": [
        {
        "id": 1,
        "owner_id": 1,
        "name": "Khom Fa",
        "address": "48856 Romeo Plank R",
        "city": "Macom",
        "state": "Michiga",
        "zip_code": "48043",
        "open": "13:30",
        "close": "08:30",
        "phone": "44334",
        "food_type": "Thai",
        "description": "Located in the suburbs of Detroit, Michigan, Khom Fai is the creation of brothers Chef Isaiah Sonjeow and Chris Sonjeo",
        "logo": "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg",
        "rating": 4.7,
        "createdAt": "2023-06-11T05:35:29.000Z",
        "updatedAt": "2023-06-11T11:37:36.591Z",
        "Reviews": [
            {
                "id": 1,
                "user_id": 1,
                "restaurant_id": 1,
                "value_rating": 4,
                "food_rating": 3,
                "service_rating": 2,
                "ambience_rating": 3,
                "message": "they are alright",
                "createdAt": "2023-06-11T05:35:29.000Z",
                "updatedAt": "2023-06-11T05:35:29.000Z"
            },
            {
                "id": 6,
                "user_id": 3,
                "restaurant_id": 1,
                "value_rating": 5,
                "food_rating": 5,
                "service_rating": 5,
                "ambience_rating": 5,
                "message": "they are amazing",
                "createdAt": "2023-06-11T05:35:29.000Z",
                "updatedAt": "2023-06-11T05:35:29.000Z"
            }
        ]
    }
    
    ```

### Get all Restaurants owned by the Current User

Returns all the restaurants owned (created) by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * URL: /restauraunts/session
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
{
    "Restaurants": [
        {
            "id": 1,
            "owner_id": 1,
            "name": "Khom Fa",
            "address": "48856 Romeo Plank R",
            "city": "Macom",
            "state": "Michiga",
            "zip_code": "48043",
            "open": "13:30",
            "close": "08:30",
            "phone": "44334",
            "food_type": "Thai",
            "description": "Located in the suburbs of Detroit, Michigan, Khom Fai is the creation of brothers Chef Isaiah Sonjeow and Chris Sonjeo",
            "logo": "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg",
            "rating": 4.7,
            "createdAt": "2023-06-11T05:35:29.000Z",
            "updatedAt": "2023-06-11T11:37:36.591Z"
        }
    ]
}
    ```

### Get details of a restaurant from an id

Returns the details of a restaurant specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * URL: /restaurants/:restaurantid
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
 {
    "id": 1,
    "owner_id": 1,
    "name": "Khom Fa",
    "address": "48856 Romeo Plank R",
    "city": "Macom",
    "state": "Michiga",
    "zip_code": "48043",
    "open": "13:30",
    "close": "08:30",
    "phone": "44334",
    "food_type": "Thai",
    "description": "Located in the suburbs of Detroit, Michigan, Khom Fai is the creation of brothers Chef Isaiah Sonjeow and Chris Sonjeo",
    "logo": "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg",
    "rating": 4.7,
    "createdAt": "2023-06-11T05:35:29.000Z",
    "updatedAt": "2023-06-11T11:37:36.591Z",
    "Reviews": [
        {
            "id": 1,
            "user_id": 1,
            "restaurant_id": 1,
            "value_rating": 4,
            "food_rating": 3,
            "service_rating": 2,
            "ambience_rating": 3,
            "message": "they are alright",
            "createdAt": "2023-06-11T05:35:29.000Z",
            "updatedAt": "2023-06-11T05:35:29.000Z"
        },
        {
            "id": 6,
            "user_id": 3,
            "restaurant_id": 1,
            "value_rating": 5,
            "food_rating": 5,
            "service_rating": 5,
            "ambience_rating": 5,
            "message": "they are amazing",
            "createdAt": "2023-06-11T05:35:29.000Z",
            "updatedAt": "2023-06-11T05:35:29.000Z"
        }
    ],
    "User": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "username": "Demo-lition"
    }
}
    ```

* Error response: Couldn't find a Restaurant with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Restaurant couldn't be found",
      "statusCode": 404
    }
    ```

### Create a Restaurant

Creates and returns a new Restaurant.

* Require Authentication: true
* Request
  * Method: POST
  * URL: /restaurants
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
{
    "id": 4,
    "owner_id": 1,
    "address": "48900 Van Dyke Ave",
    "city": "Shelby Township",
    "zip_code": "48317",
    "description": "Steakhouse 22 in Shelby Township, formally Nick's Steakhouse is Macomb County and Metro Detroit's premier family steakhouse.",
    "open": "1:00",
    "close": "12:00",
    "name": "Nicks 22nd Street",
    "phone": "586-731-3900",
    "state": "Michigan",
    "logo": "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg",
    "food_type": "italian",
    "updatedAt": "2023-06-11T13:48:14.861Z",
    "createdAt": "2023-06-11T13:48:14.861Z"
}
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
 {
    "id": 4,
    "owner_id": 1,
    "address": "48900 Van Dyke Ave",
    "city": "Shelby Township",
    "zip_code": "48317",
    "description": "Steakhouse 22 in Shelby Township, formally Nick's Steakhouse is Macomb County and Metro Detroit's premier family steakhouse.",
    "open": "1:00",
    "close": "12:00",
    "name": "Nicks 22nd Street",
    "phone": "586-731-3900",
    "state": "Michigan",
    "logo": "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg",
    "food_type": "italian",
    "updatedAt": "2023-06-11T13:48:14.861Z",
    "createdAt": "2023-06-11T13:48:14.861Z"
}
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": [
        "Street address is required",
        "City is required",
        "State is required",
        "Zip Code is required",
        "Name must be less than 50 characters",
        "Description is required",
        "Price per day is required"
      ]
    }
    ```

### Edit a Restaurant

Updates and returns an existing restaurant.

* Require Authentication: true
* Require proper authorization: Restaurant must belong to the current user
* Request
  * Method: PUT
  * URL: /restaurants/:restaurantid
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
{
    "id": 4,
    "owner_id": 1,
    "name": "Nicks 22nd Street",
    "address": "48900 Van Dyke Ave",
    "city": "Shelby Township",
    "state": "Michigan",
    "zip_code": "48317",
    "open": "1:00",
    "close": "12:00",
    "phone": "586-731-3900",
    "food_type": "italian",
    "description": "Steakhouse 22 in Shelby Township, formally Nick's Steakhouse is Macomb County and Metro Detroit's premier family steakhouse.",
    "logo": "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg",
    "rating": null,
    "createdAt": "2023-06-11T13:48:14.861Z",
    "updatedAt": "2023-06-11T13:48:14.861Z"
}
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
{
    "id": 4,
    "owner_id": 1,
    "name": "Nicks 22nd Street",
    "address": "48900 Van Dyke Ave",
    "city": "Shelby Township",
    "state": "Michigan",
    "zip_code": "48317",
    "open": "1:00",
    "close": "12:00",
    "phone": "586-731-3900",
    "food_type": "italian",
    "description": "Steakhouse 22 in Shelby Township, formally Nick's Steakhouse is Macomb County and Metro Detroit's premier family steakhouse.",
    "logo": "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg",
    "rating": null,
    "createdAt": "2023-06-11T13:48:14.861Z",
    "updatedAt": "2023-06-11T13:48:14.861Z"
}
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": [
        "Street address is required",
        "City is required",
        "State is required",
        "Zip Code is required",
        "Name must be less than 50 characters",
        "Description is required",
        "Price per day is required"
      ]
    }
    ```

* Error response: Couldn't find a Restaurant with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Restaurant couldn't be found",
      "statusCode": 404
    }
    ```

### Delete a Review

Deletes an existing Restaurant.

* Require Authentication: true
* Require proper authorization: restaurant must belong to the current user
* Request
  * Method: DELETE
  * URL: /restaurants/:restaurantsid
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted",
      "statusCode": 200
    }
    ```

* Error response: Couldn't find a restaurant with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Restaurant couldn't be found",
      "statusCode": 404
    }
    ```

## REVIEWS

### Get all Reviews of the Current User

Returns all the reviews written by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * URL: /reviews/session
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
   "Review": [
        {
            "id": 1,
            "user_id": 1,
            "restaurant_id": 1,
            "value_rating": 4,
            "food_rating": 3,
            "service_rating": 2,
            "ambience_rating": 3,
            "message": "they are alright",
            "createdAt": "2023-06-12T13:18:33.000Z",
            "updatedAt": "2023-06-12T13:18:33.000Z",
            "User": {
                "id": 1,
                "firstName": "John",
                "lastName": "Smith"
            },
            "Restaurant": {
                "id": 1,
                "owner_id": 1,
                "address": "48856 Romeo Plank Rd",
                "city": "Macomb",
                "state": "Michigan",
                "zip_code": "48044",
                "open": "12:30",
                "close": "9:30",
                "name": "Khom Fai",
                "phone": "586-247-7773",
                "food_type": "Thai",
                "logo": "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg"
            }
        },
        {
            "id": 4,
            "user_id": 1,
            "restaurant_id": 2,
            "value_rating": 5,
            "food_rating": 5,
            "service_rating": 5,
            "ambience_rating": 5,
            "message": "they are good",
            "createdAt": "2023-06-12T13:18:33.000Z",
            "updatedAt": "2023-06-12T13:18:33.000Z",
            "User": {
                "id": 1,
                "firstName": "John",
                "lastName": "Smith"
            },
            "Restaurant": {
                "id": 2,
                "owner_id": 2,
                "address": "48900 Van Dyke Ave",
                "city": "Shelby Township",
                "state": "Michigan",
                "zip_code": "48317",
                "open": "1:00",
                "close": "12:00",
                "name": "Nicks 22nd Street",
                "phone": "586-731-3900",
                "food_type": "italian",
                "logo": "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg"
            }
        }
    ]
    }
    ```

### Get all Reviews by a Restaurant's id

Returns all the reviews that belong to a restaurant specified by id.

* Require Authentication: false
* Request
  * Method: GET
  * URL: /restaurants/:restaurantsid/reviews
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
 [
    {
        "id": 1,
        "user_id": 1,
        "restaurant_id": 1,
        "value_rating": 4,
        "food_rating": 3,
        "service_rating": 2,
        "ambience_rating": 3,
        "message": "they are alright",
        "createdAt": "2023-06-12T13:18:33.000Z",
        "updatedAt": "2023-06-12T13:18:33.000Z",
        "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
        }
    },
    {
        "id": 6,
        "user_id": 3,
        "restaurant_id": 1,
        "value_rating": 5,
        "food_rating": 5,
        "service_rating": 5,
        "ambience_rating": 5,
        "message": "they are amazing",
        "createdAt": "2023-06-12T13:18:33.000Z",
        "updatedAt": "2023-06-12T13:18:33.000Z",
        "User": {
            "id": 3,
            "firstName": "Walker",
            "lastName": "Simpson"
        }
    }
]
    }
    ```

* Error response: Couldn't find a Restaurant with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Restaurant couldn't be found",
      "statusCode": 404
    }
    ```

### Create a Review for a Restauraunt based on the Restaurant's id

Create and return a new review for a Restaurant specified by id.

* Require Authentication: true
* Request
  * Method: POST
  * URL: /restaurants/:restaurantid/reviews
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
  {
        "user_id": 1,
        "restaurant_id": 3,
        "value_rating": 5,
        "food_rating": 5,
        "service_rating": 5,
        "ambience_rating": 5,
        "message": "they are excellent"
}
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
{
    "id": 7,
    "user_id": 1,
    "restaurant_id": 3,
    "message": "they are excellent",
    "value_rating": 5,
    "food_rating": 5,
    "ambience_rating": 5,
    "service_rating": 5,
    "updatedAt": "2023-06-12T19:46:24.716Z",
    "createdAt": "2023-06-12T19:46:24.716Z"
}
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": [
        "Message text is required",
        "value_rating must be an integer from 1 to 5",
        "food_rating must be an integer from 1 to 5",
        "service_rating must be an integer from 1 to 5",
        "ambience_rating must be an integer from 1 to 5",
      ]
    }
    ```

* Error response: Couldn't find a Restaurant with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Restaurant couldn't be found",
      "statusCode": 404
    }
    ```

* Error response: Review from the current user already exists for the Restaurant
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already has a review for this Restaurant",
      "statusCode": 403
    }
    ```

### Edit a Review

Update and return an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: PUT
  * URL: /reviews/:reviewsid
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "user_id": 1,
        "restaurant_id": 3,
        "value_rating": 5,
        "food_rating": 5,
        "service_rating": 5,
        "ambience_rating": 5,
        "message": "they are excellent"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "id": 7,
    "user_id": 1,
    "restaurant_id": 3,
    "message": "they are excellent",
    "value_rating": 5,
    "food_rating": 5,
    "ambience_rating": 5,
    "service_rating": 5,
    "updatedAt": "2023-06-12T19:46:24.716Z",
    "createdAt": "2023-06-12T19:46:24.716Z"
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": [
        "Message text is required",
        "value_rating must be an integer from 1 to 5",
        "food_rating must be an integer from 1 to 5",
        "service_rating must be an integer from 1 to 5",
        "ambience_rating must be an integer from 1 to 5",
      ]
    }
    ```

* Error response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found",
      "statusCode": 404
    }
    ```

### Delete a Review

Delete an existing review.

* Require Authentication: true
* Require proper authorization: Review must belong to the current user
* Request
  * Method: DELETE
  * URL: /reviews/:reviewsid
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted",
      "statusCode": 200
    }
    ```

* Error response: Couldn't find a Review with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Review couldn't be found",
      "statusCode": 404
    }
    ```


## Add Query Filters to Get All Restaurant

Return Restaurants filtered by query parameters.

* Require Authentication: false
* Request
  * Method: GET
  * URL: restaurants/ /*  ?attributesfilter  */
  * Query Parameters
    * page: integer, minimum: 0, maximum: 10, default: 0
    * size: integer, minimum: 0, maximum: 20, default: 20
    * minLat: decimal, optional
    * maxLat: decimal, optional
    * minLng: decimal, optional
    * maxLng: decimal, optional
    * minPrice: decimal, optional, minimum: 0
    * maxPrice: decimal, optional, minimum: 0
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
            "Restauraunts": [
        {
        "id": 1,
        "owner_id": 1,
        "name": "Khom Fa",
        "address": "48856 Romeo Plank R",
        "city": "Macom",
        "state": "Michiga",
        "zip_code": "48043",
        "open": "13:30",
        "close": "08:30",
        "phone": "44334",
        "food_type": "Thai",
        "description": "Located in the suburbs of Detroit, Michigan, Khom Fai is the creation of brothers Chef Isaiah Sonjeow and Chris Sonjeo",
        "logo": "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg",
        "rating": 4.7,
        "createdAt": "2023-06-11T05:35:29.000Z",
        "updatedAt": "2023-06-11T11:37:36.591Z",
        "Reviews": [
            {
                "id": 1,
                "user_id": 1,
                "restaurant_id": 1,
                "value_rating": 4,
                "food_rating": 3,
                "service_rating": 2,
                "ambience_rating": 3,
                "message": "they are alright",
                "createdAt": "2023-06-11T05:35:29.000Z",
                "updatedAt": "2023-06-11T05:35:29.000Z"
            },
            {
                "id": 6,
                "user_id": 3,
                "restaurant_id": 1,
                "value_rating": 5,
                "food_rating": 5,
                "service_rating": 5,
                "ambience_rating": 5,
                "message": "they are amazing",
                "createdAt": "2023-06-11T05:35:29.000Z",
                "updatedAt": "2023-06-11T05:35:29.000Z"
            }
        ],
      "page": 2,
      "size": 25
    }
    ```

* Error Response: Query parameter validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": [
        "Page must be greater than or equal to 0",
        "Size must be greater than or equal to 0",
      ]
    }
    ```