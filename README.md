# 🔐 Fullstack Authentication System

Веб-приложение с системой аутентификации, разделением ролей и личным кабинетом, развёртываемое с помощью Docker Compose.

Проект состоит из трёх частей:

- **Backend** — REST API на Django REST Framework
- **Frontend** — Клиентское приложение на Next.js
- **Database** — PostgreSQL

---

## 🌟 Функционал

- **Регистрация и Авторизация** — Безопасная аутентификация через JWT-токены с автоматическим входом после регистрации.
- **Ролевая модель** — Разделение прав доступа на обычных пользователей (`user`) и администраторов (`admin`).
- **Личный кабинет (Dashboard)**:
  - Просмотр и управление личным профилем.
  - Удаление собственного аккаунта.
- **Панель администратора**:
  - Список всех зарегистрированных пользователей.
  - Сортировка таблицы по ID, имени, email и роли.
  - Удаление пользователей (администратор не может удалить другого администратора).

---

## 🛠 Tech Stack

### Backend

| Технология           | Описание                 |
| -------------------- | ------------------------ |
| **Python 3.x**       | Основной язык            |
| **Django** + **DRF** | Веб-фреймворк и REST API |
| **Simple JWT**       | JWT-аутентификация       |
| **PostgreSQL**       | Реляционная база данных  |

### Frontend

| Технология       | Описание                             |
| ---------------- | ------------------------------------ |
| **Next.js 14+**  | React-фреймворк (App Router)         |
| **Tailwind CSS** | Стилизация интерфейсов               |
| **Axios**        | HTTP-клиент с перехватчиками токенов |

### Инфраструктура

| Технология                      | Описание                        |
| ------------------------------- | ------------------------------- |
| **Docker** + **Docker Compose** | Контейнеризация и развёртывание |

---

## 🚀 Запуск проекта (Docker Compose)

> **Рекомендуемый способ запуска.** Docker автоматически поднимет PostgreSQL, Backend и Frontend.

Убедитесь, что у вас установлен [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Клонируйте репозиторий и перейдите в папку проекта:

```bash
git clone <url-репозитория>
cd Project_1
```

Запустите все сервисы одной командой:

```bash
docker compose up --build
```

После успешной сборки и запуска:

- **Frontend** будет доступен по адресу: http://localhost:3000
- **Backend API** будет доступен по адресу: http://localhost:8000
- **PostgreSQL** будет доступна на порту `5433` (снаружи) и `5432` (внутри сети Docker)

---

## 👤 Создание администратора

После первого запуска проекта необходимо создать суперпользователя (администратора).

Выполните команду в новом терминале:

```bash
docker compose exec backend python manage.py createsuperuser
```

Вам будет предложено ввести:

- **Email** — адрес электронной почты
- **Username** — имя пользователя
- **Name** — отображаемое имя
- **Password** — пароль (минимум 8 символов)

После создания администратора:

- **Django Admin Panel** будет доступна по адресу: http://localhost:8000/admin
- **Dashboard** с правами администратора откроет доступ к управлению пользователями

---

## 🔗 Основные URL

| Сервис       | URL                         |
| ------------ | --------------------------- |
| Frontend     | http://localhost:3000       |
| Backend API  | http://localhost:8000       |
| Django Admin | http://localhost:8000/admin |

### API Endpoints

| Метод    | Endpoint           | Описание                     | Доступ         |
| -------- | ------------------ | ---------------------------- | -------------- |
| `POST`   | `/api/register/`   | Регистрация пользователя     | Публичный      |
| `POST`   | `/api/login/`      | Получение JWT токенов        | Публичный      |
| `GET`    | `/api/me/`         | Данные текущего пользователя | Авторизованный |
| `GET`    | `/api/users/`      | Список всех пользователей    | Только `admin` |
| `DELETE` | `/api/users/<id>/` | Удаление пользователя        | Только `admin` |

---

## 📦 Docker Services

Проект состоит из трёх контейнеров:

| Контейнер  | Описание               | Порт            |
| ---------- | ---------------------- | --------------- |
| `frontend` | Next.js приложение     | `3000`          |
| `backend`  | Django REST API        | `8000`          |
| `db`       | PostgreSQL база данных | `5433` → `5432` |

### Управление контейнерами

Запустить проект:

```bash
docker compose up --build
```

Остановить проект:

```bash
docker compose down
```

Пересобрать и перезапустить проект:

```bash
docker compose up --build
```

Посмотреть логи:

```bash
docker compose logs -f
```

Зайти в оболочку контейнера:

```bash
docker compose exec backend bash
docker compose exec frontend sh
```

---

## 🛠 Запуск без Docker (Локально)

Если вы хотите запустить сервисы вручную для разработки.

### 1. Backend

Перейдите в папку `backend`:

```bash
cd backend
```

Создайте и активируйте виртуальное окружение:

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Примените миграции и запустите сервер:

```bash
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

Откройте новый терминал и перейдите в папку `frontend`:

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Тестирование

Тесты покрывают ключевые сценарии: регистрацию, авторизацию, защищённые маршруты и права доступа.

Запуск тестов (через Docker):

```bash
docker compose exec backend python manage.py test users.tests.UserFlowTests
```

Запуск тестов (локально):

```bash
cd backend
source venv/bin/activate
python manage.py test users.tests.UserFlowTests
```

### Покрытие тестов

| Тест                        | Описание                            |
| --------------------------- | ----------------------------------- |
| `test_user_registration`    | Регистрация нового пользователя     |
| `test_user_login`           | Авторизация и получение JWT         |
| `test_protected_access`     | Доступ к защищённым данным          |
| `test_user_list_admin_only` | Список пользователей (только admin) |

---

## 📁 Структура проекта

```
Project_1/
├── backend/                # Django REST API
│   ├── users/              # Приложение аутентификации
│   │   ├── models.py       # Модель пользователя
│   │   ├── views.py        # API-вьюхи
│   │   ├── serializers.py  # Сериализаторы
│   │   └── tests.py        # Тесты (UserFlowTests)
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # Next.js приложение
│   ├── app/                # App Router страницы
│   │   ├── page.tsx        # Главная страница
│   │   ├── login/          # Страница входа
│   │   ├── register/       # Страница регистрации
│   │   └── dashboard/      # Личный кабинет
│   └── package.json
├── docker-compose.yml      # Конфигурация Docker
└── README.md
```
