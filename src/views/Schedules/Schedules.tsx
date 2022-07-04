import { FunctionComponent, useEffect } from 'react';
import { Col, Row } from "react-bootstrap";
import Toolbar from '../../components/Toolbar/Toolbar';
import ScheduleTable from '../../components/ScheduleTable/ScheduleTable';


const Schedules: FunctionComponent = () => {
    useEffect(() => { })

    return (
        <Row>
            <Col>
                <Toolbar>
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
