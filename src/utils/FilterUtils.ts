import { ColNames } from "../constants/ColNames";

export enum FilterType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
}

export enum ComparatorTypeString {
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

export enum ComparatorTypeNumber {
    GREATERTHAN = "greaterThan",
    GREATERTHANOREQUAL = "greaterThanOrEqual",
    LESSTHAN = "lessThan",
    LESSTHANOREQUAL = "lessThanOrEqual",
    EQAULS = "equals",
    NOTEQUAL = "notEqual",
    INRANGE = "inRange",
    BLANK = "blank",
    NOTBLANK = "notBlank",
}

export enum ComparatorTypeDate {
    GREATERTHAN = "greaterThan",
    LESSTHAN = "lessThan",
    EQAULS = "equals",
    NOTEQUAL = "notEqual",
    INRANGE = "inRange",
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
    type: ComparatorTypeDate;
}

export interface INationalityFilter {
    filterType: FilterType;
    type: ComparatorTypeString;
    filter: string;
}

function isComplexFilter<T>(
    filter: T | IComplexFilter<T>
): filter is IComplexFilter<T> {
    return (filter as IComplexFilter<T>).operator !== undefined;
}

function singleConditionQueryString(
    colName: ColNames,
    comparator:
        | ComparatorTypeString
        | ComparatorTypeNumber
        | ComparatorTypeDate,
    filter?: string
): string {
    let conditionQueryString = `${colName}_${comparator}`;
    if (filter) {
        conditionQueryString += `=${filter}`;
    }
    return conditionQueryString;
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
        const joinOperator =
            dateFilter.operator === OperatorType.AND ? "&" : "|";
        dateFilter.conditions.forEach((condition) => {
            switch (condition.type) {
                case ComparatorTypeDate.INRANGE:
                    dateQueryString += `${joinOperator}${singleConditionQueryString(
                        ColNames.DOB,
                        condition.type,
                        condition.dateFrom
                    )}&${singleConditionQueryString(
                        ColNames.DOB,
                        condition.type,
                        condition.dateTo
                    )}`;
                    break;
                case ComparatorTypeDate.BLANK:
                case ComparatorTypeDate.NOTBLANK:
                    dateQueryString += `${joinOperator}${singleConditionQueryString(
                        ColNames.DOB,
                        condition.type
                    )}`;
                    break;
                case ComparatorTypeDate.EQAULS:
                case ComparatorTypeDate.NOTEQUAL:
                case ComparatorTypeDate.GREATERTHAN:
                case ComparatorTypeDate.LESSTHAN:
                    dateQueryString += `${joinOperator}${singleConditionQueryString(
                        ColNames.DOB,
                        condition.type,
                        condition.dateFrom
                    )}`;
                    break;
            }
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
