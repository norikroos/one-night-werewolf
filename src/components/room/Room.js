import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  fetchRoomInfo,
  listenRoomUpdate,
  fetchJoinUsers,
  resetGame,
  removeError,
} from '../../store/actions/roomActions';
import LoadingBox from '../common/LoadingBox';
import { Redirect } from 'react-router-dom';

import Setting from './Setting';
import RoleAction from './RoleAction';
import Discussion from './Discussion';
import Vote from './Vote';
import Result from './Result';

const Room = props => {
  const {
    uid,
    roomState,
    joinUsers,
    fetchRoomInfo,
    listenRoomUpdate,
    fetchJoinUsers,
    errorMessage,
    removeError,
  } = props;
  const roomId = props.match.params.id;

  useEffect(() => {
    fetchRoomInfo(roomId);
    listenRoomUpdate(roomId);
  }, [roomState]);

  useEffect(() => {
    fetchJoinUsers(roomId);
  }, [Object.keys(joinUsers).join(',')]);

  if (joinUsers[uid]) {
    // if (!joinUsers[uid]) {
    //   return <Redirect to="/" />;
    // }
    if (roomState === 0) {
      return <Setting roomId={roomId} {...props} />;
    }
    if (roomState === 1) {
      return <RoleAction roomId={roomId} {...props} />;
    }
    if (roomState === 2) {
      return <Discussion roomId={roomId} {...props} />;
    }
    if (roomState === 3) {
      return <Vote roomId={roomId} {...props} />;
    }
    if (roomState === 4) {
      return <Result roomId={roomId} {...props} />;
    }
  }
  if (errorMessage) {
    removeError();
    return <Redirect to={`/?redirectFrom=${document.location.pathname}`} />;
  }
  return <LoadingBox />;
};

const mapStateToProps = state => {
  return {
    uid: state.firebase.auth.uid,
    roomState: state.room.state,
    createdBy: state.room.createdBy,
    selectedRoles: state.room.selectedRoles,
    joinUsers: state.room.joinUsers,
    roles: state.room.roles,
    loading: state.room.loading,
    resetting: state.room.resetting,
    errorMessage: state.room.errorMessage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRoomInfo: roomId => dispatch(fetchRoomInfo(roomId)),
    listenRoomUpdate: roomId => dispatch(listenRoomUpdate(roomId)),
    fetchJoinUsers: roomId => dispatch(fetchJoinUsers(roomId)),
    resetGame: roomId => dispatch(resetGame(roomId)),
    removeError: () => dispatch(removeError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
