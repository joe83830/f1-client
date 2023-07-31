import { ReactNode, createContext, useContext, useState } from "react";
import { IConsolidatedFilterModel } from "../../utils/FilterUtils";

export interface IFilterContext {
    activeFilter: IConsolidatedFilterModel | undefined;
    setActiveFilter: React.Dispatch<
        React.SetStateAction<IConsolidatedFilterModel | undefined>
    >;
}

export const FilterContext = createContext<IFilterContext | undefined>(
    undefined
);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [activeFilter, setActiveFilter] = useState<IConsolidatedFilterModel>();
  
    return (
      <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
        {children}
      </FilterContext.Provider>
    );
  };
  

export const useFilterContext = () => useContext(FilterContext);
