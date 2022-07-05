import { useState, useRef, useEffect, useMemo, FunctionComponent, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { API } from "../../config";
import { CognitoContext, CognitoContextType } from "../../contexts/CognitoProvider";
import ActionsRenderer from "./CellRenderers/ActionsRenderer";

type ScheduleTableProps = {}

const ScheduleTable: FunctionComponent<ScheduleTableProps> = (props) => {
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const gridRef = useRef<any>();
    const [rowData, setRowData] = useState();

    const [columnDefs] = useState([
        { field: 'schedule' },
        { field: 'operation', width: 55 },
        { field: 'cadence', width: 55 },
        { field: 'createdAt', headerName: 'Created', type: 'date', width: 80 },
        { field: 'scheduledTimestamp', headerName: 'First run', type: 'date', width: 80 },
        { field: 'runCount', headerName: 'Runs', width: 45 },
        { field: 'errorCount', headerName: 'Errors', width: 45 },
        // Hidden temporarily
        {
            headerName: 'Parameters',
            field: 'operationParameters',
            type: 'object',
            hide: true,
            width: 120
        },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                deleteHandler: async (scheduleId: string) => {
                    try {
                        if (idToken) {
                            const response = await fetch(`${API.API_BASE_URL}/schedules/${scheduleId}`, {
                                method: "DELETE",
                                headers: { Authorization: idToken }
                            });
                            return response;
                        }
                    } catch (error) {
                        console.error(`Failed to delete schedule ${scheduleId}`, error);
                    }
                }
            },
            width: 60
        }
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true
    }), []);

    const columnTypes = useMemo(() => ({
        date: {
            valueFormatter: (params: any) => new Date(params.value).toDateString()
        },
        object: {
            // Map object to Key: Value text list, one per line and reduce spacing
            cellRenderer: (params: any) => {
                let cellValues = [];

                for (const property in params.value) {
                    cellValues.push(`${property}: ${params.value[property]}`)
                }

                return (<div style={{ "lineHeight": "25px" }}>{cellValues.map((item, idx) => <span key={idx}>{item}<br /></span>)}</div>);
            },
            autoHeight: true,
        }
    }), []);

    // Example load data from sever
    useEffect(() => {
        async function getSchedules() {
            try {
                if (idToken) {
                    const response = await fetch(`${API.API_BASE_URL}/schedules`, {
                        headers: { Authorization: idToken }
                    });
                    return response.json();
                }
            } catch (error) {
                console.error("Failed to get schedules", error);
            }
        }

        getSchedules()
            .then(rowData => setRowData(rowData))
            .then(() => gridRef.current.api.sizeColumnsToFit())
    }, [idToken]);

    return (
        <div className="ag-theme-amplified-dark" style={{ width: 'auto', height: 500 }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                columnTypes={columnTypes}
            />
        </div>
    );
};

export default ScheduleTable;