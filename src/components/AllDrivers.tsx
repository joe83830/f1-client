import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef } from "react";
import "/styles/Drivers.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColNames } from "../constants/ColNames";

export default function AllDrivers() {
    const gridRef = useRef<AgGridReact>(null);
    const isFirstLoad = useRef(true);

    const [driversData, setDriversData] = useState([]);
    const [isFilterToggled, setIsFilterToggled] = useState(false);

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: ColNames.FORNAME },
        { field: ColNames.SURNAME },
        {
            field: ColNames.NATIONALITY,
            filter: true,
            filterParams: { maxNumConditions: 5 },
        },
        { field: ColNames.DRIVERREF, filter: true },
        { field: ColNames.NUMBER, filter: true },
        { field: ColNames.DOB, sortable: true, filter: true },
        { field: ColNames.CODE },
    ]);

    useEffect(() => {
        let isMounted = true;

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
        let url = "https://localhost:7077/drivers";

        const search = JSON.stringify(gridRef.current?.api?.getFilterModel());
        console.log("JOE search")
        console.log(search);
        if (search !== "{}") {
            url += `?filter=${search}`;
        }
        console.log("JOE")
        console.log(url);
        const response = await fetch("https://localhost:7077/drivers");
        const data = await response.json();
        const uniqueNations = new Set();
        data.forEach((driver: any) => {
            driver.dob = new Date(driver.dob);
            uniqueNations.add(driver.nationality);
        });

        return data;
    };

    const handleFilterChanged = () => {
        if (gridRef.current) {
            const filterModel = gridRef.current.api.getFilterModel();
            console.log(filterModel);
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
