import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SortDown, CalendarWeek, PersonCircle, Award } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./Tools.css";

type ToolsProps = {}

const Tools: FunctionComponent<ToolsProps> = (props) => {
    const navigate = useNavigate()

    return (
        <Row>
            <Row id="dashboard-tools" className='row-cols-auto'>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <PersonCircle id="tile-icon" fill="#212529" onClick={() => navigate("/profile")} />
                        </div>
                        <div className="title">My Profile</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <Award id="tile-icon" fill="#212529" onClick={() => navigate("/top-played")} />
                        </div>
                        <div className="title">My Top Played</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <SortDown id="tile-icon" fill="#212529" onClick={() => navigate("/sort-playlist")} />
                        </div>
                        <div className="title">Sort Playlists</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <CalendarWeek id="tile-icon" fill="#212529" onClick={() => navigate("/scheduler")} />
                        </div>
                        <div className="title">Create Schedule</div>
                    </div>
                </Col>
            </Row>
        </Row>
    )
};


export default Tools;