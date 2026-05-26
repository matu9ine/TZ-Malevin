'use client';

import { useState, FormEvent, useCallback } from 'react';
import { WorkType, JournalEntry, CreateJournalEntryPayload } from '@/lib/api';

interface EntryFormProps {
  workTypes: WorkType[];
  entry: JournalEntry | null;
  onSubmit: (payload: CreateJournalEntryPayload) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function EntryForm({ workTypes, entry, onSubmit, onClose, isSubmitting = false }: EntryFormProps) {
  const [date, setDate] = useState(entry?.date || '');
  const [workTypeId, setWorkTypeId] = useState<number>(entry?.workTypeId || 0);
  const [volume, setVolume] = useState(entry?.volume?.toString() || '');
  const [unit, setUnit] = useState(entry?.unit || '');
  const [executor, setExecutor] = useState(entry?.executor || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Укажите дату';
    if (!workTypeId) errs.workTypeId = 'Выберите вид работ';
    if (!volume || Number(volume) <= 0) errs.volume = 'Укажите объём (> 0)';
    if (!unit.trim()) errs.unit = 'Укажите единицу измерения';
    if (!executor.trim()) errs.executor = 'Укажите исполнителя';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [date, workTypeId, volume, unit, executor]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      date,
      workTypeId,
      volume: Number(volume),
      unit: unit.trim(),
      executor: executor.trim(),
    });
  };

  // Close on Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="form-modal-header">
          <i className={entry ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus-circle'}></i>
          <h2>{entry ? 'Редактировать запись' : 'Новая запись'}</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="date">
              <i className="fa-regular fa-calendar"></i> Дата выполнения
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'date-error' : undefined}
              autoFocus
            />
            {errors.date && <div className="error" id="date-error" role="alert">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="workType">
              <i className="fa-solid fa-wrench"></i> Вид работ
            </label>
            <select
              id="workType"
              value={workTypeId}
              onChange={(e) => setWorkTypeId(Number(e.target.value))}
              aria-invalid={!!errors.workTypeId}
            >
              <option value={0}>— Выберите вид работ —</option>
              {workTypes.map((wt) => (
                <option key={wt.id} value={wt.id}>
                  {wt.name}
                </option>
              ))}
            </select>
            {errors.workTypeId && <div className="error" role="alert">{errors.workTypeId}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="volume">
              <i className="fa-solid fa-cubes"></i> Объём
            </label>
            <input
              id="volume"
              type="number"
              step="0.01"
              min="0"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="Например: 24"
              aria-invalid={!!errors.volume}
            />
            {errors.volume && <div className="error" role="alert">{errors.volume}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="unit">
              <i className="fa-solid fa-ruler"></i> Единица измерения
            </label>
            <input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="м³, м², шт, п.м."
              aria-invalid={!!errors.unit}
            />
            {errors.unit && <div className="error" role="alert">{errors.unit}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="executor">
              <i className="fa-solid fa-user"></i> ФИО исполнителя
            </label>
            <input
              id="executor"
              type="text"
              value={executor}
              onChange={(e) => setExecutor(e.target.value)}
              placeholder="Иванов Иван Иванович"
              aria-invalid={!!errors.executor}
            />
            {errors.executor && <div className="error" role="alert">{errors.executor}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              <i className="fa-solid fa-xmark"></i> Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Сохранение...
                </>
              ) : entry ? (
                <>
                  <i className="fa-solid fa-check"></i> Сохранить
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i> Добавить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
