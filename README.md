# 🎬 CineLog — Catalogo Personal de Peliculas

App web para gestionar tu catalogo personal de peliculas. Registra, califica y organiza lo que viste y lo que queres ver.

## Demo
[Ver app en produccion](https://cinelog.vercel.app)

---

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS v3 |
| Auth + DB | Supabase |
| Routing | React Router v6 |
| API externa | TMDB API |
| Deploy | Vercel |

---

## Funcionalidades

- Registro, login y logout
- CRUD completo de peliculas
- Busqueda en tiempo real y filtros por estado y genero
- Marcar peliculas como vistas o pendientes
- Foto de perfil con Supabase Storage
- Autocompletado de datos desde TMDB
- Estadisticas personales con graficos

---

## Setup local

```bash
git clone https://github.com/tu-usuario/movie-catalog.git
cd movie-catalog
npm install
npm run dev
```

Copiar `.env.example` a `.env` y completar las variables de Supabase y TMDB.

---

## Convencion de ramas

| Prefijo | Uso |
|--------|-----|
| `feature/` | Nueva funcionalidad |
| `fix/` | Correccion de bug |
| `chore/` | Configuracion |
| `docs/` | Documentacion |

Ningun cambio va directo a main, todo pasa por PR con revision del otro integrante.

---

## CI/CD

El pipeline corre en cada push a main: lint → tests unitarios → build.

en calidad.md hay mas detalle