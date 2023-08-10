import { ReactNode, createContext, useContext, useState } from "react";
import {
    IConsolidatedFilterModel,
} from "../../utils/FilterUtils";
import { ColNames } from "../../constants/ColNames";

export interface IFilterContext {
    finalizedActiveFilter: IConsolidatedFilterModel | undefined;
    activeFilter: IConsolidatedFilterModel | undefined;
    setActiveFilter: React.Dispatch<
        React.SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    setFinalizedActiveFilter: React.Dispatch<
        React.SetStateAction<IConsolidatedFilterModel | undefined>
    >;
    availableFilters: ColNames[] | undefined;
    availableAggregates: ColNames[];
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
    const availableFilters = [ColNames.SURNAME, ColNames.FORNAME, ColNames.NATIONALITY, ColNames.CODE];
    const availableAggregates = [] as ColNames[];

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
