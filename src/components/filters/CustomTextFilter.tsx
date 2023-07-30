import React, {
    Dispatch,
    SetStateAction,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import debounce from "lodash.debounce";

import { IFilterParams, IDoesFilterPassParams } from "ag-grid-community";
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
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { IDriverRowData } from "../AllDrivers";

export interface IMyFilterParams {
    setActiveFilter: Dispatch<
        SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    curActiveFilter: IConsolidatedFilterModel | undefined;
    maxNumConditions: number;
    fieldName: ColNames;
}

export type TCustomFilterParams = IFilterParams<IDriverRowData> & IMyFilterParams;

export default forwardRef((props: TCustomFilterParams, ref) => {
    const [filterObjects, setFilterObjects] = useState<ICustomTextFilter[]>([
        {
            filterType: FilterType.TEXT,
            type: ComparatorTypeString.CONTAINS,
            filter: "",
        },
    ]);
    const [joinOperator, setJoinOperator] = useState<OperatorType>(
        OperatorType.AND
    );

    useImperativeHandle(ref, () => {
        return {
            doesFilterPass(_: IDoesFilterPassParams) {
                return true;
            },

            isFilterActive() {
                return filterObjects.some(
                    (filterObject) => filterObject.filter !== ""
                );
            },

            getModel() {
                if (!this.isFilterActive()) {
                    return null;
                }

                return { value: filterObjects };
            },

            setModel(model: any) {
                setFilterObjects(model == null ? [] : model.value);
            },
        };
    });

    const debouncedSetFilter = useCallback(
        debounce(
            (filterObjs: ICustomTextFilter[], joinOperator: OperatorType) => {
                const nonEmptyFilterObjs = filterObjs.filter(
                    (filterobj) => filterobj.filter !== ""
                );
                console.log("JOE nonEmptyFilterObjs", nonEmptyFilterObjs);
                if (nonEmptyFilterObjs.length === 0) {
                    if (!!props.curActiveFilter) {
                        const newFilter = { ...props.curActiveFilter };
                        delete newFilter[props.fieldName as ColNames.NATIONALITY];
                        props.setActiveFilter(newFilter);
                    } else {
                        props.setActiveFilter(undefined);
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
                    [props.fieldName]: additionalFilter,
                };

                if (!!props.curActiveFilter) {
                    newFilter = Object.assign(props.curActiveFilter, newFilter);
                }

                props.setActiveFilter(newFilter);
            },
            500
        ),
        []
    );

    useEffect(() => {
        debouncedSetFilter(filterObjects, joinOperator);
    }, [filterObjects, joinOperator]);

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
                        <div>
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
});
