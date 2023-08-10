import { useFilterContext } from "../providers/FilterProvider";
import CustomStandlanoneTextFilter from "./CustomStandlanoneTextFilter";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

export const CustomFilterGroupings = () => {
    const filterContext = useFilterContext();
    if (!filterContext)
        throw new Error(
            "Filter context is undefined, did you forget to wrap your component in FilterProvider?"
        );
    const { availableFilters } = filterContext;

    return (
        <div>
            {(availableFilters || []).map((filter, index) => (
                <Accordion key={index} disableGutters>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography textTransform={'capitalize'}>{filter}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <CustomStandlanoneTextFilter fieldName={filter} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};
