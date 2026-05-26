# Журнал работ на строительном объекте

Веб-приложение для ведения учёта выполненных работ на строительном объекте.

## Стек технологий

| Слой | Технология | Почему |
|------|-----------|--------|
| Фронтенд | **Next.js 14 + React 18 + TypeScript** | App Router, SSR-ready, удобная маршрутизация «из коробки» |
| Стейт-менеджмент | **TanStack React Query** | Кеширование, автоматическая инвалидация, оптимистичные обновления |
| Бэкенд | **NestJS + TypeScript** | Модульная архитектура, DI-контейнер, встроенная валидация, Swagger |
| ORM | **TypeORM** | Декораторы, миграции, хорошая интеграция с NestJS |
| БД | **PostgreSQL 16** | Надёжная реляционная СУБД, подходит для структурированных данных |
| HTTP-клиент | **Axios** | Интерцепторы, поддержка TypeScript, обработка ошибок |
| Документация API | **Swagger / OpenAPI** | Автогенерация документации из декораторов |
| Безопасность | **Helmet + Throttler** | Security headers, rate limiting |
| Контейнеризация | **Docker + Docker Compose** | Запуск всего стека одной командой |

## Функциональность

- ✅ Список записей журнала с пагинацией
- ✅ Добавление записи с валидацией (фронт + бэк)
- ✅ Редактирование записи
- ✅ Удаление записи с подтверждением
- ✅ Фильтрация по дате (от/до) с debounce
- ✅ Сортировка по дате
- ✅ Справочник видов работ (предзаполненный список в БД)
- ✅ Toast-уведомления об успехе/ошибке
- ✅ Error Boundary для graceful error handling
- ✅ Swagger документация API
- ✅ Rate limiting (защита от DDoS)
- ✅ Health check endpoint
- ✅ Стандартизированные API-ответы (envelope pattern)
- ✅ Логирование запросов
- ✅ ARIA-атрибуты для accessibility

## Архитектурные решения

- **API Versioning** (`/api/v1/`) — возможность развивать API без breaking changes
- **Global Exception Filter** — единообразная обработка ошибок
- **Transform Interceptor** — все ответы обёрнуты в `{ success, data, timestamp }`
- **Config Module** — конфигурация через env-переменные, без хардкода
- **React Query** — серверный стейт отделён от UI-стейта, автоматический refetch
- **Debounced фильтры** — запросы не летят на каждый keystroke

## Запуск

### Вариант 1: Docker Compose (рекомендуется)

```bash
docker-compose up --build
```

После запуска:
- Фронтенд: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs

### Вариант 2: Локальный запуск

**Требования:** Node.js 18+, PostgreSQL

1. Создайте БД:
```bash
createdb work_journal
```

2. Запустите бэкенд:
```bash
cd backend
npm install
npm run start:dev
```

3. Запустите фронтенд:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

Полная документация доступна в Swagger: `/api/docs`

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/v1/journal` | Список записей (пагинация, фильтры) |
| GET | `/api/v1/journal/:id` | Одна запись |
| POST | `/api/v1/journal` | Создать запись |
| PUT | `/api/v1/journal/:id` | Обновить запись |
| DELETE | `/api/v1/journal/:id` | Удалить запись |
| GET | `/api/v1/work-types` | Справочник видов работ |
| GET | `/api/v1/health` | Health check |

## Структура проекта

```
├── backend/
│   └── src/
│       ├── common/          # Фильтры, интерцепторы, DTO
│       │   ├── dto/         # PaginationDto
│       │   ├── filters/     # HttpExceptionFilter
│       │   └── interceptors/# Logging, Transform
│       ├── config/          # Database, App config
│       ├── health/          # Health check module
│       ├── journal/         # Записи журнала (CRUD)
│       └── work-type/       # Справочник видов работ
├── frontend/
│   └── src/
│       ├── app/             # Next.js App Router
│       ├── components/      # UI-компоненты
│       ├── hooks/           # Custom hooks (useJournal, useDebounce)
│       └── lib/             # API-клиент, providers
├── docker-compose.yml
└── README.md
```
