const initState = {
  id: '',
  name: '',
  state: -1,
  selectedRoles: [],
  joinUsers: {},
  actionDatas: {},
  createdBy: '',
  createdAt: '',
  roles: {
    werewolf: { nameJp: '人狼', team: 'werewolf', min: 1, max: 999 },
    'fortune-teller': { nameJp: '占い師', team: 'human', min: 0, max: 999 },
    'phantom-thief': { nameJp: '怪盗', team: 'human', min: 0, max: 1 },
    villager: { nameJp: '村人', team: 'human', min: 0, max: 999 },
  },
  creating: false,
  joining: false,
  fetchingUsers: false,
  starting: false,
  actionState: 'standby',
  finishingAction: false,
  loading: false,
};

const roomReducer = (state = initState, action) => {
  switch (action.type) {
    case 'RESET_ACTIVE_ROOM':
      console.log('reset active room', action.payload);
      return {
        ...state,
        id: '',
      };
    case 'CREATING_ROOM':
      console.log('creating room', action.payload);
      return {
        ...state,
        creating: true,
      };
    case 'JOINING_ROOM':
      console.log('joining room', action.payload);
      return {
        ...state,
        joining: true,
      };
    case 'JOIN_ROOM_SUCCESS':
      console.log('join room', action.payload);
      return {
        ...state,
        ...action.payload,
        creating: false,
        joining: false,
      };
    case 'JOIN_ROOM_FAILURE':
      console.log('join room error', action.payload);
      return {
        ...state,
        creating: false,
        joining: false,
      };
    case 'UPDATE_USE_ROLE_SUCCESS':
      return {
        ...state,
        selectedRoles: action.payload,
      };
    case 'FETCHING_JOIN_USERS':
      console.log('creating room', action.payload);
      return {
        ...state,
        fetchingUsers: true,
      };
    case 'FETCH_JOIN_USERS_SUCCESS':
      return {
        ...state,
        joinUsers: action.payload,
        fetchingUsers: false,
      };
    case 'FETCH_JOIN_USERS_FAILURE':
      return {
        ...state,
        fetchingUsers: false,
      };
    case 'FETCH_ROOM_INFO_SUCCESS':
      console.log('fetch room success', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    case 'FETCH_ROOM_INFO_FAILURE':
      return state;
    case 'STARTING_GAME':
      console.log('starting game', action.payload);
      return {
        ...state,
        starting: true,
      };
    case 'UPDATE_ROOM_STATE':
      console.log('update room state', action.payload);
      return {
        ...state,
        ...action.payload,
        starting: false,
      };
    case 'FETCH_AUTH_USER_ROLE_SUCCESS':
      return {
        ...state,
        actionDatas: { ...state.actionDatas, ...action.payload },
      };
    case 'FETCH_AUTH_USER_ROLE_FAILURE':
      return {
        ...state,
      };
    case 'EXECUTING_ACTION':
      return {
        ...state,
        actionState: 'executing',
      };
    case 'EXECUTE_ROLE_ACTION_SUCCESS':
      return {
        ...state,
        actionDatas: action.payload,
        actionState: 'executed',
      };
    case 'EXECUTE_ROLE_ACTION_FAILURE':
      return {
        ...state,
        actionState: 'executed',
      };
    case 'FINISHING_ACTION':
      return {
        ...state,
        actionState: 'finishing',
      };
    case 'FINISH_ACTION_SUCCESS':
      return {
        ...state,
        actionDatas: { ...state.actionDatas, ...action.payload },
        actionState: 'finished',
      };
    case 'FINISH_ACTION_FAILURE':
      return {
        ...state,
        actionState: 'finished',
      };
    default:
      return state;
  }
};

export default roomReducer;
