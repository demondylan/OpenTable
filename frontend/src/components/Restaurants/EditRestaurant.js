import * as restaurantActions from "../../store/restaurants";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './Restaurants.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const EditRestaurant = ({ formType }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { restaurantId } = useParams()
    const oldRestaurant = useSelector((state) => state.restaurants[restaurantId])
    const [address, setAddress] = useState(oldRestaurant.address);
    const [city, setCity] = useState(oldRestaurant.city);
    const [state, setState] = useState(oldRestaurant.state);
    const [zip_code, setZip_code] = useState(oldRestaurant.zip_code);
    const [open, setOpen] = useState(oldRestaurant.open);
    const [close, setClose] = useState(oldRestaurant.close);
    const [name, setName] = useState(oldRestaurant.name);
    const [description, setDescription] = useState(oldRestaurant.description);
    const [phone, setPhone] = useState(oldRestaurant.phone)
    const [food_type, setFood_type] = useState(oldRestaurant.food_type);
    const [logo, setLogo] = useState(oldRestaurant.logo)



    const updateOpen = (e) => setOpen(e.target.value);
    const updateClose = (e) => setClose(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateZip_code = (e) => setZip_code(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePhone = (e) => setPhone(e.target.value);
    const updateFood_type = (e) => setFood_type(e.target.value);
    const updateLogo = (e) => setLogo(e.target.value);

    useEffect(() => {}, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRestaurant = {
            ...oldRestaurant,
            address,
            city,
            state,
            zip_code,
            open,
            close,
            name,
            description,
            phone,
            food_type,
            logo
        };

        let updatedRestaurant = await dispatch(restaurantActions.editRestaurant(newRestaurant))
        let restaurantId = updatedRestaurant.restaurant.id
        if (updatedRestaurant) {
            history.push(`/restaurants/${restaurantId}`)
            dispatch(restaurantActions.getRestaurant(restaurantId))
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        history.push(`/restaurants/current`)
    };

    return (
            <form onSubmit={handleSubmit}>
                <div className="form">
                Street Address<input
                    type="text"
                    placeholder="Street address"
                    required
                    value={address}
                    onChange={updateAddress} />
                City<input
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={updateCity} />
                Zip Code<input
                    type="text"
                    placeholder="Zip Code"
                    value={zip_code} 
                    onChange={updateZip_code} />
                State<input
                    type="text"
                    placeholder="State"
                    required
                    value={state}
                    onChange={updateState} />
            Opens
            <TimePicker
              required
              onChange={setOpen}
              value={open}
            />
            Closes
            <TimePicker
              required
              onChange={setClose}
              value={close}
            />
                Describe your place to guests<input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={updateDescription} />
                Create a Title<input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={updateName} />
                Phone<input
                    type="number"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={updatePhone} />
                     Logo<input
                    type="text"
                    placeholder="Logo"
                    value={logo}
                    onChange={updateLogo} />
                    Food Type<input
                    type="text"
                    placeholder="Food Type"
                    value={food_type}
                    onChange={updateFood_type} />
                <button type="submit">Update</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
                </div>
            </form>

    );
};

export default EditRestaurant;