import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef } from "react";
import "/styles/Drivers.scss";
// import 'ag-grid-enterprise';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function AllDrivers() {
    const gridRef = useRef<AgGridReact>(null);
    const isFirstLoad = useRef(true);

    const [driversData, setDriversData] = useState([]);
    const [isFilterToggled, setIsFilterToggled] = useState(false);

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: "forename" },
        { field: "surname" },
        { field: "nationality", filter: true },
        { field: "driverRef" },
        { field: "number" },
        { field: "dob", sortable: true, filter: true },
        { field: "code" },
    ]);

    useEffect(() => {
        let isMounted = true;

        console.log("useEffect called")
        console.log("isFirstLoad.current: ", isFirstLoad.current)
        console.log("isFilterToggled: ", isFilterToggled)
        if (isFirstLoad.current || isFilterToggled) {
            fetchData()
                .then((data) => {
                    if (isMounted) {
                        setDriversData(data);
                        isFirstLoad.current = false;
                    }
                })
                .catch((error) => {
                    alert("Error fetching data, maybe the server is down?");
                    console.log(error);
                })
                .finally(() => {
                    isFilterToggled && setIsFilterToggled(false);
                });
        }

        return () => {
            isMounted = false;
        };
    }, [isFilterToggled]);

    const fetchData = async () => {
        const response = await fetch("https://localhost:7077/drivers");
        const data = await response.json();
        const uniqueNations = new Set();
        data.forEach((driver: any) => {
            driver.dob = new Date(driver.dob);
            uniqueNations.add(driver.nationality);
        });
        // if (isMounted) {
        // //     // setColumnDefs((colDefs) => {
        // //     //     return colDefs.map((def) => {
        // //     //         if (def.field === 'nationality') {
        // //     //             return {
        // //     //                 ...def,
        // //     //                 filter: 'agSetColumnFilter',
        // //     //                 filterParams: {
        // //     //                     values: [...uniqueNations],
        // //     //                 },
        // //     //             };
        // //     //         } else {
        // //     //             return def;
        // //     //         }
        // //     //     });
        // //     // });
        //     setDriversData(data);
        // }
        return data;
    };

    const handleFilterChanged = () => {
        if (gridRef.current) {
            const filterModel = gridRef.current.api.getFilterModel();
            setIsFilterToggled(true);
        }
    };

    return (
        <div className="ag-theme-alpine grid-container">
            <AgGridReact
                ref={gridRef}
                className="inner-grid"
                rowData={driversData}
                columnDefs={columnDefs}
                onFilterChanged={handleFilterChanged}
            ></AgGridReact>
        </div>
    );
}
