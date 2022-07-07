import { FunctionComponent } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Button, ButtonGroup } from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface ActionsRendererProps extends ICellRendererParams {
    deleteHandler: (scheduleId: string) => Promise<Response>
}

const ActionsRenderer: FunctionComponent<ActionsRendererProps> = (props) => {
    const { deleteHandler, api, data } = props;
    const navigate = useNavigate();

    // TODO: Use modals instead
    function viewRow() {
        let cellValues = [`${data.schedule} parameters;\n`];

        for (const property in data.operationParameters) {
            cellValues.push(`${property}: ${data.operationParameters[property]}`)
        }

        window.confirm(cellValues.join('\n'))
    }

    function editRow() {
        navigate(`/schedules/${data.id}`)
    }

    async function deleteRow(force = false) {
        let confirm = true;

        if (!force) {
            confirm = window.confirm(`Are you sure you want to delete the '${data.schedule}' schedule?`);
        }

        if (confirm) {
            // Delete Schedule
            const response = await deleteHandler(data.id)

            if (response.ok) {
                // Reload Grid
                api.applyTransaction({ remove: [data] });
                api.refreshCells({ force: true });
            }
        }
    };

    return (
        <ButtonGroup className="mb-1">
            <Button size="sm" variant="secondary" onClick={() => viewRow()}>
                <Eye className="mb-1" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => editRow()}>
                <Pencil className="mb-1" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => deleteRow()}>
                <Trash className="mb-1" />
            </Button>
        </ButtonGroup>
    )
}

export default ActionsRenderer;