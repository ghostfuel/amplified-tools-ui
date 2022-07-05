import { FunctionComponent } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

interface ActionsRendererProps extends ICellRendererParams {
    deleteHandler: (scheduleId: string) => Promise<Response>
}

const ActionsRenderer: FunctionComponent<ActionsRendererProps> = (props) => {
    const { deleteHandler, api, data } = props;

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
        <ButtonToolbar className="mt-1">
            <Button size="sm" variant="secondary" onClick={() => deleteRow()}>
                <Trash />
            </Button>
        </ButtonToolbar>
    )
}

export default ActionsRenderer;