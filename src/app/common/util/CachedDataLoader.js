import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrentVideo } from "../../../features/VideoPlayer/VideoPlayerActions";

class CachedDataLoader extends Component {
  constructor(props) {
    super(props);
    this.loadCachedData("currentVideo", this.props.setCurrentVideo);
  }
  // componentDidMount() {
  //   this.loadCachedData("currentVideo", this.props.setCurrentVideo);
  // }

  loadCachedData = (localName, Fn) => {
    new Promise((resolve, reject) => {
      if (localStorage[localName] !== undefined) {
        const value = JSON.parse(localStorage.getItem(localName));
        Fn(value);
      }
    });
  };

  render() {
    return null;
  }
}

const mapState = state => ({
  currentVideo: state.currentVideo
});

const actions = {
  setCurrentVideo
};

export default connect(
  mapState,
  actions
)(CachedDataLoader);