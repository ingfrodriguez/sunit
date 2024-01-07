import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Registro'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue'),
      meta: {
        title: 'Perfil'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      // lazy-loaded
      component: () => import('./views/BoardAdmin.vue'),
      meta: {
        title: 'Tablero Admin'
      }
    },
    {
      path: '/superadmin',
      name: 'superadmin',
      // lazy-loaded
      component: () => import('./views/BoardSuperAdmin.vue'),
      meta: {
        title: 'Tablero SuperAdmin'
      }
    },
    {
      path: '/ventas',
      name: 'ventas',
      // lazy-loaded
      component: () => import('./views/BoardVentas.vue'),
      meta: {
        title: 'Tablero Ventas'
      }
    },
    {
      path: '/productos/crear',
      name: 'crearproducto',
      // lazy-loaded
      component: () => import('./views/Productos/Crear.vue'),
      meta: {
        title: 'Crear Producto'
      }
    },
    {
      path: '/productos/modificar:id',
      name: 'modificarproductos',
      // lazy-loaded
      component: () => import('./views/Productos/Modificar.vue'),
      meta: {
        title: 'Modificar Producto'
      }
    },
    {
      path: '/productos/listar',
      name: 'listarproductos',
      // lazy-loaded
      component: () => import('./views/Productos/Listar.vue'),
      meta: {
        title: 'Listado Productos'
      }
    },
    {
      path: '/categorias/crear',
      name: 'crearcategoria',
      // lazy-loaded
      component: () => import('./views/Categorias/Crear.vue'),
      meta: {
        title: 'Crear Categoria Producto'
      }
      
    },
    {
      path: '/categorias/listar',
      name: 'listarcategorias',
      // lazy-loaded
      component: () => import('./views/Categorias/Listar.vue'),
      meta: {
        title: 'Listado Categorias Productos'
      }
    },
    //-------------------PROVEEDORES-------------------
    {
      path: '/proveedores/CrearProveedor',
      name: 'CrearProveedor',
      // lazy-loaded
      component: () => import('./views/Proveedores/CrearProveedor.vue'),
      meta: {
        title: 'Crear Proveedor'
      }
    },
    {
      path: '/proveedores/ModificarProveedor',
      name: 'ModificarProveedor',
      // lazy-loaded
      component: () => import('./views/Proveedores/ModificarProveedor.vue'),
      meta: {
        title: 'Modificar Proveedor'
      }
    },
    {
      path: '/proveedores/ListarProveedores',
      name: 'ListarProveedores',
      // lazy-loaded
      component: () => import('./views/Proveedores/ListarProveedores.vue'),
      meta: {
        title: 'Listar Proveedores Proveedor'
      }
    },
    {
      path: '/proveedores/CrearCategorias',
      name: 'crearcategorias',
      // lazy-loaded
      component: () => import('./views/Proveedores/CrearCategorias.vue'),
      meta: {
        title: 'Crear Categorias Proveedores'
      }
    },
    {
      path: '/proveedores/ListarCategorias',
      name: 'listarcategoriasproveedores',
      // lazy-loaded
      component: () => import('./views/Proveedores/ListarCategorias.vue'),
      meta: {
        title: 'Listado Categorias Proveedores'
      }
    },
    //-------------------VENDEDORES-------------------
    {
      path: '/vendedores/CrearVendedor',
      name: 'CrearVendedor',
      // lazy-loaded
      component: () => import('./views/Vendedores/CrearVendedor.vue'),
      meta: {
        title: 'Crear Vendedor'
      }
    },
    {
      path: '/vendedores/ModificarVendedor',
      name: 'ModificarVendedor',
      // lazy-loaded
      component: () => import('./views/Vendedores/ModificarVendedor.vue'),
      meta: {
        title: 'Modificar Vendedor'
      }
    },
    {
      path: '/vendedores/ListarVendedores',
      name: 'ListarVendedores',
      // lazy-loaded
      component: () => import('./views/Vendedores/ListarVendedores.vue'),
      meta: {
        title: 'Listar Vendedores'
      }
    },
    //-------------------CLIENTES-------------------
    {
      path: '/Clientes/CrearCliente',
      name: 'CrearCliente',
      // lazy-loaded
      component: () => import('./views/Clientes/CrearCliente.vue'),
      meta: {
        title: 'Crear Cliente'
      }
    },
    {
      path: '/Clientes/ModificarCliente',
      name: 'ModificarCliente',
      // lazy-loaded
      component: () => import('./views/Clientes/ModificarCliente.vue'),
      meta: {
        title: 'Modificar Cliente'
      }
    },
    {
      path: '/Clientes/ListarClientes',
      name: 'ListarClientes',
      // lazy-loaded
      component: () => import('./views/Clientes/ListarClientes.vue'),
      meta: {
        title: 'Listar Clientes'
      }
    },
    //-------------------INVENTARIO-------------------
    {
      path: '/Inventario/Ingreso',
      name: 'IngresoInventario',
      // lazy-loaded
      component: () => import('./views/Inventario/Ingreso.vue'),
      meta: {
        title: 'Ingreso Inventario'
      }
    },
    {
      path: '/Inventario/Salida',
      name: 'SalidaInventario',
      // lazy-loaded
      component: () => import('./views/Inventario/Salida.vue'),
      meta: {
        title: 'Salida Inventario'
      }
    },
    {
      path: '/Inventario/ListarIngresos',
      name: 'ListarIngresos',
      // lazy-loaded
      component: () => import('./views/Inventario/ListarIngresos.vue'),
      meta: {
        title: 'Listado de Ingresos'
      }
    },
    {
      path: '/Inventario/ListarSalidas',
      name: 'ListarSalidas',
      // lazy-loaded
      component: () => import('./views/Inventario/ListarSalidas.vue'),
      meta: {
        title: 'Listado de Salidas'
      }
    },
    {
      path: '/Inventario/VerIngreso',
      name: 'VerIngreso',
      // lazy-loaded
      component: () => import('./views/Inventario/VerIngreso.vue'),
      meta: {
        title: 'Ver Ingreso'
      }
    },
    //-------------------REPORTES-------------------
    {
      path: '/Reportes/Kardex',
      name: 'Kardex',
      // lazy-loaded
      component: () => import('./views/Reportes/Kardex.vue'),
      meta: {
        title: 'Kardex'
      }
    },
    {
      path: '/Reportes/TopVentas',
      name: 'TopVentas',
      // lazy-loaded
      component: () => import('./views/Reportes/TopVentas.vue'),
      meta: {
        title: 'TopVentas'
      }
    },
    {
      path :'*',
      component: () => import('./views/Home.vue'),
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  document.title =  (to.meta.title ? 'SUnit | '+ to.meta.title : 'SUnit') ;
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});