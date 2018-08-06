import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const VideoControlsWrapper = styled.div`
  display: flex;
`;

const VideoPlayerControls = props => {
  const { seek, player } = props;

  //current time is a a Number in seconds.

  return (
    <Fragment>
      <VideoControlsWrapper>
        <button onClick={() => seek(-15)}>{"<<"} 15</button>
        <button onClick={() => player.playVideo()}> Play </button>
        <button onClick={() => player.pauseVideo()}> Pause </button>
        <button onClick={() => seek(15)}>{">>"} 15</button>
      </VideoControlsWrapper>
    </Fragment>
  );
};

export default VideoPlayerControls;
