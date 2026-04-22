# CafeShop — Frontend

Interfaz web desarrollada con React para la plataforma CafeShop, una aplicación de catálogo y pedidos de café.

---

## Tecnologías

- **React 19** + **Vite** — framework y bundler
- **Tailwind CSS v3** — estilos utilitarios
- **React Router DOM** — navegación entre páginas
- **Axios** — peticiones HTTP a la API
- **Context API** — manejo de estado de autenticación global

---

## Requisitos previos

- Node.js v18 o superior
- El backend de CafeShop corriendo en `http://localhost:3000`

---

## Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/samin13-maker/CafeShop-frontend.git
cd cafeshop-frontend

# 2. Instalar dependencias
npm install

# 3. Ejecutar
npm run dev
```

La aplicación corre en `http://localhost:5173` por defecto.

Para generar la versión de producción:

```bash
npm run build
```

---

## Estructura del proyecto

```
cafeshop-frontend/
├── src/
│   ├── api/
│   │   └── axios.js          ← instancia de Axios con token automático
│   ├── context/
│   │   ├── AuthContext.jsx   ← proveedor de autenticación global
│   │   ├── AuthContextDef.js ← definición del contexto
│   │   └── useAuth.js        ← hook para consumir el contexto
│   ├── components/
│   │   └── Navbar.jsx        ← barra de navegación
│   ├── pages/
│   │   ├── Login.jsx         ← inicio de sesión
│   │   ├── Register.jsx      ← registro de usuario
│   │   ├── Catalogo.jsx      ← catálogo de productos
│   │   ├── Carrito.jsx       ← carrito de compras y confirmación
│   │   ├── MisPedidos.jsx    ← historial de pedidos del cliente
│   │   ├── AdminProductos.jsx ← panel de gestión de productos
│   │   └── AdminPedidos.jsx  ← panel de gestión de pedidos
│   ├── App.jsx               ← rutas y estructura principal
│   ├── main.jsx              ← punto de entrada
│   └── index.css             ← estilos globales con Tailwind
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Páginas y funcionalidades

### Públicas (sin sesión)

| Página | Ruta | Descripción |
|--------|------|-------------|
| Catálogo | `/` | Lista todos los productos con búsqueda en tiempo real |
| Login | `/login` | Inicio de sesión con correo y contraseña |
| Registro | `/register` | Crear cuenta como Cliente o Vendedor |

### Cliente (requiere sesión)

| Página | Ruta | Descripción |
|--------|------|-------------|
| Carrito | `/carrito` | Ver productos agregados, modificar cantidades y confirmar pedido |
| Mis Pedidos | `/mis-pedidos` | Historial de pedidos con estado actual |

### Vendedor/Admin (requiere sesión con rol admin)

| Página | Ruta | Descripción |
|--------|------|-------------|
| Admin Productos | `/admin/productos` | Crear, editar y eliminar sus propios productos |
| Admin Pedidos | `/admin/pedidos` | Ver pedidos de sus productos y marcarlos como entregados |

---

## Autenticación

El sistema usa JWT almacenado en `localStorage`. El flujo es:

1. El usuario inicia sesión y recibe un token JWT
2. El token se guarda en `localStorage`
3. `axios.js` agrega automáticamente el token en el header `Authorization` de cada petición
4. Al cerrar sesión el token se elimina de `localStorage`

Las rutas protegidas usan componentes `PrivateRoute` y `AdminRoute` que redirigen al login si no hay sesión o si el rol no es suficiente.

---

## Roles y navegación

Al iniciar sesión la navbar cambia según el rol:

**Cliente:**
- Catálogo
- Carrito
- Mis Pedidos
- Salir

**Vendedor (Admin):**
- Catálogo
- Admin Productos
- Admin Pedidos
- Salir

---

## Validaciones en formularios

### Registro
- **Nombre:** requerido
- **Correo:** formato válido de email
- **Contraseña:** mínimo 8 caracteres, al menos una letra, un número y un carácter especial
- **Teléfono:** solo números, máximo 15 dígitos
- **Dirección:** solo letras, números y los símbolos `*`, `/`, `#`

### Confirmar pedido
- **Dirección de envío:** solo letras, números y los símbolos `*`, `/`, `#`
- **Teléfono de contacto:** solo números

---

## Integración con el Backend

Todas las peticiones al backend se hacen a través de `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});
```