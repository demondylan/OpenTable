import * as restaurantActions from "./store/restaurants";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login/LoginForm";
import Signup from "./components/Signup/SignupForm";
import Home from "./components/Restaurants/Home"
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import FindRestaurant from "./components/Restaurants/FindRestaurant";
import CreateRestaurant from "./components/Restaurants/CreateRestaurant";
import EditRestaurant from "./components/Restaurants/EditRestaurant";
import CurrentUserRestaurants from "./components/Restaurants/CurrentUserRestaurants";
import SearchBar from './components/SearchBar/SearchBar'
import GetLocation from './components/Restaurants/GetLocation'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(dispatch(restaurantActions.getALLRestaurants())).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <SearchBar/>
      <GetLocation/>
      {isLoaded && (
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path ='/restaurants/current'>
            <CurrentUserRestaurants />
          </Route>
          <Route exact path="/restaurants/create">
            <CreateRestaurant/>
          </Route>
          <Route exact path='/restaurants/:restaurantId/edit'>
          <EditRestaurant/>
        </Route>
          <Route exact path="/restaurants/:restaurantId">
            <FindRestaurant />
          </Route>
          <Route exact path="/restaurants"> 
            <Home />
          </Route> 
          <Route exact path="/"> 
            <Home />
          </Route> 


        </Switch>
      )}
    </>
  );
}

export default App;
