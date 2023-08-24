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
                <Nav />
                <FilterProvider>
                    <Switch>
                        <Route exact path="/all-drivers">
                            <AllDrivers />
                            <PivotTable />
                        </Route>
                        <Route exact path="/all-drivers/:driverId/page/:pageNumber">
                            <DriverDetails />
                        </Route>
                        <Route exact path="/races">
                            <Races />
                        </Route>
                        <Redirect to="/all-drivers" />
                    </Switch>
                </FilterProvider>
            </div>
        </Router>
    );
}
