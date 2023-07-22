import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef } from "react";
import "/styles/Drivers.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColNames } from "../constants/ColNames";
import { IConsolidatedFilterModel, IFilterModel, isComplexFilter } from "../utils/FilterUtils";

export default function AllDrivers() {
    const gridRef = useRef<AgGridReact>(null);

    const [driversData, setDriversData] = useState([]);
    const [activeFilter, setActiveFilter] = useState<IFilterModel>();

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

        fetchData()
            .then((data) => {
                if (isMounted) {
                    setDriversData(data);
                }
            })
            .catch((error) => {
                alert("Error fetching data, maybe the server is down?");
                console.log(error);
            });

        return () => {
            isMounted = false;
        };
    }, [activeFilter]);

    const fetchData = async () => {
        console.log("JOE FETCH");
        let url = "https://localhost:7077/drivers";

        console.log("JOE activeFilter");
        console.log(activeFilter);

        const filterQuery = JSON.stringify(activeFilter);
        if (!!filterQuery && filterQuery !== "{}") {
            url += `?filter=${filterQuery}`;
        }
        console.log("JOE url");
        console.log(url);
        const response = await fetch(url);
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
            const filterModel: IFilterModel = gridRef.current.api.getFilterModel();
            console.log("JOE Handle Filter Changed");

            console.log(filterModel);
            const consolidatedFilter: IConsolidatedFilterModel = {};

            Object.entries(filterModel).forEach(([key, value]) => {
                const filterKey = key as keyof IFilterModel;
                let filterValue = value;
                if (!isComplexFilter(value)) {
                    // If the filter is not complex, we need to wrap it and make it complex
                    // This is a bad way of doing it, it is not very type safe
                    // Instead, loop through ColNames and check if the filterKey is in there, then cast the value to the correct type
                }
                consolidatedFilter[filterKey] = filterValue;
            });

            setActiveFilter(filterModel);
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
