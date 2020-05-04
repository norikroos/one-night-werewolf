import authReducer from './authReducer';
import roomReducer from './roomReducer';
import userReducer from './userReducer';

import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
  auth: authReducer,
  room: roomReducer,
  user: userReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;
