import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import {
  fetchRoomInfo,
  listenRoomUpdate,
  fetchJoinUsers,
} from '../../store/actions/roomActions';
import LoadingBox from '../common/LoadingBox';
import { Redirect } from 'react-router-dom';

const Room = props => {
  const {
    uid,
    roomState,
    joinUsers,
    fetchRoomInfo,
    listenRoomUpdate,
    fetchJoinUsers,
  } = props;
  const roomId = props.match.params.id;

  useEffect(() => {
    fetchRoomInfo(roomId);
    listenRoomUpdate(roomId);
    console.log('render');
  }, [roomState]);

  useEffect(() => {
    fetchJoinUsers(roomId);
  }, [Object.keys(joinUsers).join(',')]);

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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRoomInfo: roomId => dispatch(fetchRoomInfo(roomId)),
    listenRoomUpdate: roomId => dispatch(listenRoomUpdate(roomId)),
    fetchJoinUsers: roomId => dispatch(fetchJoinUsers(roomId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
