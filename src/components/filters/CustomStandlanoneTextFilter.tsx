import React, { useCallback, useEffect, useState } from "react";

import {
    ComparatorTypeString,
    FilterType,
    IConsolidatedComplexFilter,
    IConsolidatedFilterModel,
    ICustomTextFilter,
    OperatorType,
} from "../../utils/FilterUtils";
import { AllDriversColNames } from "../../constants/ColNames";
import {
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { useFilterContext } from "../providers/FilterProvider";

export interface ICustomStandaloneTextFilterProps {
    fieldName: AllDriversColNames;
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
                finalizedActiveFilter[fieldName as AllDriversColNames.NATIONALITY];
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
                    delete newFilter[fieldName as AllDriversColNames.NATIONALITY];
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

    const handleFilterComparatorChange =
        (index: number) => (event: SelectChangeEvent) => {
            const newComparator = event.target.value as ComparatorTypeString;
            const newFilterObjects = [...filterObjects];
            const targetFilterObj = { ...newFilterObjects[index] };

            if (newComparator !== targetFilterObj.type) {
                targetFilterObj.type = newComparator;
                newFilterObjects[index] = targetFilterObj;
                setFilterObjects(newFilterObjects);
            }
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

    const renderFilterBody = (
        filterObject: ICustomTextFilter,
        index: number
    ) => {
        switch (filterObject.type) {
            case ComparatorTypeString.BLANK:
            case ComparatorTypeString.NOTBLANK:
                return null;
            default:
                return (
                    <TextField
                        size="small"
                        id="outlined-controlled"
                        value={filterObject.filter}
                        onChange={handleFilterTextChange(index)}
                    />
                );
        }
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
                            control={<Radio size="small" />}
                            label="And"
                        />
                        <FormControlLabel
                            value={OperatorType.OR}
                            control={<Radio size="small" />}
                            label="Or"
                        />
                    </RadioGroup>
                </FormControl>
                {filterObjects.map((filterObject, index) => {
                    return (
                        <div key={index}>
                            <FormControl fullWidth>
                                <Select
                                    value={filterObject.type}
                                    onChange={handleFilterComparatorChange(
                                        index
                                    )}
                                    size="small"
                                >
                                    {Object.values(ComparatorTypeString).map(
                                        (comparator) => (
                                            <MenuItem value={comparator}>
                                                {comparator}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                            </FormControl>
                            {renderFilterBody(filterObject, index)}
                            <Button
                                variant="text"
                                onClick={() => handleRemoveCondition(index)}
                                color="error"
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                            >
                                - Remove Condition
                            </Button>
                        </div>
                    );
                })}
                <Button
                    variant="text"
                    onClick={handleAddCondition}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                >
                    + Add Condition
                </Button>
            </div>
        </div>
    );
}
