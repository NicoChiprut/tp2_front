# 🎬 CineLog — Catálogo Personal de Películas

Aplicación web serverless para gestionar tu catálogo personal de películas.
Registrá, calificá, reseñá y organizá todo lo que viste y lo que querés ver.

## 🚀 Demo
[Ver aplicación en producción](https://cinelog.vercel.app)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React 18 + Vite | SPA con HMR y build optimizado. React elegido sobre Astro por mejor manejo de estado reactivo en una app CRUD compleja. |
| **Estilos** | Tailwind CSS v3 | Utility-first, sin CSS extra, purge automático, variables de diseño centralizadas. |
| **Auth + DB** | Supabase | PostgreSQL + Auth + Storage + RLS en una sola plataforma serverless. Elegido sobre Firebase por modelo relacional y SQL estándar. |
| **Routing** | React Router v6 | Estándar de facto para SPAs con React, soporte de rutas protegidas con guards. |
| **CDN/Storage** | Supabase Storage | Almacenamiento de avatares de usuario con URLs públicas. Integrado en la misma plataforma. |
| **API externa** | TMDB API | Autocompletado de datos de películas (título, año, director, poster). Gratuita y con amplia base de datos. |
| **Deploy** | Vercel | CI/CD desde GitHub, edge network global, variables de entorno seguras, preview deployments. |

### ¿Por qué Supabase sobre Firebase?
- **PostgreSQL** (relacional) permite queries complejos y filtros que Firestore no soporta bien nativamente.
- **Row Level Security** implementada en la base de datos, no en el frontend.
- **Storage integrado** para CDN de imágenes sin servicios adicionales.
- **SQL estándar**: más fácil de portar o migrar a futuro.

---

## ✨ Funcionalidades implementadas

### Autenticación
- [x] Registro con username, email y contraseña
- [x] Inicio de sesión
- [x] Cierre de sesión
- [x] Guards de rutas privadas
- [x] Persistencia de sesión

### Catálogo (CRUD completo)
- [x] Agregar película manualmente o con autocompletado desde TMDB
- [x] Visualizar catálogo en grilla responsive
- [x] Editar cualquier campo de una película
- [x] Eliminar con confirmación
- [x] Marcar como vista / pendiente
- [x] Búsqueda en tiempo real (título, director, género)
- [x] Filtros por estado (todas / vistas / pendientes)
- [x] Filtro por género con pills
- [x] Ordenamiento (reciente, título, año, calificación)
- [x] Barra de progreso de películas vistas

### Perfil de usuario (CDN)
- [x] Editar nombre de usuario
- [x] Foto de perfil con upload a Supabase Storage (CDN)
- [x] Resumen de estadísticas personales

### Estadísticas
- [x] Totales y porcentaje visto
- [x] Distribución por género (gráfico de barras)
- [x] Distribución de calificaciones
- [x] Películas por año
- [x] Top 5 mejor calificadas
- [x] Actividad reciente

### Extras opcionales del TP
- [x] Foto de perfil con CDN (Supabase Storage)
- [x] Búsqueda TMDB para pósters y datos automáticos
- [x] Estrategia de ramas (Git Flow simplificado)
- [x] Conventional Commits
- [x] Pull Requests entre ramas de alumnos

---

## ⚙️ Setup Local

### 1. Clonar e instalar
```bash
git clone [https://github.com/tu-usuario/movie-catalog.git](https://github.com/tu-usuario/movie-catalog.git)
cd movie-catalog
npm install