import { FunctionComponent } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import Toolbar from '../../components/Toolbar/Toolbar';
import ScheduleTable from '../../components/ScheduleTable/ScheduleTable';
import { useNavigate } from 'react-router-dom';

const Schedules: FunctionComponent = () => {
    const navigate = useNavigate();

    return (
        <Row>
            <Col>
                <Toolbar>
                    <Button className="toolbar-btn btn-dark ms-3" onClick={() => navigate("/schedules/create")}>New Schedule</Button>
                </Toolbar>
            </Col>
            <Row>
                <Col>
                    <div id="section-title" className="text-left">Schedules</div>
                    <div className="mt-3">
                        <ScheduleTable />
                    </div>
                </Col>
            </Row>
        </Row>
    );

};

export default Schedules;
