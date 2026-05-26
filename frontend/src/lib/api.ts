import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1',
  timeout: 10000,
});

// Response interceptor — unwrap { success, data } envelope
api.interceptors.response.use(
  (response) => {
    if (response.data?.success && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError<{ message: string; errors?: string[] }>) => {
    const message =
      error.response?.data?.message || error.message || 'Произошла ошибка';
    return Promise.reject(new Error(message));
  },
);

export interface WorkType {
  id: number;
  name: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  workType: WorkType;
  workTypeId: number;
  volume: number;
  unit: string;
  executor: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateJournalEntryPayload {
  date: string;
  workTypeId: number;
  volume: number;
  unit: string;
  executor: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'ASC' | 'DESC';
}

export const fetchEntries = async (
  params?: QueryParams,
): Promise<PaginatedResponse<JournalEntry>> => {
  const { data } = await api.get('/journal', { params });
  return data;
};

export const fetchEntry = async (id: number): Promise<JournalEntry> => {
  const { data } = await api.get(`/journal/${id}`);
  return data;
};

export const createEntry = async (
  payload: CreateJournalEntryPayload,
): Promise<JournalEntry> => {
  const { data } = await api.post('/journal', payload);
  return data;
};

export const updateEntry = async (
  id: number,
  payload: Partial<CreateJournalEntryPayload>,
): Promise<JournalEntry> => {
  const { data } = await api.put(`/journal/${id}`, payload);
  return data;
};

export const deleteEntry = async (id: number): Promise<void> => {
  await api.delete(`/journal/${id}`);
};

export const fetchWorkTypes = async (): Promise<WorkType[]> => {
  const { data } = await api.get('/work-types');
  return data;
};
