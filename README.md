<p align="center">
  <img src="https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff" alt="Bun">
  <img src="https://img.shields.io/badge/Elysia-1.4-6B4C8B" alt="Elysia">
  <img src="https://img.shields.io/badge/SOCKS5-✓-brightgreen" alt="SOCKS5">
  <img src="https://img.shields.io/badge/HTTP%20CONNECT-✓-brightgreen" alt="HTTP CONNECT">
  <img src="https://img.shields.io/badge/Docker-✓-2496ED?logo=docker" alt="Docker">
</p>

# open-meteo-proxy

🇬🇧 [English](#english) · 🇷🇺 [Русский](#русский)

---

## English

Minimal HTTP reverse-proxy for [Open-Meteo API](https://open-meteo.com/) with proxy support for bypassing geo-restrictions.

### Features

- ⚡ Single-file Bun + Elysia server
- 🔒 **SOCKS4/SOCKS5** proxy support
- 🔗 **HTTP/HTTPS CONNECT** proxy support
- 🐳 Docker-ready
- ⏱ 15-second upstream timeout
- 🗄 CDN-friendly caching headers (`s-maxage=1800`)

### Quick start

```bash
# Install deps
bun install

# Run without proxy (direct connection)
bun run start

# Run with SOCKS5 proxy
OPEN_METEO_PROXY=socks5://user:pass@proxy.example.com:1080 bun run start

# Run with HTTP CONNECT proxy
OPEN_METEO_PROXY=http://proxy.example.com:3128 bun run start

# Dev mode (hot reload)
bun run dev
```

### Docker

```bash
# Build
docker build -t open-meteo-proxy .

# Run without proxy
docker run -d -p 3001:3001 open-meteo-proxy

# Run with SOCKS5 proxy
docker run -d -p 3001:3001 -e OPEN_METEO_PROXY=socks5://user:pass@proxy.example.com:1080 open-meteo-proxy

# Run with .env file
docker run -d -p 3001:3001 --env-file .env open-meteo-proxy
```

### Usage

```
GET /forecast?latitude=55.75&longitude=37.62
```

All Open-Meteo query parameters (`hourly`, `daily`, `current`, etc.) are passed through.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: `3001`) | Server port |
| `OPEN_METEO_PROXY` | No | Proxy URL (`socks5://...`, `socks4://...`, `http://...`, `https://...`). If unset — direct connection |

### How to change the proxy

Just update `OPEN_METEO_PROXY` and restart:

**Without Docker:**
```bash
OPEN_METEO_PROXY=socks5://new-proxy:1080 bun run start
```

**With Docker:**
```bash
# Stop and remove old container
docker stop open-meteo-proxy && docker rm open-meteo-proxy

# Run with new proxy
docker run -d -p 3001:3001 -e OPEN_METEO_PROXY=socks5://new-proxy:1080 --name open-meteo-proxy open-meteo-proxy
```

Or use `.env` file — change the value there and restart.

### Project structure

```
├── index.ts          # Server entry point (all logic)
├── Dockerfile        # Multi-stage Docker build
├── .env.example      # Environment variables reference
├── undici.d.ts       # Type declarations for undici
├── tsconfig.json
└── package.json
```

### License

MIT

---

## Русский

Минималистичный HTTP reverse-proxy для [Open-Meteo API](https://open-meteo.com/) с поддержкой прокси для обхода гео-блокировок.

### Возможности

- ⚡ Однофайловый Bun + Elysia сервер
- 🔒 Поддержка **SOCKS4/SOCKS5** прокси
- 🔗 Поддержка **HTTP/HTTPS CONNECT** прокси
- 🐳 Готов к Docker
- ⏱ Таймаут апстрима 15 секунд
- 🗄 Кэширующие заголовки для CDN (`s-maxage=1800`)

### Быстрый старт

```bash
# Установка зависимостей
bun install

# Запуск без прокси (прямое соединение)
bun run start

# Запуск с SOCKS5 прокси
OPEN_METEO_PROXY=socks5://user:pass@proxy.example.com:1080 bun run start

# Запуск с HTTP CONNECT прокси
OPEN_METEO_PROXY=http://proxy.example.com:3128 bun run start

# Режим разработки (hot reload)
bun run dev
```

### Docker

```bash
# Сборка
docker build -t open-meteo-proxy .

# Запуск без прокси
docker run -d -p 3001:3001 open-meteo-proxy

# Запуск с SOCKS5 прокси
docker run -d -p 3001:3001 -e OPEN_METEO_PROXY=socks5://user:pass@proxy.example.com:1080 open-meteo-proxy

# Запуск с .env файлом
docker run -d -p 3001:3001 --env-file .env open-meteo-proxy
```

### Использование

```
GET /forecast?latitude=55.75&longitude=37.62
```

Все параметры Open-Meteo (`hourly`, `daily`, `current` и т.д.) передаются как есть.

### Переменные окружения

| Переменная | Обязательно | Описание |
|---|---|---|
| `PORT` | Нет (по умолч.: `3001`) | Порт сервера |
| `OPEN_METEO_PROXY` | Нет | URL прокси (`socks5://...`, `socks4://...`, `http://...`, `https://...`). Если не задана — прямое соединение |

### Как заменить прокси

Поменять `OPEN_METEO_PROXY` и перезапустить:

**Без Docker:**
```bash
OPEN_METEO_PROXY=socks5://новый-прокси:1080 bun run start
```

**С Docker:**
```bash
# Остановить и удалить старый контейнер
docker stop open-meteo-proxy && docker rm open-meteo-proxy

# Запустить с новым прокси
docker run -d -p 3001:3001 -e OPEN_METEO_PROXY=socks5://новый-прокси:1080 --name open-meteo-proxy open-meteo-proxy
```

Или используйте `.env` файл — меняете значение там и перезапускаете.

### Структура проекта

```
├── index.ts          # Точка входа (вся логика)
├── Dockerfile        # Мультистейдж Docker-сборка
├── .env.example      # Пример переменных окружения
├── undici.d.ts       # Тайпинги для undici
├── tsconfig.json
└── package.json
```

### Лицензия

MIT
