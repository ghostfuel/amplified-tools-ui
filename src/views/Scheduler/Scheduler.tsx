import { FunctionComponent, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { Button, Col, FormControl, FormSelect, InputGroup, Row } from "react-bootstrap";
import Toolbar from '../../components/Toolbar/Toolbar';
import { SpotifyContext, SpotifyContextType } from '../../contexts/SpotifyProvider';
import { spotify } from '../../utils/spotifyApi';
import { API } from '../../config';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';
import ScheduleTable from '../../components/ScheduleTable/ScheduleTable';


const Scheduler: FunctionComponent = (props) => {
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const { spotifyTokens, setSpotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;

    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [sortProperty, setSortProperty] = useState("track.artists");
    const [sortOrder, setSortOrder] = useState("asc");
    const [cadence, setCadence] = useState("once");
    const [scheduleTimestamp, setScheduleTimestamp] = useState("");
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
    }, [setSpotifyTokens])

    async function createSchedule() {
        // Convert local time to UTC
        const timeOffset = new Date().getTimezoneOffset() / 60;
        const scheduleDate = new Date(scheduleTimestamp);
        scheduleDate.setHours(scheduleDate.getHours() + timeOffset);

        try {
            if (idToken) {
                const response = await fetch(`${API.API_BASE_URL}/scheduler/create`, {
                    method: "POST",
                    headers: { Authorization: idToken, spotify: spotifyTokens?.access_token || "" },
                    body: JSON.stringify({
                        operation: "sort",
                        operationParameters: {
                            playlistId: selectedPlaylist,
                            property: sortProperty,
                            order: sortOrder,
                        },
                        cadence: cadence,
                        timestamp: scheduleDate.toISOString(),
                        spotify: spotifyTokens,
                    })
                });

                console.log("Success", response.body);
            }
        } catch (error) {
            console.error("Failed to create schedule", error);
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
                    <div id="section-title" className="text-left">Create Schedule</div>
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
                            <InputGroup.Text>Order</InputGroup.Text>
                            <FormSelect onChange={({ target }) => setSortOrder(target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </FormSelect>
                        </InputGroup>
                        <InputGroup className="btn-margin">
                            <InputGroup.Text>Date &amp; Time</InputGroup.Text>
                            <FormControl type="datetime-local" value={scheduleTimestamp} onChange={({ target }) => setScheduleTimestamp(target.value)} />
                            <InputGroup.Text>Cadence</InputGroup.Text>
                            <FormSelect onChange={({ target }) => setCadence(target.value)}>
                                <option value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </FormSelect>
                        </InputGroup>
                    </div>
                    <div className="d-flex mt-3">
                        <Button type="submit" onClick={createSchedule}>
                            Create schedule
                        </Button>
                    </div>
                    <ScheduleTable />
                </Col>
            </Row>
        </Row>
    );

};

export default Scheduler;
