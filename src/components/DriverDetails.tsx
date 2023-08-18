import { useParams } from "react-router-dom";

type DriverParams = {
    driverId: string;
  };

export function DriverDetails() {

    const { driverId } = useParams<DriverParams>();
    return (<h1>Driver details of id: {driverId}</h1>)
}
