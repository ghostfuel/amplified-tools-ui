import { useState, useRef, useEffect, useMemo, FunctionComponent, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { API } from "../../config";
import { CognitoContext, CognitoContextType } from "../../contexts/CognitoProvider";

type ScheduleTableProps = {}

const ScheduleTable: FunctionComponent<ScheduleTableProps> = (props) => {
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const gridRef = useRef<any>();
    const [rowData, setRowData] = useState();

    const [columnDefs] = useState([
        { field: 'operation', width: 60 },
        { field: 'cadence', width: 60 },
        {
            headerName: 'Parameters',
            field: 'operationParameters',
            // Map object to Key: Value text list, one per line and reduce spacing
            cellRenderer: (params: any) => {
                let cellValues = [];

                for (const property in params.value) {
                    cellValues.push(`${property}: ${params.value[property]}`)
                }

                return (<div style={{ "lineHeight": "25px" }}>{cellValues.map((item, idx) => <span key={idx}>{item}<br /></span>)}</div>);
            },
            autoHeight: true,
            width: 120
        },
        { field: 'timestamp', headerName: 'First run', width: 100 },
        { field: 'count', headerName: 'Times ran', width: 100 },
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true
    }), []);

    // Example load data from sever
    useEffect(() => {
        async function getSchedules() {
            try {
                if (idToken) {
                    const response = await fetch(`${API.API_BASE_URL}/schedules`, {
                        headers: { Authorization: idToken }
                    });
                    console.log("Fetched schedules", response.body);
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
                ref={gridRef} // Ref for accessing Grid's API
                rowData={rowData} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            />
        </div>
    );
};

export default ScheduleTable;