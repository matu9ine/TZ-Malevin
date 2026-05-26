'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchEntries,
  fetchWorkTypes,
  createEntry,
  updateEntry,
  deleteEntry,
  QueryParams,
  CreateJournalEntryPayload,
} from '@/lib/api';

const JOURNAL_KEY = 'journal-entries';
const WORK_TYPES_KEY = 'work-types';

export function useEntries(params: QueryParams) {
  return useQuery({
    queryKey: [JOURNAL_KEY, params],
    queryFn: () => fetchEntries(params),
  });
}

export function useWorkTypes() {
  return useQuery({
    queryKey: [WORK_TYPES_KEY],
    queryFn: fetchWorkTypes,
    staleTime: 5 * 60 * 1000, // 5 min — rarely changes
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJournalEntryPayload) => createEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_KEY] });
      toast.success('Запись добавлена');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Ошибка при создании записи');
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateJournalEntryPayload> }) =>
      updateEntry(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_KEY] });
      toast.success('Запись обновлена');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Ошибка при обновлении');
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_KEY] });
      toast.success('Запись удалена');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Ошибка при удалении');
    },
  });
}
