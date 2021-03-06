import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducers/rootReducer';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import {
  createFirestoreInstance,
  reduxFirestore,
  getFirestore,
} from 'redux-firestore';
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  isLoaded,
} from 'react-redux-firebase';
import firebaseConfig from './config/firebaseConfig';
import { Helmet } from 'react-helmet';

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
}

const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })];

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares), reduxFirestore(firebaseConfig))
);

const rrfProps = {
  firebase,
  config: firebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

const AuthIsLoaded = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth);
  if (!isLoaded(auth)) return <div></div>;
  return children;
};
ReactDOM.render(
  <React.StrictMode>
    <Helmet
      title="ワンナイト人狼オンライン"
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=no',
        },
        {
          name: 'description',
          content: 'ワンナイト人狼をオンラインで遊べるサイトです。',
        },
        {
          property: 'og:title',
          content: 'ワンナイト人狼オンライン',
        },
        {
          property: 'og:description',
          content: 'ワンナイト人狼をオンラインで遊べるサイトです。',
        },
        {
          property: 'og:image',
          content: `${process.env.PUBLIC_URL}/favicon.ico`,
        },
      ]}
    />
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
