export const removeError = () => {
  return dispatch => {
    dispatch({ type: 'REMOVE_ERROR', payload: {} });
  };
};

export const resetActiveRoom = () => {
  return dispatch => {
    dispatch({ type: 'RESET_ACTIVE_ROOM', payload: {} });
  };
};

export const createRoom = name => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'CREATING_ROOM', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('createRoom');
    func({ name })
      .then(res => {
        dispatch({
          type: 'JOIN_ROOM_SUCCESS',
          payload: {
            id: res.data,
          },
        });
      })
      .catch(err => {
        dispatch({ type: 'JOIN_ROOM_FAILURE', payload: err });
      });
  };
};

export const joinRoom = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'JOINING_ROOM', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('joinRoom');
    func({ roomId })
      .then(res => {
        dispatch({
          type: 'JOIN_ROOM_SUCCESS',
          payload: {
            id: res.data,
          },
        });
      })
      .catch(err => {
        dispatch({ type: 'JOIN_ROOM_FAILURE', payload: err });
      });
  };
};

export const addUseRole = role => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const state = getState();
    const selectedRoles = state.room.selectedRoles.concat();
    selectedRoles.push(role);
    selectedRoles.some((v, i) => {
      if (v == 'villager') {
        selectedRoles.splice(i, 1);
        return true;
      }
    });
    dispatch({ type: 'UPDATE_USE_ROLE_SUCCESS', payload: selectedRoles });
  };
};

export const removeUseRole = role => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedRoles = state.room.selectedRoles.concat();
    selectedRoles.push('villager');
    selectedRoles.some((v, i) => {
      if (v == role) {
        selectedRoles.splice(i, 1);
        return true;
      }
    });
    dispatch({ type: 'UPDATE_USE_ROLE_SUCCESS', payload: selectedRoles });
  };
};

export const adjustVillagerCount = () => {
  return (dispatch, getState) => {
    const state = getState();
    const joinUsers = state.room.joinUsers;
    const selectedRoles = state.room.selectedRoles.concat();
    const diff = Object.keys(joinUsers).length + 2 - selectedRoles.length;
    for (let i = 0; i < diff; i++) {
      selectedRoles.push('villager');
    }

    dispatch({ type: 'UPDATE_USE_ROLE_SUCCESS', payload: selectedRoles });
  };
};

export const fetchJoinUsers = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'FETCHING_JOIN_USERS', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    //参照？を取得
    const func = functions.httpsCallable('fetchJoinUsers');
    //引数を付けて呼び出し
    func({ roomId })
      .then(res => {
        dispatch({ type: 'FETCH_JOIN_USERS_SUCCESS', payload: res.data });
      })
      .catch(err => {
        dispatch({ type: 'FETCH_JOIN_USERS_FAILURE', payload: err });
      });
  };
};

export const listenJoinUsersUpdate = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirebase().firestore();
    console.log('listening join users change: ', roomId);
    firestore
      .collection('users')
      .where('joinRooms', 'array-contains', roomId)
      .onSnapshot(querySnapshot => {
        console.log('join new user');
        const joinUsers = {};
        querySnapshot.forEach(doc => {
          joinUsers[doc.id] = doc.data();
        });
        if (Object.keys(joinUsers).length > 0) {
          dispatch({
            type: 'FETCH_JOIN_USERS_SUCCESS',
            payload: joinUsers,
          });
        }
      });
  };
};

// TODO: functionsへ移行してuid判定
export const fetchRoomInfo = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection('rooms')
      .doc(roomId)
      .get()
      .then(doc => {
        dispatch({
          type: 'FETCH_ROOM_INFO_SUCCESS',
          payload: doc.data(),
        });
      })
      .catch(err => {
        dispatch({ type: 'FETCH_ROOM_INFO_FAILURE', payload: err });
      });
  };
};

export const startGame = (roomId, selectedRoles) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'STARTING_GAME', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('startGame');
    func({ roomId, selectedRoles })
      .then(res => {
        dispatch({
          type: 'START_GAME_SUCCESS',
          payload: {
            id: res.data,
          },
        });
      })
      .catch(err => {
        dispatch({ type: 'START_GAME_FAILURE', payload: err });
      });
  };
};

export const listenRoomUpdate = roomId => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const state = getState();
  const firestore = getFirebase().firestore();
  console.log('listening room state change: ', roomId);
  firestore
    .collection('rooms')
    .doc(roomId)
    .onSnapshot(doc => {
      console.log('room state is updated');
      if (doc.data() && doc.data().state !== state.room.state) {
        dispatch({
          type: 'UPDATE_ROOM_STATE',
          payload: { state: doc.data().state },
        });
      }
    });
};

export const fetchAssignedRoles = (roomId, selectUserId = null) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'EXECUTING_ACTION', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('fetchAssignedRoles');
    func({ roomId, selectUserId })
      .then(res => {
        dispatch({
          type: 'EXECUTE_ROLE_ACTION_SUCCESS',
          payload: res.data,
        });
      })
      .catch(err => {
        dispatch({ type: 'EXECUTE_ROLE_ACTION_FAILURE', payload: err });
      });
  };
};

export const finishRoleAction = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'FINISHING_ACTION', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('finishRoleAction');
    const state = getState();
    const uid = state.firebase.auth.uid;
    const actionData = state.room.actionDatas[uid];
    func({ roomId })
      .then(res => {
        dispatch({
          type: 'FINISH_ACTION_SUCCESS',
          payload: { [uid]: { ...actionData, ...res.data } },
        });
      })
      .catch(err => {
        dispatch({ type: 'FINISH_ACTION_FAILURE', payload: err });
      });
  };
};

export const finishDiscussion = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'FINISHING_DISCUSSION', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('finishDiscussion');
    func({ roomId })
      .then(res => {
        dispatch({
          type: 'FINISH_DISCUSSION_SUCCESS',
          payload: res.data,
        });
      })
      .catch(err => {
        dispatch({ type: 'FINISH_DISCUSSION_FAILURE', payload: err });
      });
  };
};

// ユーザーを処刑
export const executeUser = (roomId, selectUserId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'EXECUTING_USER', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('executeUser');
    const state = getState();
    const uid = state.firebase.auth.uid;
    const actionData = state.room.actionDatas[uid];
    func({ roomId, selectUserId })
      .then(res => {
        dispatch({
          type: 'FINISH_EXECUTE_USER_SUCCESS',
          payload: { [uid]: { ...actionData, ...res.data } },
        });
      })
      .catch(err => {
        dispatch({ type: 'FINISH_EXECUTE_USER_FAILURE', payload: err });
      });
  };
};

// ユーザーを処刑
export const fetchResult = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'FETCHING_RESULT', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('fetchResult');
    func({ roomId })
      .then(res => {
        dispatch({
          type: 'FINISH_FETCH_RESULT_SUCCESS',
          payload: res.data,
        });
      })
      .catch(err => {
        dispatch({ type: 'FINISH_FETCH_RESULT_FAILURE', payload: err });
      });
  };
};

// ゲームを初期化
export const resetGame = roomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({ type: 'RESETTING_GAME', payload: {} });
    const functions = getFirebase().app().functions('asia-northeast1');
    const func = functions.httpsCallable('resetGame');
    func({ roomId })
      .then(res => {
        dispatch({
          type: 'RESET_GAME_SUCCESS',
          payload: res.data,
        });
      })
      .catch(err => {
        dispatch({ type: 'RESET_GAME_FAILURE', payload: err });
      });
  };
};
