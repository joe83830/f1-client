export const buttonStyleOverride = {
    "&:hover": {
        cursor: "default",
        backgroundColor: "transparent",
    },
    "&:active": {
        backgroundColor: "transparent",
    },
}

const drawerWidth = 240;
export const drawerStyleOverride = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerWidth,
    },
}