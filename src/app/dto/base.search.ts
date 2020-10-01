import { SearchCriteria } from './search.criteria';

export class BaseSearch {
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
    searchTable: string;
    searchCriteria: SearchCriteria[];

    static populateDefaultSearch(): BaseSearch {
        let search = new BaseSearch();
        search.pageIndex = 0;
        search.pageSize = 10;
        search.searchTable = 'todo';
        search.sortField = 'name';
        search.sortType = 'asc';
        return search;
    }
}