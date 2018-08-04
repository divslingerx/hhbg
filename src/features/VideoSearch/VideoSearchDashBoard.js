import React, { Component } from "react";
import { Container, Segment } from "semantic-ui-react";
import axios from "axios";
import KEYS from "../../KEYS";

//components
import VideoSearchBar from "./VideoSearchBar";
import VideoList from "./VideoList";
import { connect } from "react-redux";
import { setCurrentVideo } from "../../app/actions/videoPlayerActions";

class VideoSearchDashboard extends Component {
  state = {
    searchTerm: "",
    youtubeVideos: [],
    loading: false,
    nextPageToken: null,
    selectedVideo: null,
    lockedVideos: []
  };

  componentDidMount() {
    if (localStorage.youtubeVideos) {
      this.setState({
        youtubeVideos: JSON.parse(localStorage.youtubeVideos)
      });
    }
  }

  searchYoutube = async () => {
    const ROOT_URL = "https://www.googleapis.com/youtube/v3/search";

    const params = {
      key: KEYS.youtube,
      q: this.state.term,
      maxResults: 20,
      type: "video",
      videoEmbeddable: true,
      part: "snippet"
    };

    const searchResults = await axios.get(ROOT_URL, { params });
    const { items, nextPageToken } = searchResults.data;

    // const { items, nextPageToken } = searchResults.data;

    this.setState({
      ...this.state,
      youtubeVideos: items,
      nextPageToken
    });

    localStorage.setItem(
      "youtubeVideos",
      JSON.stringify(this.state.youtubeVideos)
    );
  };

  handleSearchInputChange = e => {
    this.setState({
      term: e.target.value
    });
  };

  handleSelectVideo = selectedVideo => () => {
    this.props.setCurrentVideo(selectedVideo);
  };

  render() {
    return (
      <div>
        <Container>
          <Segment>
            <VideoSearchBar
              onSearch={this.searchYoutube}
              onChange={this.handleSearchInputChange}
            />
            <VideoList
              videos={this.state.youtubeVideos}
              onSelectVideo={this.handleSelectVideo}
            />
          </Segment>
        </Container>
      </div>
    );
  }
}

const actions = {
  setCurrentVideo
};

export default connect(
  null,
  actions
)(VideoSearchDashboard);
