import { FunctionComponent, useEffect, useState } from 'react';
import { Col, FormControl, FormSelect, InputGroup, Row } from "react-bootstrap";
import Gallery from '../../components/Gallery/Gallery';
import Toolbar from '../../components/Toolbar/Toolbar';
import { spotify } from '../../utils/spotifyApi';

import './TopPlayed.css';

type TopPlayedProps = {
  limit?: number,
  range?: "short_term" | "medium_term" | "long_term",
}

const TopPlayed: FunctionComponent<TopPlayedProps> = (props) => {
  const [limit, setLimit] = useState(6 || props.limit);
  const [range, setRange] = useState("medium_term" || props.range);
  const [topTracks, setTopTracks] = useState<{ items: any[] }>({ items: [] });
  const [topArtists, setTopArtists] = useState<{ items: any[] }>({ items: [] });

  // Refetch data whenever limit or range changes
  useEffect(() => {
    async function fetch() {
      let params = { limit, time_range: range, };

      try {
        // Get top played tracks
        const { data: topTracks } = await spotify.get('/me/top/tracks', { params });
        if (topTracks) setTopTracks(topTracks);
        // Get top played artists
        const { data: topArtists } = await spotify.get('/me/top/artists', { params });
        if (topArtists) setTopArtists(topArtists);
      } catch (error) {
        console.error("Failed to fetch top tracks/artists", error);
      }
    }

    fetch();
  }, [limit, range])

  return (
    <Row>
      <Col>
        <Toolbar>
          <InputGroup className="ms-3 btn-margin">
            <InputGroup.Text>Range</InputGroup.Text>
            <FormSelect defaultValue={range} onChange={({ target }) => setRange(target.value)}>
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">Of All Time</option>
            </FormSelect>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Limit</InputGroup.Text>
            <FormControl type="number" value={limit} onChange={({ target }) => setLimit(parseInt(target.value))} max={50} style={{ width: "4rem" }} />
          </InputGroup>
        </Toolbar>
      </Col>
      <Row id="profile-top-artists">
        <Col>
          <div id="section-title" className="text-left">Top Played Artists</div>
          <Gallery items={topArtists?.items} type="artist"></Gallery>
        </Col>
      </Row>
      <Row id="profile-top-tracks">
        <Col>
          <div id="section-title" className="text-left">Top Played Tracks</div>
          <Gallery items={topTracks?.items} type="track"></Gallery>
        </Col>
      </Row>
    </Row>
  );

};

export default TopPlayed;
