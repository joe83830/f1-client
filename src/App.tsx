import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Drivers from "./Drivers";
import "./App.scss";

export default function Application() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Drivers />
                </Route>
            </Switch>
        </Router>
    );
}
