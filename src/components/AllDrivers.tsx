import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useState, useEffect, useRef } from "react";
import "/styles/Drivers.scss";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColNames } from "../constants/ColNames";
import {
    IConsolidatedComplexFilter,
    IConsolidatedFilterModel,
    IDobFilter,
    IFilterModel,
    INationalityFilter,
    OperatorType,
    isComplexFilter,
} from "../filtering/FilterUtils";

export default function AllDrivers() {
    const gridRef = useRef<AgGridReact>(null);

    const [driversData, setDriversData] = useState([]);
    const [activeFilter, setActiveFilter] = useState<IConsolidatedFilterModel>();

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
            const filterModel: IFilterModel =
                gridRef.current.api.getFilterModel();
            console.log("JOE Handle Filter Changed");

            console.log(filterModel);
            const consolidatedFilter: IConsolidatedFilterModel = {};

            for (let key of Object.values(ColNames)) {
                const filterkey = key as keyof IFilterModel;
                if (filterkey in filterModel) {
                    switch (filterkey) {
                        case ColNames.NATIONALITY:
                            const nationalityFilterVal = filterModel[filterkey];
                            let consolidatedNationalityFilterVal: IConsolidatedComplexFilter<INationalityFilter>;

                            if (!!nationalityFilterVal) {
                                if (
                                    !isComplexFilter<INationalityFilter>(
                                        nationalityFilterVal
                                    )
                                ) {
                                    consolidatedNationalityFilterVal = {
                                        filterType:
                                            nationalityFilterVal.filterType,
                                        operator: OperatorType.NONE,
                                        conditions: [nationalityFilterVal],
                                    };
                                } else {
                                    consolidatedNationalityFilterVal = {
                                        filterType:
                                            nationalityFilterVal.filterType,
                                        operator: nationalityFilterVal.operator,
                                        conditions:
                                            nationalityFilterVal.conditions,
                                    };
                                }
                                consolidatedFilter[filterkey] =
                                    consolidatedNationalityFilterVal;
                            }

                            break;
                        case ColNames.DOB:
                            const dobFilterVal = filterModel[filterkey];
                            let consolidatedDobFilterVal: IConsolidatedComplexFilter<IDobFilter>;

                            if (!!dobFilterVal) {
                                if (
                                    !isComplexFilter<IDobFilter>(dobFilterVal)
                                ) {
                                    consolidatedDobFilterVal = {
                                        filterType: dobFilterVal.filterType,
                                        operator: OperatorType.NONE,
                                        conditions: [dobFilterVal],
                                    };
                                } else {
                                    consolidatedDobFilterVal = {
                                        filterType: dobFilterVal.filterType,
                                        operator: dobFilterVal.operator,
                                        conditions: dobFilterVal.conditions,
                                    };
                                }
                                consolidatedFilter[filterkey] =
                                    consolidatedDobFilterVal;
                            }
                            break;
                    }
                }
            }

            setActiveFilter(consolidatedFilter);
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
