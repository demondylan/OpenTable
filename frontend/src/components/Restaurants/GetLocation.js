import React, { Component } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './Restaurants.css';

const GetLocation = () => {

    const [latitude, setlatitude] = useState("");
    const [longitude, setlongitude] = useState("");
    const [reslatitude, setReslatitude] = useState("");
    const [reslongitude, setReslongitude] = useState("");
    let restaurants = useSelector((state) => state.restaurants)
    restaurants = Object.values(restaurants)

async function position() {
    await navigator.geolocation.getCurrentPosition(
      position => { setlatitude(position.coords.latitude)
      setlongitude(position.coords.longitude)
      }
    );
    console.log(latitude, longitude);
  }
 
  function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="M") { dist = dist * 0.8684 }
    return dist
}
function getCoordinates(address){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key='+'AIzaSyC5C0oGe2ocK8EuDGIljCwsiXrWJ48gPWw')
      .then(response => response.json())
      .then(data => {
        setReslatitude(data.results.geometry.location.lat)
      setReslongitude(data.results.geometry.location.lng)
      })
  }
    return (
      <div>
        <button onClick={position} className='getLoc'>Get My Location</button>
      </div>
    );
  }


export default GetLocation;