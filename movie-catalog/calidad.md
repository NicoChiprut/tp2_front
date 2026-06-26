# CALIDAD.md

## Estrategia general

La idea fue cubrir la calidad en tres niveles: primero que el codigo no tenga errores
basicos (lint), despues que la logica funcione bien (tests unitarios), y por ultimo
que el flujo principal de la app funcione desde el navegador (E2E). Lo pensamos asi
porque cada capa atrapa distintos tipos de errores, y si algo falla en cualquiera de
los tres el pipeline no deja pasar el codigo.

---

## Herramientas seleccionadas

**ESLint:** lo usamos para analisis estatico. Elegimos la v8 porque es la mas
compatible con los plugins de React que necesitabamos. No usamos Prettier porque
ESLint ya cubre lo que nos importaba.

**Vitest:** para tests unitarios. Lo elegimos porque se integra directo con Vite y
no necesita configuracion extra para ES Modules, que es lo que usa el proyecto.
Jest requeria mas setup para lo mismo.

**Playwright:** para los tests E2E. Corre contra la URL de produccion en Vercel con
un navegador real (Chromium headless). Lo elegimos sobre Cypress porque es mas simple
de configurar en CI.

**GitHub Actions:** para el pipeline. Esta integrado con GitHub y no necesita nada
externo. Se dispara solo en cada push o PR a main.

---

## Tests desarrollados

### Unitarios (`src/utils/movieStats.test.js`)

- `calcularEstadisticas` calcula bien el total de peliculas, cuantas fueron vistas
  y el promedio de rating
- `calcularEstadisticas` devuelve 0 de promedio si ninguna pelicula tiene rating
- `filtrarPorEstado` devuelve solo las peliculas vistas cuando se filtra por "watched"
- `filtrarPorEstado` devuelve solo las pendientes cuando se filtra por "pending"
- `filtrarPorGenero` devuelve solo las peliculas del genero indicado
- `filtrarPorGenero` devuelve todas si no se especifica genero

### E2E (`e2e/login.spec.js`)

- Un usuario no autenticado que intenta entrar a `/catalog` es redirigido a `/login`
- La pagina de login muestra los campos de email y password visibles

---

## Casos de uso criticos

Priorizamos la redireccion de rutas protegidas porque si falla, cualquier usuario
puede entrar al catalogo sin estar logueado. Y los calculos de estadisticas porque
son logica pura, facil de testear y si se rompen afectan lo que ve el usuario.

No testeamos la creacion de peliculas en E2E porque requeriria credenciales reales
de Supabase en el pipeline, lo que es un riesgo que decidimos no tomar por ahora.

---

## Pipeline de CI/CD

El workflow corre en cada push o PR a main o develop con estos pasos:

1. Checkout del codigo
2. Setup de Node 20
3. npm install dentro de movie-catalog/
4. Lint con ESLint (si falla, para todo)
5. Tests unitarios con Vitest (si falla, para todo)
6. Build de produccion con Vite

Pusimos el lint primero porque es el paso mas rapido y si hay un error basico no
tiene sentido seguir. El deploy lo maneja Vercel automaticamente cuando el pipeline
pasa en main.

---

## Limitaciones y deuda tecnica

- No testeamos login con credenciales reales en E2E, requeriria una cuenta de test
  en Supabase y secrets en GitHub
- Los hooks useMovies y useProfile no tienen tests porque habria que mockear Supabase
- Los tests E2E dependen de que Vercel este arriba, si cae fallan aunque el codigo
  este bien
- La cobertura de componentes es cero, queda pendiente para una proxima iteracion