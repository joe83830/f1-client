import { useParams } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { DriverDetailsColNames } from "../constants/ColNames";
import { ColDef } from "ag-grid-community";
import Pagination from "@mui/material/Pagination";
import { useHistory } from "react-router-dom";

type DriverParams = {
    driverId: string;
    pageNumber?: string;
};

export interface IDriverLaptimeRowData {
    [DriverDetailsColNames.LAP]: number;
    [DriverDetailsColNames.LAPTIMEID]: number;
    [DriverDetailsColNames.MILLISECONDS]: number;
    [DriverDetailsColNames.POSITION]: number;
    [DriverDetailsColNames.RACEID]: number;
}

export interface IDriverLaptimeRaceData {
    raceId: number;
    lapTimes: IDriverLaptimeRowData[];
}

export interface IDriverLaptimeMetadata {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export function DriverDetails() {
    const { driverId, pageNumber } = useParams<DriverParams>();
    const [driverRaceData, setDriverRaceData] = useState<
        IDriverLaptimeRaceData[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [name, setName] = useState<string>();
    const [metaData, setMetadata] = useState<IDriverLaptimeMetadata>(
        {} as IDriverLaptimeMetadata
    );
    const history = useHistory();

    const curPage = pageNumber
        ? parseInt(pageNumber)
        : metaData.currentPage || 1;

    const fetchData = async (id: string, page: number) => {
        const response = await fetch(
            `https://localhost:7077/driver/laptimes/${driverId}?page=${curPage}`
        );
        const res = await response.json();
        return res;
    };

    useEffect(() => {
        fetchData(driverId, curPage)
            .then((res) => {
                const { metadata, data, name } = res;
                console.log(metadata, data);
                setDriverRaceData(data);
                setMetadata(metadata);
                setName(name);
                setIsLoading(false);
            })
            .catch((error) => {
                alert("Error fetching driver details.");
                console.error(error);
            });
    }, [driverId, curPage]);

    useEffect(() => {
        console.log("JOE rerender");
    });

    return (
        <div className="driver-details-container">
            <h1 style={{ margin: 0, paddingBottom: "4rem" }}>{name}</h1>
            <div>
                {!isLoading &&
                    driverRaceData.map((race, ind) => (
                        <Fragment key={`${race.raceId}+ind`}>
                            {ind === 0 && <Divider />}
                            <Race driverLaptimeRaceData={race} />
                            <Divider />
                        </Fragment>
                    ))}
            </div>
            <div style={{paddingTop: "4rem"}}>
                <Pagination
                    count={metaData.totalPages}
                    page={metaData.currentPage || 1}
                    onChange={(event, value) => {
                        history.push(`/all-drivers/${driverId}/page/${value}`);
                    }}
                />
            </div>
        </div>
    );
}

interface IRaceData {
    driverLaptimeRaceData: IDriverLaptimeRaceData;
}

function Race(props: IRaceData) {
    const { raceId, lapTimes } = props.driverLaptimeRaceData;
    console.log("JOE rerender RACE");
    const [columnDefs, setColDef] = useState<ColDef<IDriverLaptimeRowData>[]>([
        { field: DriverDetailsColNames.RACEID },
        { field: DriverDetailsColNames.LAP },
        { field: DriverDetailsColNames.POSITION },
        { field: DriverDetailsColNames.MILLISECONDS },
        { field: DriverDetailsColNames.LAPTIMEID },
    ]);

    const [charOptionsState, setChartOptionsState] =
        useState<Highcharts.Options>();

    useEffect(() => {
        setChartOptionsState({
            title: {
                text: "Lap Times",
            },
            xAxis: {
                title: {
                    text: "Lap",
                },
            },
            yAxis: {
                title: {
                    text: "Milliseconds",
                },
            },
            series: [
                {
                    type: "line",
                    name: "Lap Time",
                    data: lapTimes.map((lap) => [lap.lap, lap.milliseconds]),
                },
            ],
        });
    }, [lapTimes]);

    const [displayType, setDisplayType] = useState("grid");
    return (
        <div style={{ width: "100%" }}>
            {/* First Accordion for Highcharts */}
            <Accordion sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{`Race ${raceId}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ paddingBottom: "12px" }}>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={displayType}
                                onChange={() =>
                                    setDisplayType((prevType) =>
                                        prevType === "chart" ? "grid" : "chart"
                                    )
                                }
                                sx={{ flexDirection: "row" }}
                            >
                                <FormControlLabel
                                    value={"grid"}
                                    control={<Radio size="small" />}
                                    label="Grid"
                                />
                                <FormControlLabel
                                    value={"chart"}
                                    control={<Radio size="small" />}
                                    label="Chart"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    {displayType === "chart" ? (
                        <div style={{ maxWidth: "1200px", width: "100%" }}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={charOptionsState}
                            />
                        </div>
                    ) : (
                        <div
                            className="ag-theme-alpine"
                            style={{ maxWidth: "1200px", width: "100%" }}
                        >
                            <AgGridReact
                                rowData={lapTimes}
                                domLayout="autoHeight"
                                columnDefs={columnDefs}
                            />
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
