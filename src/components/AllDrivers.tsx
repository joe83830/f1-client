import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef, createContext } from "react";
import "/styles/Drivers.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColNames } from "../constants/ColNames";
import CustomTextFilter, {
    TCustomFilterParams,
} from "./filters/CustomTextFilter";
import { useHistory, useLocation } from "react-router-dom";
import { useFilterContext } from "./providers/FilterProvider";

export interface IDriverRowData {
    [ColNames.FORNAME]: string;
    [ColNames.SURNAME]: string;
    [ColNames.DOB]: Date;
    [ColNames.NATIONALITY]: string;
    [ColNames.DRIVERREF]: string;
    [ColNames.NUMBER]: number;
    [ColNames.CODE]: string;
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

    const { activeFilter, setActiveFilter } = filterContext;
    const [columnDefs, _] = useState<TStrongColDef[]>([
        { field: ColNames.FORNAME },
        { field: ColNames.SURNAME },
        {
            field: ColNames.NATIONALITY,
            filter: CustomTextFilter,
            filterParams: {
                maxNumConditions: 5,
                fieldName: ColNames.NATIONALITY,
            } as TCustomFilterParams,
        },
        { field: ColNames.DRIVERREF, filter: true },
        { field: ColNames.NUMBER, filter: true },
        { field: ColNames.DOB, sortable: true, filter: true },
        { field: ColNames.CODE },
    ]);

    useEffect(() => {
        const filterFromUrl = new URLSearchParams(location.search).get(
            "filter"
        );
        if (filterFromUrl) {
            try {
                const parsedFilter = JSON.parse(filterFromUrl);
                setActiveFilter(parsedFilter);
            } catch (err) {
                console.error("Invalid filter query parameter:", err);
            }
        }
    }, []);

    useEffect(() => {
        const serializedFilter = JSON.stringify(activeFilter);
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
    }, [activeFilter, history, location]);

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
    }, [activeFilter]);

    const fetchData = async () => {
        let url = "https://localhost:7077/drivers";

        const filterQuery = JSON.stringify(activeFilter);
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
