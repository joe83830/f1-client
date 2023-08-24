import { ReactNode, createContext, useContext, useState } from "react";
import { IConsolidatedFilterModel } from "../../utils/FilterUtils";
import { AllDriversColNames } from "../../constants/ColNames";

export interface IFilterContext {
    finalizedActiveFilter: IConsolidatedFilterModel | undefined;
    activeFilter: IConsolidatedFilterModel | undefined;
    setActiveFilter: React.Dispatch<
        React.SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    setFinalizedActiveFilter: React.Dispatch<
        React.SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    availableFilters: AllDriversColNames[] | undefined;
    availableAggregates: AllDriversColNames[];
    searchCallback: () => void;
}

export const FilterContext = createContext<IFilterContext | undefined>(
    undefined
);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [activeFilter, setActiveFilter] =
        useState<IConsolidatedFilterModel>();
    const [finalizedActiveFilter, setFinalizedActiveFilter] =
        useState<IConsolidatedFilterModel>();

    const handleSearch = () => {
        setFinalizedActiveFilter(activeFilter);
    };
    // To be replaced by backend call
    const availableFilters = [
        AllDriversColNames.SURNAME,
        AllDriversColNames.FORNAME,
        AllDriversColNames.NATIONALITY,
        AllDriversColNames.CODE,
    ];
    const availableAggregates = [] as AllDriversColNames[];

    return (
        <FilterContext.Provider
            value={{
                finalizedActiveFilter,
                activeFilter,
                setActiveFilter,
                setFinalizedActiveFilter,
                availableFilters,
                availableAggregates,
                searchCallback: handleSearch,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => useContext(FilterContext);
