import { ChangeEvent, FormEvent, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormSelect, InputGroup, Row } from 'react-bootstrap';
import { SpotifyContext, SpotifyContextType } from '../../contexts/SpotifyProvider';
import { spotify } from '../../utils/spotifyApi';

type OperationFormProps = {
    data: Record<string, any>;
    onSubmit: (event: FormEvent<HTMLButtonElement>, operation: string, type: string, label: string, data: Record<string, any>) => void;
}

const OperationForm: FunctionComponent<OperationFormProps> = (props: OperationFormProps) => {
    const { spotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;;

    // Default Form Parameters
    const [operation, setOperation] = useState("source");
    const [type, setType] = useState("");

    // Source Parameters
    const [playlists, setPlaylists] = useState<{ items: any[] }>({ items: [] })
    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    // Selector Parameters
    const [dedupe, setDedupe] = useState(false);

    // Filter Parameters
    const [filter, setFilter] = useState("track");
    const [newerThan, setNewerThan] = useState("");
    const [olderThan, setOlderThan] = useState("");

    // Sorter Parameters
    const [order, setOrder] = useState<"asc" | "desc" | string>("asc");
    const [property, setProperty] = useState("artists");

    // Action Parameters
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [isCollaborative, setIsCollaborative] = useState(false)
    const [append, setAppend] = useState(false)
    const [reorder, setReorder] = useState(false)

    // Common Parameters
    const [name, setName] = useState("");
    const [limit, setLimit] = useState<number | undefined>();

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

    const changeOperation = (event: ChangeEvent<HTMLSelectElement>) => {
        setOperation(event.target.value)
        setType("");

        // Set default type for the operation
        if (event.target.value === "source") setType("playlist");
        if (event.target.value === "selector") setType("concatenate");
        if (event.target.value === "filter") setType("dedupe");
        if (event.target.value === "sorter") setType("sortBy");
        if (event.target.value === "action") setType("save");

        // Reset common parameters
        setName("");
        setLimit(undefined);
    }

    const sourceForm = (
        <Form className="d-grid gap-3">
            <Form.Group controlId="formSourceType">
                <Form.Label>Type</Form.Label>
                <FormSelect
                    value={type}
                    onChange={({ target }) => setType(target.value)}
                    placeholder="Please choose a Source operation"
                >
                    <option value="album">Album</option>
                    <option value="artist">Artists Top Tracks</option>
                    <option value="playlist">Playlist</option>
                    <option value="track">Track</option>
                </FormSelect>
            </Form.Group>

            {type === "playlist" &&
                <Form.Group>
                    <Form.Label>Playlist</Form.Label>
                    <FormSelect value={selectedPlaylist} onChange={({ target }) => setSelectedPlaylist(target.value)}>
                        {playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </FormSelect>
                </Form.Group>
            }

            {type !== "playlist" &&
                <Form.Group className="btn-margin">
                    <Form.Label className="text-capitalize">{type} Name</Form.Label>
                    <FormControl type="text" value={name} onChange={({ target }) => setName(target.value)} />
                </Form.Group>
            }

            <Form.Group className="btn-margin">
                <Form.Label className="text-capitalize">Track Limit</Form.Label>
                <FormControl type="number" value={limit} onChange={({ target }) => setLimit(parseInt(target.value))} />
                <Form.Text className="text-muted">
                    Optional, leave blank to retrieve all tracks
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="button" style={{ justifySelf: "end" }}
                onClick={(e) => {
                    let label = name;

                    if (type === "playlist") {
                        const playlist = playlists.items.find((p) => p.id === selectedPlaylist);
                        label = playlist.name;
                    }

                    props.onSubmit(e, operation, type, label, {
                        id: selectedPlaylist,
                        name,
                        limit,
                    })
                }}>
                Add
            </Button>
        </Form>
    )

    const selectorForm = (
        <Form className="d-grid gap-3">
            <Form.Group controlId="formSelectorType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                    value={type}
                    onChange={({ target }) => setType(target.value)}
                    placeholder="Please choose a Selector operation"
                >
                    <option value="alternate">Alternate tracks from each input</option>
                    <option value="concatenate">Concatenate tracks from each input</option>
                    <option disabled value="mix">Coming soon: Mix tracks based on track properties</option>
                    <option value="random">Select next input at random</option>
                    <option value="limit">Limit the number of tracks selected</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="btn-margin">
                <Form.Check inline type="checkbox" checked={dedupe} onChange={({ target }) => setDedupe(target.checked)} />
                <Form.Label>Remove duplicates</Form.Label>
            </Form.Group>

            <Form.Group className="btn-margin">
                <Form.Label className="text-capitalize">Track Limit</Form.Label>
                <FormControl type="number" value={limit} onChange={({ target }) => setLimit(parseInt(target.value))} />
                <Form.Text className="text-muted">
                    Optional, leave blank to retrieve all tracks
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="button" style={{ justifySelf: "end" }}
                onClick={(e) => {
                    const label = ""; // TODO: Pick a label?

                    props.onSubmit(e, operation, type, label, {
                        dedupe,
                        limit,
                    })
                }}>
                Add
            </Button>
        </Form>
    );

    const filterForm = (
        <Form className="d-grid gap-3">
            <Form.Group controlId="formFilterType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                    value={type}
                    onChange={({ target }) => setType(target.value)}
                    placeholder="Please choose a Filter operation"
                >
                    <option value="dedupe">Dedupe</option>
                    <option value="remove">Remove</option>
                    <option disabled value="audioFeature">Coming soon: Audio Feature (such as danceability)</option>
                    <option value="date">Date</option>
                </Form.Select>
            </Form.Group>

            {type && ["dedupe", "remove"].includes(type) &&
                <>
                    <Form.Group className="btn-margin">
                        <Form.Label>Remove Album, Artist or Track?</Form.Label>
                        <Form.Select
                            value={filter}
                            onChange={({ target }) => setFilter(target.value)}
                        >
                            <option value="album">Album</option>
                            <option value="artist">Artist</option>
                            <option value="track">Track</option>
                            {type === "dedupe" && <option value="any">Any</option>}
                        </Form.Select>
                    </Form.Group>

                    {type === "remove" && filter !== "any" &&
                        <Form.Group className="btn-margin">
                            <Form.Label className="text-capitalize">{filter} to remove</Form.Label>
                            <FormControl type="text" value={name} onChange={({ target }) => setName(target.value)} />
                        </Form.Group>
                    }
                </>
            }


            {type === "date" &&
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Newer than</Form.Label>
                            <Form.Control type="date" value={newerThan} onChange={({ target }) => setNewerThan(target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Older than</Form.Label>
                            <Form.Control type="date" value={olderThan} onChange={({ target }) => setOlderThan(target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
            }

            <Button variant="primary" type="button" style={{ justifySelf: "end" }}
                onClick={(e) => {
                    let label = filter;

                    if (type === "date") {
                        if (newerThan && olderThan) label = `Between ${newerThan} - ${olderThan}`
                        else if (newerThan) label = `Newer than ${newerThan}`
                        else if (olderThan) label = `Older than ${olderThan}`
                    }

                    props.onSubmit(e, operation, type, label, {
                        filter,
                        name,
                        newerThan: new Date(newerThan).toISOString(),
                        olderThan: new Date(olderThan).toISOString(),
                    })
                }}>
                Add
            </Button>
        </Form>
    );

    const sorterForm = (
        <Form className="d-grid gap-3">
            <Form.Group controlId="formSorterType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                    value={type}
                    onChange={({ target }) => setType(target.value)}
                    placeholder="Please choose a Sorter operation"
                >
                    <option value="sortBy">Sort by track property</option>
                    <option value="reverse">Reverse tracks</option>
                    <option value="shuffle">Shuffle tracks</option>
                    <option disabled value="seperated">Coming soon: Seperate tracks by Artist or Album</option>
                </Form.Select>
            </Form.Group>

            {type === "sortBy" &&
                <>
                    <Form.Group className="btn-margin">
                        <Form.Label>Property</Form.Label>
                        <Form.Select value={property} onChange={({ target }) => setProperty(target.value)}>
                            <option value="artists">Artist</option>
                            <option value="album.name">Album</option>
                            <option value="name">Track</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="btn-margin">
                        <Form.Label>Order</Form.Label>
                        <Form.Select value={order} onChange={({ target }) => setOrder(target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </Form.Select>
                    </Form.Group>
                </>
            }

            <Button variant="primary" type="button" style={{ justifySelf: "end" }}
                onClick={(e) => {
                    const label = property;

                    props.onSubmit(e, operation, type, label, {
                        order,
                        property,
                    })
                }}>
                Add
            </Button>
        </Form>
    );

    const actionForm = (
        <Form className="d-grid gap-3">
            <Form.Group controlId="formActionType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                    value={type}
                    onChange={({ target }) => setType(target.value)}
                    placeholder="Please choose an Action operation"
                >
                    <option value="save">Save to playlist</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="btn-margin">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={({ target }) => setName(target.value)} />
            </Form.Group>

            <Form.Group className="btn-margin">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" as="textarea" style={{ maxHeight: 150 }} maxLength={200} value={description} onChange={({ target }) => setDescription(target.value)} />
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group className="btn-margin">
                        <Form.Check inline type="checkbox" checked={isPublic} onChange={({ target }) => setIsPublic(target.checked)} />
                        <Form.Label>Public</Form.Label>
                    </Form.Group>

                    <Form.Group className="btn-margin">
                        <Form.Check inline type="checkbox" checked={isCollaborative} onChange={({ target }) => setIsCollaborative(target.checked)} />
                        <Form.Label>Collaborative</Form.Label>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="btn-margin">
                        <Form.Check inline type="checkbox" checked={append} onChange={({ target }) => setAppend(target.checked)} />
                        <Form.Label>Append to playlist</Form.Label>
                    </Form.Group>

                    <Form.Group className="btn-margin">
                        <Form.Check inline type="checkbox" checked={reorder} onChange={({ target }) => setReorder(target.checked)} />
                        <Form.Label>Reorder playlist</Form.Label>
                    </Form.Group>
                </Col>
            </Row>

            <Button variant="primary" type="button" style={{ justifySelf: "end" }}
                onClick={(e) => {
                    const label = name;

                    props.onSubmit(e, operation, type, label, {
                        name,
                        description,
                        isPublic,
                        isCollaborative,
                        append,
                        reorder,
                    })
                }}>
                Add
            </Button>
        </Form>
    );

    return (
        <div className="d-grid gap-3">
            {/* Change type of form for selected operation  */}
            <InputGroup>
                <InputGroup.Text>Operation</InputGroup.Text>
                <FormSelect value={operation} onChange={changeOperation}>
                    <option value="source">Source</option>
                    <option value="selector">Selector</option>
                    <option value="filter">Filter</option>
                    <option value="sorter">Sorter</option>
                    <option value="action">Action</option>
                </FormSelect>
            </InputGroup>

            {/* Form */}
            {operation === "source" && sourceForm}
            {operation === "selector" && selectorForm}
            {operation === "filter" && filterForm}
            {operation === "sorter" && sorterForm}
            {operation === "action" && actionForm}
        </div>
    );
}

export default OperationForm;