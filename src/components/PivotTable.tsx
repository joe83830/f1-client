import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PivotTableChartIcon from "@mui/icons-material/PivotTableChart";
import { CustomFilterGroupings } from "./filters/CustomFilterGroupings";
import { useFilterContext } from "./providers/FilterProvider";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const CustomIconButton = styled(IconButton)({
    "&:hover": {
        backgroundColor: "transparent", // Remove background color on hover
        // Any other styles you want to override or add on hover
    },
});

export default function PivotTable() {
    const filterContext = useFilterContext();
    if (!filterContext)
        throw new Error(
            "Filter context is undefined, did you forget to wrap your component in FilterProvider?"
        );
    const { searchCallback } = filterContext;

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {!open && (
                <CustomIconButton onClick={handleDrawerOpen}>
                    <ChevronLeftIcon />
                </CustomIconButton>
            )}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                    },
                }}
                variant="temporary"
                anchor="right"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronRightIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FilterAltIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Filters"} />
                        </ListItemButton>
                    </ListItem>
                    <CustomFilterGroupings />
                </List>
                {/* <Divider /> */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <PivotTableChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Aggregates"} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Button
                    startIcon={<SearchIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ margin: 2 }}
                    onClick={searchCallback}
                >
                    Search
                </Button>
            </Drawer>
        </Box>
    );
}
