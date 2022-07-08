import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, FormControl, FormSelect, InputGroup } from "react-bootstrap";
import { SpotifyContext, SpotifyContextType } from '../../contexts/SpotifyProvider';
import { spotify } from '../../utils/spotifyApi';
import { API } from '../../config';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';
import { useNavigate, useParams } from 'react-router-dom';

const ScheduleForm: FunctionComponent = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const { spotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;

    const [isEditing, setIsEditing] = useState(false);
    const [scheduleName, setScheduleName] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [sortProperty, setSortProperty] = useState("track.artists");
    const [sortOrder, setSortOrder] = useState("asc");
    const [cadence, setCadence] = useState("once");
    const [scheduleTimestamp, setScheduleTimestamp] = useState("");
    const [playlists, setPlaylists] = useState<{ items: any[] }>({ items: [] });

    useEffect(() => {
        async function fetchPlaylists() {
            let params = { limit: 50 };

            try {
                // Get top played tracks
                const { data: playlists } = await spotify.get('/me/playlists', { params });
                if (playlists) setPlaylists(playlists);
            } catch (error) {
                console.error("Failed to fetch playlists", error);
            }
        }

        if (spotifyTokens) {
            fetchPlaylists();
        }

    }, [spotifyTokens])

    // When playlists are fetched, update form if editing
    useEffect(() => {
        async function fetchSchedule(scheduleId: string) {
            try {
                if (idToken) {
                    const response = await fetch(`${API.API_BASE_URL}/schedules/${scheduleId}`, {
                        headers: { Authorization: idToken }
                    });
                    const schedule = await response.json();

                    // Set form state
                    setScheduleName(schedule.schedule);
                    setSelectedPlaylist(schedule.operationParameters.playlistId);
                    setSortProperty(schedule.operation);
                    setSortOrder(schedule.operationParameters.order);
                    setCadence(schedule.cadence);

                    // Convert UTC time to local
                    const timeOffset = new Date().getTimezoneOffset() / 60;
                    const scheduleDate = new Date(schedule.scheduledTimestamp);
                    scheduleDate.setHours(scheduleDate.getHours() - timeOffset);
                    const setTime = scheduleDate.toISOString().slice(0, 16)
                    setScheduleTimestamp(setTime);
                }
            } catch (error) {
                console.error("Failed to get schedule", error);
            }
        }

        // Set defaults if editing
        if (params.scheduleId) {
            setIsEditing(true);
            fetchSchedule(params.scheduleId);
        }
    }, [idToken, params.scheduleId])

    async function createSchedule() {
        // Convert local time to UTC
        const scheduleDate = new Date(scheduleTimestamp);

        try {
            if (idToken) {
                await fetch(`${API.API_BASE_URL}/schedules/create`, {
                    method: "POST",
                    headers: { Authorization: idToken, spotify: spotifyTokens?.access_token || "" },
                    body: JSON.stringify({
                        name: scheduleName,
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

                navigate("/schedules")
            }
        } catch (error) {
            console.error("Failed to create schedule", error);
        }
    }

    return (
        <div>
            <div className="d-grid gap-3">
                <InputGroup className="btn-margin">
                    <InputGroup.Text>Name</InputGroup.Text>
                    <FormControl type="text" required value={scheduleName} onChange={({ target }) => setScheduleName(target.value)} />
                </InputGroup>
                <InputGroup className="btn-margin">
                    <InputGroup.Text>Playlist</InputGroup.Text>
                    <FormSelect value={selectedPlaylist} onChange={({ target }) => setSelectedPlaylist(target.value)}>
                        {playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </FormSelect>
                </InputGroup>
                <InputGroup className="btn-margin">
                    <InputGroup.Text>Sort by</InputGroup.Text>
                    <FormSelect value={sortProperty} onChange={({ target }) => setSortProperty(target.value)}>
                        <option value="added_at">Date added</option>
                        <option value="track.artists">Artists</option>
                        <option value="track.album.name">Album</option>
                        <option value="track.name">Name</option>
                    </FormSelect>
                    <InputGroup.Text>Order</InputGroup.Text>
                    <FormSelect value={sortOrder} onChange={({ target }) => setSortOrder(target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </FormSelect>
                </InputGroup>
                <InputGroup className="btn-margin">
                    <InputGroup.Text>Date &amp; Time</InputGroup.Text>
                    <FormControl type="datetime-local" value={scheduleTimestamp} onChange={({ target }) => setScheduleTimestamp(target.value)} />
                    <InputGroup.Text>Cadence</InputGroup.Text>
                    <FormSelect value={cadence} onChange={({ target }) => setCadence(target.value)}>
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
                    {isEditing ? "Update schedule" : "Create schedule"}
                </Button>
            </div>
        </div>
    );

};

export default ScheduleForm;
