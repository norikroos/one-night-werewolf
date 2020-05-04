export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch({ type: 'LOADING', payload: {} });
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(res => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: res });
      })
      .catch(err => {
        dispatch({ type: 'LOGIN_FAILURE', payload: err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(res => {
        dispatch({ type: 'SIGNOUT_SUCCESS', payload: res });
      })
      .catch(err => {
        dispatch({ type: 'SIGNOUT_FAILURE', payload: err });
      });
  };
};

export const signUp = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'LOADING', payload: {} });
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(res => {
        console.log(res);
        return firestore.collection('users').doc(res.user.uid).set({
          name: newUser.name,
        });
      })
      .then(res => {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: res });
      })
      .catch(err => {
        dispatch({ type: 'SIGNUP_FAILURE', payload: err });
      });
  };
};
