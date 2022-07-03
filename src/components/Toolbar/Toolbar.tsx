import { FunctionComponent, ReactNode } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import "./Toolbar.css";

type ToolbarProps = {
    children?: ReactNode
}

const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
    const navigate = useNavigate()

    return (
        <ButtonToolbar id="toolbar" className="text-left">
            <Button className="toolbar-btn btn-dark me-3" onClick={() => navigate(-1)}><ChevronLeft /></Button>
            {props.children && <div className="vr"></div>}
            {props.children}
        </ButtonToolbar>
    )
};


export default Toolbar;