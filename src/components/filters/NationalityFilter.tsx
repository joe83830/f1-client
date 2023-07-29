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
import { ComparatorTypeString, FilterType, IConsolidatedComplexFilter, IConsolidatedFilterModel, INationalityFilter, OperatorType } from "../../utils/FilterUtils";
import { ColNames } from "../../constants/ColNames";

export interface IMyFilterParams {
    setActiveFilter: Dispatch<
        SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    curActiveFilter: IConsolidatedFilterModel | undefined;
    maxNumConditions: number;
}

export type TCustomFilterParams = IFilterParams & IMyFilterParams;

export default forwardRef((props: TCustomFilterParams, ref) => {
    const [filterText, setFilterText] = useState("");

    useImperativeHandle(ref, () => {
        return {
            doesFilterPass(_: IDoesFilterPassParams) {
                return true;
            },

            isFilterActive() {
                return filterText != null && filterText !== "";
            },

            getModel() {
                if (!this.isFilterActive()) {
                    return null;
                }

                return { value: filterText };
            },

            setModel(model: any) {
                setFilterText(model == null ? null : model.value);
            },
        };
    });

    const onChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setFilterText(event.target.value);
    };

    const debouncedSetFilter = useCallback(debounce((filterText: string) => {
        const additionalFilter: IConsolidatedComplexFilter<INationalityFilter> = {
            filterType: FilterType.TEXT,
            operator: OperatorType.OR,
            conditions: [{
                filterType: FilterType.TEXT,
                type: ComparatorTypeString.CONTAINS,
                filter: filterText,
            }]
        }

        let newFilter: IConsolidatedFilterModel = {
            [ColNames.NATIONALITY]: additionalFilter
        }

        if (!!props.curActiveFilter) {
            newFilter = Object.assign(props.curActiveFilter, newFilter);

        }

        props.setActiveFilter(newFilter);
    }, 5000), []);

    useEffect(() => {
        debouncedSetFilter(filterText);
    }, [filterText]);

    return (
        <div style={{ padding: 4, width: 200 }}>
            <div style={{ fontWeight: "bold" }}>Custom Athlete Filter</div>
            <div>
                <input
                    style={{ margin: "4 0 4 0" }}
                    type="text"
                    value={filterText}
                    onChange={onChange}
                    placeholder="Full name search..."
                />
            </div>
            <div style={{ marginTop: 20 }}>
                This filter does partial word search on multiple words, eg "mich
                phel" still brings back Michael Phelps.
            </div>
            <div style={{ marginTop: 20 }}>
                Just to emphasise that anything can go in here, here is an
                image!!
            </div>
            <div>
                <img
                    src="https://www.ag-grid.com/images/ag-Grid2-200.png"
                    style={{
                        width: 150,
                        textAlign: "center",
                        padding: 10,
                        margin: 10,
                        border: "1px solid lightgrey",
                    }}
                />
            </div>
        </div>
    );
});
