import * as sessionActions from './store/session';
import * as restaurantActions from "./store/restaurants"
import * as reviewActions from "./store/reviews"
import * as searchbarActions from "./store/searchbar"
import * as reservationActions from './store/reservations';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { ModalProvider } from './Context/Modal';
import { Modal } from './Context/Modal';
import './index.css';

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.restaurantActions = restaurantActions;
  window.reviewActions = reviewActions;
  window.searchbarActions = searchbarActions;
  window.reservationActions = reservationActions;
}

function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Modal />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);