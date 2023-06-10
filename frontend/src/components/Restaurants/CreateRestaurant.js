import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRestaurant, getRestaurant } from "../../store/restaurants";
import './Restaurants.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const CreateRestaurant = ({ formType }) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZip_code] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState("");
  const [food_type, setFood_type] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const restaurant = { address, city, zip_code, description, open, close, name, phone, state, logo, food_type};
    let newRestaurant = await dispatch(createRestaurant(restaurant))
    if (newRestaurant) {
      let restaurantId = newRestaurant.id
      history.push(`/restaurants/${restaurantId}`);
    //  dispatch(getRestaurant(restaurantId))
    }
  };

  return (
    <div className='form'>
      <section>
        <form onSubmit={handleSubmit} >

          <label>
            Street Address
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </label>
          <br />
          <label>
            City
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </label>
          <br />
          <label>
            State
            <input
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </label>
          <br />
          <label>
            Zip Code
            <input
              type="text"
              placeholder="Zip Code"
              required
              value={zip_code}
              onChange={e => setZip_code(e.target.value)}
            />

          </label>
          <br />
          <label>
            Opens
            <TimePicker
              required
              onChange={setOpen}
              value={open}
            />
          </label>
          <br />
          <label>
            Closes
            <TimePicker
              required
              onChange={setClose}
              value={close}
            />
          </label>
          <br />
          <label>
            Describe your place to guests
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label>
            Restaurant Name
            <input
              type="text"
              placeholder="Name of your Restaurant"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
           Phone number
            <input
              type="number"
              placeholder="Phone Number"
              required
              value={phone || ''}
              onChange={e => setPhone(e.target.value)}
            />
          </label>
          <br />
          <label>
            Logo
            <br></br>
            <input
              type="text"
              placeholder="Logo"
              required
              value={logo}
              onChange={e => setLogo(e.target.value)}
            />
          </label>
          <br />
          <label>
            Food Type  <input
              type="text"
              placeholder="Food Type"
              value={food_type}
              onChange={e => setFood_type(e.target.value)}
            />
          </label>
          <br></br>
          <div className='createbutton'><button type="submit">Create new Restaurant</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateRestaurant;