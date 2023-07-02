import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect } from "react";
import '/styles/Drivers.scss';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function AllDrivers() {
    const [driversData, setDriversData] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const response = await fetch("https://localhost:7077/drivers");
            const data = await response.json();
            data.forEach((driver: any) => {
                driver.dob = new Date(driver.dob);
            });
            if (isMounted) setDriversData(data)
        };

        fetchData();

        return () => {
            isMounted = false;
        }
    }, []);


    const columnDefs: ColDef[] = [
        { field: "forename"},
        { field: "surname" },
        { field: "nationality", filter: true },
        { field: "driverRef" },
        { field: "number" },
        { field: "dob", sortable: true, filter: true },
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
