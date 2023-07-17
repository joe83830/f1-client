import { ColNames } from "../constants/ColNames";

export enum FilterType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
}

export enum ComparatorType {
    CONTAINS = "contains",
    NOTCONTAINS = "notContains",
    GREATERTHAN = "greaterThan",
    EQAULS = "equals",
    NOTEQUAL = "notEqual",
    STARTSWITH = "startsWith",
    ENDSWITH = "endsWith",
    BLANK = "blank",
    NOTBLANK = "notBlank",
}

export enum OperatorType {
    AND = "AND",
    OR = "OR",
}

export interface IFilterModel {
    [ColNames.NATIONALITY]?:
        | INationalityFilter
        | IComplexFilter<INationalityFilter>;
    [ColNames.DOB]?: IDobFilter | IComplexFilter<IDobFilter>;
}

export interface IComplexFilter<T> {
    filterType: FilterType;
    operator: OperatorType;
    condition1: T;
    condition2: T;
    conditions: T[];
}
export interface IDobFilter {
    dateFrom: string;
    dateTo?: string;
    filterType: FilterType;
    type: ComparatorType;
}

export interface INationalityFilter {
    filterType: FilterType;
    type: ComparatorType;
    filter: string;
}

function isComplexFilter<T>(
    filter: T | IComplexFilter<T>
): filter is IComplexFilter<T> {
    return (filter as IComplexFilter<T>).operator !== undefined;
}

export function completeFilterQueryString(filterModel: IFilterModel): string {
    let queryString = "";

    return (
        queryString +
        dateFilterQueryString(filterModel.dob) +
        nationalityFilterQueryString(filterModel.nationality)
    );
}

export function dateFilterQueryString(
    dateFilter: IDobFilter | IComplexFilter<IDobFilter> | undefined
): string {
    if (!dateFilter) {
        return "";
    }

    let dateQueryString = "";
    if (isComplexFilter(dateFilter)) {
        dateFilter.conditions.forEach((condition) => {
            
        });
    }
    return "";
}

export function nationalityFilterQueryString(
    nationalityFilter:
        | INationalityFilter
        | IComplexFilter<INationalityFilter>
        | undefined
): string {
    if (!nationalityFilter) {
        return "";
    }

    return "";
}
