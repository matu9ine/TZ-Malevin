'use client';

import { useState, useMemo } from 'react';
import { useEntries, useWorkTypes, useCreateEntry, useUpdateEntry, useDeleteEntry } from '@/hooks/useJournal';
import { useDebounce } from '@/hooks/useDebounce';
import { JournalEntry, CreateJournalEntryPayload } from '@/lib/api';
import { EntryForm } from '@/components/EntryForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Pagination } from '@/components/Pagination';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function HomePage() {
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);

  const debouncedDateFrom = useDebounce(dateFrom, 500);
  const debouncedDateTo = useDebounce(dateTo, 500);

  // Queries
  const queryParams = useMemo(
    () => ({
      page,
      limit: 15,
      dateFrom: debouncedDateFrom || undefined,
      dateTo: debouncedDateTo || undefined,
      sort: sortOrder,
    }),
    [page, debouncedDateFrom, debouncedDateTo, sortOrder],
  );

  const { data: entriesData, isLoading, isError, error } = useEntries(queryParams);
  const { data: workTypes = [] } = useWorkTypes();

  // Mutations
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry();
  const deleteMutation = useDeleteEntry();

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const entries = entriesData?.data || [];
  const meta = entriesData?.meta;

  const handleCreate = async (payload: CreateJournalEntryPayload) => {
    await createMutation.mutateAsync(payload);
    setShowForm(false);
  };

  const handleUpdate = async (payload: CreateJournalEntryPayload) => {
    if (!editingEntry) return;
    await updateMutation.mutateAsync({ id: editingEntry.id, payload });
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const openEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  // Stats
  const todayEntries = entries.filter(
    (e) => e.date === new Date().toISOString().split('T')[0],
  ).length;
  const uniqueExecutors = new Set(entries.map((e) => e.executor)).size;

  return (
    <ErrorBoundary>
      <header className="header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fa-solid fa-helmet-safety"></i>
          </div>
          <div>
            <h1>Журнал работ</h1>
            <p>Учёт выполненных работ на строительном объекте</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon blue">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <div>
              <div className="stat-value">{meta?.total ?? 0}</div>
              <div className="stat-label">Всего записей</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <div className="stat-value">{todayEntries}</div>
              <div className="stat-label">Сегодня</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <div className="stat-value">{uniqueExecutors}</div>
              <div className="stat-label">Исполнителей</div>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="filters">
            <div className="form-group">
              <label><i className="fa-regular fa-calendar"></i> Дата с</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              />
            </div>
            <div className="form-group">
              <label><i className="fa-regular fa-calendar"></i> Дата по</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              />
            </div>
            <div className="form-group">
              <label><i className="fa-solid fa-arrow-down-short-wide"></i> Сортировка</label>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value as 'ASC' | 'DESC'); setPage(1); }}
              >
                <option value="DESC">Сначала новые</option>
                <option value="ASC">Сначала старые</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fa-solid fa-plus"></i> Добавить запись
          </button>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <i className="fa-solid fa-spinner"></i>
            <p>Загрузка данных...</p>
          </div>
        ) : isError ? (
          <div className="empty-state">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>Ошибка загрузки</p>
            <span>{(error as Error)?.message || 'Попробуйте позже'}</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <i className="fa-regular fa-folder-open"></i>
            <p>Записей пока нет</p>
            <span>Нажмите «Добавить запись», чтобы начать</span>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th><i className="fa-regular fa-calendar"></i> Дата</th>
                    <th><i className="fa-solid fa-wrench"></i> Вид работ</th>
                    <th><i className="fa-solid fa-cubes"></i> Объём</th>
                    <th><i className="fa-solid fa-user"></i> Исполнитель</th>
                    <th><i className="fa-solid fa-gear"></i> Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="cell-date">
                        {new Date(entry.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="cell-work-type">{entry.workType?.name || '—'}</td>
                      <td className="cell-volume">
                        {entry.volume} {entry.unit}
                      </td>
                      <td>
                        <span className="cell-executor">
                          <i className="fa-regular fa-user"></i>
                          {entry.executor}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn btn-secondary btn-icon"
                            onClick={() => openEdit(entry)}
                            title="Редактировать"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
                            onClick={() => setDeletingId(entry.id)}
                            title="Удалить"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && <Pagination meta={meta} onPageChange={setPage} />}
          </>
        )}

        {showForm && (
          <EntryForm
            workTypes={workTypes}
            entry={editingEntry}
            onSubmit={editingEntry ? handleUpdate : handleCreate}
            onClose={closeForm}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        )}

        {deletingId !== null && (
          <ConfirmDialog
            title="Удалить запись?"
            message="Это действие нельзя отменить. Запись будет удалена навсегда."
            onConfirm={handleDelete}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
