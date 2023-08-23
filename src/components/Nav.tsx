import { List, ListItemButton, ListItemText } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/App.scss";

const Nav = () => {
    const history = useHistory();
    const location = useLocation();

    const onDriverDetails =
        location.pathname.startsWith("/all-drivers/") &&
        location.pathname !== "/all-drivers";

    const handleItemClick = (path: string) => {
        history.push(path);
    };

    const isActive = (path: string) => {
        if (path === "/all-drivers") {
            return location.pathname === "/all-drivers";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="nav-container">
            <List
                component="nav"
                sx={{ paddingTop: 0, backgroundColor: "WhiteSmoke", height: "100%" }}
            >
                <ListItemButton onClick={() => handleItemClick("/all-drivers")}>
                    <ListItemText
                        primary="All Drivers"
                        primaryTypographyProps={{
                            color: isActive("/all-drivers")
                                ? "primary"
                                : "inherit",
                        }}
                    />
                </ListItemButton>

                {onDriverDetails && (
                    <ListItemButton
                        style={{ paddingLeft: "32px" }}
                        onClick={() => {}}
                    >
                        <ListItemText
                            primary="Driver Details"
                            primaryTypographyProps={{
                                color: isActive(location.pathname)
                                    ? "primary"
                                    : "inherit",
                            }}
                        />
                    </ListItemButton>
                )}

                <ListItemButton onClick={() => handleItemClick("/races")}>
                    <ListItemText
                        primary="Races"
                        primaryTypographyProps={{
                            color: isActive("/races") ? "primary" : "inherit",
                        }}
                    />
                </ListItemButton>
            </List>
        </div>
    );
};

export default Nav;
