import { useParams } from "react-router-dom";
import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type DriverParams = {
    driverId: string;
};

export function DriverDetails() {
    const { driverId } = useParams<DriverParams>();
    return (
        <div className="driver-details-container">
            <h1>Driver details of id: {driverId}</h1>
            <ExpandableRows />
        </div>
    );
}

function ExpandableRows() {
    // Sample data for AG-Grid
    const rowData = [{ name: "John Doe", age: 25 }];

    // Sample options for Highcharts
    const chartOptions = {
        title: {
            text: "Sample Chart",
        },
        series: [
            {
                data: [1, 2, 3, 4, 5],
            },
        ],
    };

    return (
        <div style={{ width: '100%' }}>
            {/* First Accordion for Highcharts */}
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Row 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Second Accordion for AG-Grid */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Row 2</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ width: "100%" }}>
                    <div
                        className="ag-theme-alpine"
                        style={{ height: "500px", width: "100%" }}
                    >
                        <AgGridReact
                            rowData={rowData}
                            domLayout="autoHeight"
                            columnDefs={[
                                { headerName: "Name", field: "name" },
                                { headerName: "Age", field: "age" },
                            ]}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>

            {/* ... Repeat for more rows */}
        </div>
    );
}
