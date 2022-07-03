import { useState, useRef, useEffect, useMemo, useCallback, FunctionComponent, useContext } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import { API } from "../../config";
import { CognitoContext, CognitoContextType } from "../../contexts/CognitoProvider";

type ScheduleTableProps = {}

const ScheduleTable: FunctionComponent<ScheduleTableProps> = (props) => {
    const { idToken } = useContext(CognitoContext) as CognitoContextType;
    const gridRef = useRef<any>();
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        { field: 'operation' },
        { field: 'cadence' },
        // { field: 'operationParameters' },
        { field: 'timestamp', headerName: 'First run' },
        { field: 'count', headerName: 'Times ran' },
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true
    }), []);

    // Example of consuming Grid Event
    const cellClickedListener = useCallback((event: any) => {
        console.log('cellClicked', event);
    }, []);

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

    // Example load data from sever
    useEffect(() => {
        getSchedules()
            .then(rowData => setRowData(rowData))
            .then(() => gridRef.current.api.sizeColumnsToFit())
    }, []);

    return (
        <div>
            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine" style={{ width: 'auto', height: 500 }}>

                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API
                    rowData={rowData} // Row Data for Rows
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection="multiple" // Options - allows click selection of rows
                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                />
            </div>
        </div>
    );
};

export default ScheduleTable;