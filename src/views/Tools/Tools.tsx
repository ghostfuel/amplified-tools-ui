import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import { SortDown, CalendarWeek, PersonCircle, Award, CalendarPlus, CalendarPlusFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./Tools.css";

type ToolsProps = {}

const Tools: FunctionComponent<ToolsProps> = (props) => {
    const navigate = useNavigate()

    return (
        <Col>
            <div id="section-title" className="text-left">Spotify</div>
            <Row id="dashboard-tools" className='row-cols-auto d-flex justify-content-center justify-content-sm-start'>
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
            </Row>
            <div id="section-title" className="text-left">Tools</div>
            <Row id="dashboard-tools" className='row-cols-auto d-flex justify-content-center justify-content-sm-start'>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <CalendarWeek id="tile-icon" fill="#212529" onClick={() => navigate("/schedules")} />
                        </div>
                        <div className="title">My Schedules</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <CalendarPlus id="tile-icon" fill="#212529" onClick={() => navigate("/schedules/create")} />
                        </div>
                        <div className="title">Create Schedule</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <CalendarPlusFill id="tile-icon" fill="#212529" onClick={() => navigate("/workflow/create")} />
                        </div>
                        <div className="title">Create Workflow <br /> (Demo, WIP)</div>
                    </div>
                </Col>
                <Col>
                    <div id="section-tiles">
                        <div id="tile" className="bg-secondary">
                            <SortDown id="tile-icon" fill="#212529" onClick={() => navigate("/sort-playlist")} />
                        </div>
                        <div className="title">Sort Playlist</div>
                    </div>
                </Col>
            </Row>
        </Col>
    )
};


export default Tools;