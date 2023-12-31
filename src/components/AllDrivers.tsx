import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef, createContext } from "react";
import "/styles/Drivers.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllDriversColNames } from "../constants/ColNames";
import { useHistory, useLocation } from "react-router-dom";
import { useFilterContext } from "./providers/FilterProvider";
import { LinkCellRenderer } from "./custom-cell-renderers/LinkCellRenderer";

export interface IDriverRowData {
    [AllDriversColNames.ID]: number;
    [AllDriversColNames.FORNAME]: string;
    [AllDriversColNames.SURNAME]: string;
    [AllDriversColNames.DOB]: Date;
    [AllDriversColNames.NATIONALITY]: string;
    [AllDriversColNames.DRIVERREF]: string;
    [AllDriversColNames.NUMBER]: number;
    [AllDriversColNames.CODE]: string;
}

type TStrongColDef = ColDef<IDriverRowData> & { field: string };

export default function AllDrivers() {
    const gridRef = useRef<AgGridReact<IDriverRowData>>(null);
    const [driversData, setDriversData] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const filterContext = useFilterContext();
    if (!filterContext)
        throw new Error(
            "Filter context is undefined, did you forget to wrap your component in FilterProvider?"
        );

    const { finalizedActiveFilter, setFinalizedActiveFilter } = filterContext;

    const [columnDefs, _] = useState<TStrongColDef[]>([
        { field: AllDriversColNames.ID, cellRenderer: LinkCellRenderer },
        { field: AllDriversColNames.FORNAME },
        { field: AllDriversColNames.SURNAME },
        {
            field: AllDriversColNames.NATIONALITY,
        },
        { field: AllDriversColNames.DRIVERREF, filter: true },
        { field: AllDriversColNames.NUMBER, filter: true },
        { field: AllDriversColNames.DOB, sortable: true, filter: true },
        { field: AllDriversColNames.CODE },
    ]);

    useEffect(() => {
        const filterFromUrl = new URLSearchParams(location.search).get(
            "filter"
        );
        if (filterFromUrl) {
            try {
                const parsedFilter = JSON.parse(filterFromUrl);
                setFinalizedActiveFilter(parsedFilter);
            } catch (err) {
                console.error("Invalid filter query parameter:", err);
            }
        }
    }, []);

    useEffect(() => {
        const serializedFilter = JSON.stringify(finalizedActiveFilter);
        const filterFromUrl = new URLSearchParams(location.search).get(
            "filter"
        );

        const newFilterIsTruthy =
            !!serializedFilter && serializedFilter !== "{}";

        const filterModified =
            newFilterIsTruthy && serializedFilter !== filterFromUrl;

        const filterRemoved = !newFilterIsTruthy && !!filterFromUrl;

        if (filterModified || filterRemoved) {
            const newFilterUrl = newFilterIsTruthy
                ? `?filter=${serializedFilter}`
                : "";
            history.push({
                pathname: location.pathname,
                search: newFilterUrl,
            });
        }
    }, [finalizedActiveFilter, history, location]);

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
                console.error(error);
            });

        return () => {
            isMounted = false;
        };
    }, [finalizedActiveFilter]);

    const fetchData = async () => {
        let url = "https://localhost:7077/drivers";

        const filterQuery = JSON.stringify(finalizedActiveFilter);
        if (!!filterQuery && filterQuery !== "{}") {
            url += `?filter=${filterQuery}`;
        }
        console.log("JOE url = ", url);

        const response = await fetch(url);
        const data = await response.json();
        const uniqueNations = new Set();
        data.forEach((driver: any) => {
            driver.dob = new Date(driver.dob);
            uniqueNations.add(driver.nationality);
        });

        return data;
    };

    return (
        <div className="ag-theme-alpine grid-container">
            <AgGridReact<IDriverRowData>
                ref={gridRef}
                className="inner-grid"
                rowData={driversData}
                columnDefs={columnDefs}
            ></AgGridReact>
        </div>
    );
}
