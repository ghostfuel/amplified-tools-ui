import { Component } from 'react';
import { Col, Row } from "react-bootstrap";
import Gallery from '../../components/Gallery/Gallery';
import Toolbar from '../../components/Toolbar/Toolbar';
import { spotify } from '../../utils/spotifyApi';
import './Profile.css';

class Profile extends Component {

  // TODO: Actually type this
  state: {
    user?: any,
    topTracks?: any,
    topArtists?: any,
    playlists?: any
    rangeRadio: string,
  } = {
      rangeRadio: "weeks",
    }

  async componentDidMount() {
    let params = {
      limit: 6,
      time_range: "short_term"
    };

    try {
      // Get current users profile
      const { data: user } = await spotify.get(`/me`);
      if (user) this.setState({ user });
      // Get top played tracks
      const { data: topTracks } = await spotify.get('/me/top/tracks', { params });
      if (topTracks) this.setState({ topTracks });
      // Get top played artists
      const { data: topArtists } = await spotify.get('/me/top/artists', { params });
      if (topArtists) this.setState({ topArtists });
      // Get current users playlists
      const { data: playlists } = await spotify.get('/me/playlists', { params: { ...params, limit: 18 } });
      if (playlists) this.setState({ playlists });
    } catch (err) {
      console.error(err);
    }
  }

  render() {

    const topPlayedTracks = (
      <Row id="profile-top-tracks">
        <Col>
          <div id="section-title" className="text-left">Top Played Tracks</div>
          <Gallery items={this.state.topTracks?.items} type="track"></Gallery>
        </Col>
      </Row>
    );

    const topPlayedArtists = (
      <Row id="profile-top-artists">
        <Col>
          <div id="section-title" className="text-left">Top Played Artists</div>
          <Gallery items={this.state.topArtists?.items} type="artist"></Gallery>
        </Col>
      </Row>
    );

    const usersPlaylists = (
      <Row id="profile-playlists">
        <Col>
          <div id="section-title" className="text-left">Playlists</div>
          <Gallery items={this.state.playlists?.items}></Gallery>
        </Col>
      </Row>
    );

    return (
      <Row>
        <Col>
          <Toolbar />
        </Col>
        {this.state.topArtists && topPlayedArtists}
        {this.state.topTracks && topPlayedTracks}
        {this.state.playlists && usersPlaylists}
      </Row>
    );
  }
};

export default Profile;
