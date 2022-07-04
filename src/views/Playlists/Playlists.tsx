import { FunctionComponent, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { Button, Col, FormSelect, InputGroup, Row } from "react-bootstrap";
import Toolbar from '../../components/Toolbar/Toolbar';
import { SpotifyContext, SpotifyContextType } from '../../contexts/SpotifyProvider';
import { spotify } from '../../utils/spotifyApi';
import { API } from '../../config';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';

// import './Playlists.css';

type PlaylistsProps = {
    limit?: number,
    range?: "short_term" | "medium_term" | "long_term",
}

const Playlists: FunctionComponent<PlaylistsProps> = (props) => {
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const { spotifyTokens, setSpotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;

    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [sortProperty, setSortProperty] = useState("track.artists");
    const [sortOrder, setSortOrder] = useState("asc");
    const [playlists, setPlaylists] = useState<{ items: any[] }>({ items: [] });

    // Refetch data whenever limit or range changes
    useEffect(() => {
        async function fetch() {
            let params = { limit: 50 };

            try {
                // Get top played tracks
                const { data: playlists } = await spotify.get('/me/playlists', { params });
                if (playlists) setPlaylists(playlists);
            } catch (error) {
                console.error("Failed to fetch playlists", error);

                if (axios.isAxiosError(error)) {
                    if (error.code === "401") {
                        // Reset Spotify tokens to force login
                        setSpotifyTokens("", "");
                    }
                }
            }
        }

        fetch();
    }, [])

    async function sortPlaylist() {
        try {
            // Get top played tracks
            if (idToken) {
                const response = await fetch(`${API.API_BASE_URL}/playlist/${selectedPlaylist}/sort?property=${sortProperty}&order=${sortOrder}`, {
                    headers: { Authorization: idToken, spotify: spotifyTokens?.access_token || "" }
                });
                const responseText = await response.text()
                console.log("Success", responseText);
            }
        } catch (error) {
            console.error("Failed to sort playlist", error);
        }
    }

    return (
        <Row>
            <Col>
                <Toolbar>
                </Toolbar>
            </Col>
            <Row id="profile-playlists">
                <Col>
                    <div id="section-title" className="text-left">Sort Playlist</div>
                    <div className="d-grid gap-3">
                        <InputGroup className="btn-margin">
                            <InputGroup.Text>Playlist</InputGroup.Text>
                            <FormSelect onChange={({ target }) => setSelectedPlaylist(target.value)}>
                                {playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </FormSelect>
                        </InputGroup>
                        <InputGroup className="btn-margin">
                            <InputGroup.Text>Sort by</InputGroup.Text>
                            <FormSelect onChange={({ target }) => setSortProperty(target.value)}>
                                <option value="added_at">Date added</option>
                                <option value="track.artists">Artists</option>
                                <option value="track.album.name">Album</option>
                                <option value="track.name">Name</option>
                            </FormSelect>
                        </InputGroup>
                        <InputGroup className="btn-margin">
                            <InputGroup.Text>Order</InputGroup.Text>
                            <FormSelect onChange={({ target }) => setSortOrder(target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </FormSelect>
                        </InputGroup>
                    </div>
                    <div className="d-flex mt-3">
                        <Button type="submit" onClick={sortPlaylist}>
                            Sort playlist
                        </Button>
                    </div>
                </Col>
            </Row>
        </Row>
    );

};

export default Playlists;
