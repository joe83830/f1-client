import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import AllDrivers from "./components/AllDrivers";
import "./styles/App.scss";
import Nav from "./components/Nav";
import DriverSearch from "./components/DriverSearch";
import Races from "./components/Races";
import { FilterProvider } from "./components/providers/FilterProvider";
import PivotTable from "./components/PivotTable";
import { DriverDetails } from "./components/DriverDetails";

export default function Application() {
    return (
        <Router>
            <div className="app">
                <div className="content-container">
                    <Nav />
                    <FilterProvider>
                        <Switch>
                            <Route exact path="/all-drivers">
                                <AllDrivers />
                            </Route>
                            <Route exact path="all-drivers/:driverId">
                                <DriverDetails />
                            </Route>
                            <Route exact path="/driver-search">
                                <DriverSearch />
                            </Route>
                            <Route exact path="/races">
                                <Races />
                            </Route>
                            <Redirect to="/all-drivers" />
                        </Switch>
                        <PivotTable />
                    </FilterProvider>
                </div>
            </div>
        </Router>
    );
}
