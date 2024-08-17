export declare enum QuerySortTypeEnum {
    ASC = "ASC",
    DESC = "DESC"
}
export type QuerySortType = 'ASC' | 'DESC';
export declare class PagingDto<T = any> {
    limit: number;
    page: number;
    search?: string;
    orderBy?: keyof T;
    orderType?: QuerySortType;
    createdBy: string;
}
