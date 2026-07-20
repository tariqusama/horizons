import api from '../api';

export interface SearchResults {
    users: any[];
    cases: any[];
    tickets: any[];
}

export const globalSearch = async (query: string): Promise<SearchResults> => {
    const response = await api.get('/admin/search', { params: { q: query } });
    return response.data;
};
