import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Col, Container, Image, Placeholder, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { SpotifyContext, SpotifyContextType } from "../../contexts/SpotifyProvider";
import { spotify } from "../../utils/spotifyApi";

import "./Dashboard.css"

const Dashboard: FunctionComponent = () => {
    const { spotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;

    const [user, setUser] = useState<any>();

    useEffect(() => {
        // Get current users profile
        const getUser = async () => {
            try {
                const { data: user } = await spotify.get(`/me`);
                if (user) setUser(user);
            } catch (error: any) {
                console.error("Failed to retrieve user data", error);
            }
        };

        if (spotifyTokens?.access_token) {
            getUser();
        }
    }, [spotifyTokens?.access_token])

    return (
        <Container className='container-xl'>
            <Col>
                <Row id="dashboard-header">
                    {user?.images ? <Image id="avatar" alt="avatar" roundedCircle src={user?.images[0]?.url} /> : <Placeholder id="avatar-placeholder" />}
                    <Col>
                        <div className="text-capitalize text-left">
                            <div style={{ fontSize: 12 }}>{user?.type} ({user?.product})</div>
                            <a id="display-name" href={user?.external_urls.spotify}>{user?.display_name}</a>
                            <div style={{ fontSize: 12 }}>{user?.followers?.total} Followers</div>
                        </div>
                    </Col>
                </Row>

                <Outlet />
            </Col>
        </Container>
    );
};

export default Dashboard;