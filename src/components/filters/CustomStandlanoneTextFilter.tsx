import React, { useCallback, useEffect, useState } from "react";

import {
    ComparatorTypeString,
    FilterType,
    IConsolidatedComplexFilter,
    IConsolidatedFilterModel,
    ICustomTextFilter,
    OperatorType,
} from "../../utils/FilterUtils";
import { ColNames } from "../../constants/ColNames";
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { useFilterContext } from "../providers/FilterProvider";

export interface ICustomStandaloneTextFilterProps {
    fieldName: ColNames;
}
export default function CustomStandaloneTextFilter(
    props: ICustomStandaloneTextFilterProps
) {
    const { fieldName } = props;
    const filterContext = useFilterContext();
    if (!filterContext)
        throw new Error(
            "Filter context is undefined, did you forget to wrap your component in FilterProvider?"
        );

    const { activeFilter, setActiveFilter, finalizedActiveFilter } =
        filterContext;
    const [filterObjects, setFilterObjects] = useState<ICustomTextFilter[]>([]);
    const [joinOperator, setJoinOperator] = useState<OperatorType>(
        OperatorType.AND
    );

    useEffect(() => {
        if (!!finalizedActiveFilter) {
            const initialFilterObj =
                finalizedActiveFilter[fieldName as ColNames.NATIONALITY];
            if (!!initialFilterObj) {
                setFilterObjects(initialFilterObj.conditions);
                setJoinOperator(initialFilterObj.operator);
            }
        }
    }, []);

    useEffect(() => {
        persistFilter(filterObjects, joinOperator);
    }, [filterObjects, joinOperator]);

    const persistFilter = useCallback(
        (filterObjs: ICustomTextFilter[], joinOperator: OperatorType) => {
            const nonEmptyFilterObjs = filterObjs.filter(
                (filterobj) => filterobj.filter !== ""
            );

            if (nonEmptyFilterObjs.length === 0) {
                if (!!activeFilter) {
                    const newFilter = { ...activeFilter };
                    delete newFilter[fieldName as ColNames.NATIONALITY];
                    setActiveFilter(newFilter);
                } else {
                    setActiveFilter(undefined);
                }
                return;
            }

            const additionalFilter: IConsolidatedComplexFilter<ICustomTextFilter> =
                {
                    filterType: FilterType.TEXT,
                    operator: joinOperator,
                    conditions: nonEmptyFilterObjs,
                };

            let newFilter: IConsolidatedFilterModel = {
                [fieldName]: additionalFilter,
            };

            if (!!activeFilter) {
                newFilter = { ...activeFilter, ...newFilter };
            }
            setActiveFilter(newFilter);
        },
        [activeFilter]
    );

    const handleJoinOperatorChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setJoinOperator(event.target.value as OperatorType);
    };

    const handleFilterTextChange = (index: number) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const newFilterObjects = [...filterObjects];
            newFilterObjects[index].filter = event.target.value;
            setFilterObjects(newFilterObjects);
        };
    };

    const handleAddCondition = () => {
        setFilterObjects([
            ...filterObjects,
            {
                filterType: FilterType.TEXT,
                type: ComparatorTypeString.CONTAINS,
                filter: "",
            },
        ]);
    };

    const handleRemoveCondition = (index: number) => {
        const newFilterObjects = [...filterObjects];
        newFilterObjects.splice(index, 1);
        setFilterObjects(newFilterObjects);
    };

    return (
        <div style={{ padding: 4, width: 200 }}>
            <div>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={joinOperator}
                        onChange={handleJoinOperatorChange}
                        sx={{ flexDirection: "row" }}
                    >
                        <FormControlLabel
                            value={OperatorType.AND}
                            control={<Radio />}
                            label="AND"
                        />
                        <FormControlLabel
                            value={OperatorType.OR}
                            control={<Radio />}
                            label="OR"
                        />
                    </RadioGroup>
                </FormControl>
                {filterObjects.map((filterObject, index) => {
                    return (
                        <div key={index}>
                            <TextField
                                id="outlined-controlled"
                                value={filterObject.filter}
                                onChange={handleFilterTextChange(index)}
                            />
                            <Button
                                variant="text"
                                onClick={() => handleRemoveCondition(index)}
                                color="error"
                            >
                                - Remove Condition
                            </Button>
                        </div>
                    );
                })}
                <Button variant="text" onClick={handleAddCondition}>
                    + Add Condition
                </Button>
            </div>
        </div>
    );
}
