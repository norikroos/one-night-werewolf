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
    'fortune-teller': { nameJp: '占い師', team: 'villager', min: 0, max: 999 },
    'phantom-thief': { nameJp: '怪盗', team: 'villager', min: 0, max: 1 },
    villager: { nameJp: '村人', team: 'villager', min: 0, max: 999 },
    'hanged-man': { nameJp: '吊人', team: 'hanged-man', min: 0, max: 1 },
    'mad-man': { nameJp: '狂人', team: 'werewolf', min: 0, max: 999 },
  },
  creating: false,
  joining: false,
  fetchingUsers: false,
  starting: false,
  actionState: 'standby',
  finishingAction: false,
  loading: false,
  resetting: false,
  errorMessage: '',
};

const roomReducer = (state = initState, action) => {
  switch (action.type) {
    case 'REMOVE_ERROR':
      return {
        ...state,
        errorMessage: '',
      };
    case 'RESET_ACTIVE_ROOM':
      console.log('reset active room');
      return {
        ...state,
        id: '',
      };
    case 'CREATING_ROOM':
      console.log('creating room');
      return {
        ...state,
        creating: true,
      };
    case 'JOINING_ROOM':
      console.log('joining room');
      return {
        ...state,
        joining: true,
      };
    case 'JOIN_ROOM_SUCCESS':
      console.log('join room');
      return {
        ...state,
        ...action.payload,
        creating: false,
        joining: false,
      };
    case 'JOIN_ROOM_FAILURE':
      console.log('join room error');
      return {
        ...state,
        creating: false,
        joining: false,
        errorMessage: action.payload.message,
      };
    case 'UPDATE_USE_ROLE_SUCCESS':
      return {
        ...state,
        selectedRoles: action.payload,
      };
    case 'FETCHING_JOIN_USERS':
      console.log('creating room');
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
      console.log('fetch room success');
      return {
        ...state,
        ...action.payload,
      };
    case 'FETCH_ROOM_INFO_FAILURE':
      return state;
    case 'STARTING_GAME':
      console.log('starting game');
      return {
        ...state,
        actionDatas: {},
        starting: true,
      };
    case 'UPDATE_ROOM_STATE':
      console.log('update room state');
      return {
        ...state,
        ...action.payload,
        starting: false,
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
    case 'FINISHING_DISCUSSION':
      return {
        ...state,
        loading: true,
      };
    case 'FINISH_DISCUSSION_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'FINISH_DISCUSSION_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'EXECUTING_USER':
      return {
        ...state,
        loading: true,
      };
    case 'FINISH_EXECUTE_USER_SUCCESS':
      return {
        ...state,
        actionDatas: { ...state.actionDatas, ...action.payload },
        loading: false,
      };
    case 'FINISH_EXECUTE_USER_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'FETCHING_RESULT':
      return {
        ...state,
        loading: true,
      };
    case 'FINISH_FETCH_RESULT_SUCCESS':
      return {
        ...state,
        actionDatas: action.payload,
        loading: false,
      };
    case 'FINISH_FETCH_RESULT_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'RESETTING_GAME':
      return {
        ...state,
        resetting: true,
      };
    case 'RESET_GAME_SUCCESS':
      return {
        ...state,
        resetting: false,
      };
    case 'RESET_GAME_FAILURE':
      return {
        ...state,
        resetting: false,
      };
    default:
      return state;
  }
};

export default roomReducer;
