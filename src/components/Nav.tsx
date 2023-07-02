import { Tab, Tabs } from '@mui/material';
import React, { SyntheticEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const Nav = () => {
  const history = useHistory();
  const location = useLocation();

  // Tabs are zero-indexed. We use a switch statement to convert the path to an index
  const currentTab = (() => {
    switch (location.pathname) {
      case "/driver-search":
        return 1;
      case "/races":
        return 2;
      default: // default to "/all-drivers" if the path is unknown
        return 0;
    }
  })();

  const handleTabChange = (event: SyntheticEvent<Element, Event>, newValue: number) => {
    switch (newValue) {
      case 0:
        history.push("/all-drivers");
        break;
      case 1:
        history.push("/driver-search");
        break;
      case 2:
        history.push("/races");
        break;
      default:
        break;
    }
  };

  return (
    <Tabs value={currentTab} onChange={handleTabChange} orientation='vertical'>
      <Tab label="All Drivers" />
      <Tab label="Driver Search" />
      <Tab label="Races" />
    </Tabs>
  );
};

export default Nav;
