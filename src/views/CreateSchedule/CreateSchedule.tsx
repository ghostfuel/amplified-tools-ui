import { FunctionComponent } from 'react';
import { Col, Row } from "react-bootstrap";
import Toolbar from '../../components/Toolbar/Toolbar';
import ScheduleForm from '../../components/ScheduleForm/ScheduleForm';

type CreateScheduleProps = {
    edit?: boolean;
}

const CreateSchedule: FunctionComponent<CreateScheduleProps> = (props: CreateScheduleProps) => {
    const edit = props.edit;

    return (
        <Row>
            <Col>
                <Toolbar>
                </Toolbar>
            </Col>
            <Row id="profile-playlists">
                <Col>
                    <div id="section-title" className="text-left">{edit ? "Update Schedule" : "Create Schedule"}</div>
                    <ScheduleForm />
                </Col>
            </Row>
        </Row>
    );

};

export default CreateSchedule;
