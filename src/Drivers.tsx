import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect } from "react";
import './Drivers.scss';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Drivers() {
    const [driversData, setDriversData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://localhost:7077/drivers");
            const data = await response.json();
            setDriversData(data)
        };
        fetchData();
    }, []);


    const columnDefs: ColDef[] = [
        { field: "forename" },
        { field: "surname" },
        { field: "nationality" },
        { field: "driverId" },
        { field: "driverRef" },
        { field: "number" },
        { field: "dob" },
        { field: "code" }
    ];

    return (
        <div className="ag-theme-alpine grid-container">
            <AgGridReact
                className="inner-grid"
                rowData={driversData}
                columnDefs={columnDefs}
            ></AgGridReact>
        </div>
    );
}
