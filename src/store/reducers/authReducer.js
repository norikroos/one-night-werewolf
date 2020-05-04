const initState = {
  authError: null,
  loading: false,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOADING':
      console.log('loading');
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_FAILURE':
      console.log('login error');
      return {
        ...state,
        authError: 'Login failed',
        loading: false,
      };
    case 'LOGIN_SUCCESS':
      console.log('login success');
      return {
        ...state,
        authError: null,
        loading: false,
      };
    case 'SIGNOUT_FAILURE':
      console.log('signout error');
      return state;
    case 'SIGNOUT_SUCCESS':
      console.log('signout success');
      return state;
    case 'SIGNUP_FAILURE':
      console.log('signup error');
      return {
        ...state,
        authError: action.payload.message,
        loading: false,
      };
    case 'SIGNUP_SUCCESS':
      console.log('signup success');
      return {
        ...state,
        authError: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
