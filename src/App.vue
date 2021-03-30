<template>
  <div id="app">
    
    <div>
        <b-navbar toggleable="sm" type="dark" variant="info">
          <b-navbar-brand>
                <router-link to="/home" class="text-white">
                  SUnit
                </router-link>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav >

              <b-nav-item-dropdown text="Listados" v-if="showVentasMenu" >
                  <b-dropdown-item href="/Clientes/ListarClientes">
                      Clientes
                  </b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown text="Ventas" v-if="showVentasMenu" >
                <b-dropdown-item href="/ventas" >
                    Ventas Board
                </b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown text="Mantenimientos"  v-if="showAdminMenu">
                <b-dropdown-group id="dropdown-group-2" header="Productos">
                  <b-dropdown-item href="/Categorias/Listar">
                      Categorias de Productos
                  </b-dropdown-item>
                  <b-dropdown-item href="/Productos/Listar">
                      Productos
                  </b-dropdown-item>
                </b-dropdown-group>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-group id="dropdown-group-2" header="Personas">
                  <b-dropdown-item href="/Proveedores/ListarCategorias">
                      Categorias Proveedor/Clientes
                  </b-dropdown-item>
                  <b-dropdown-item href="/Proveedores/ListarProveedores">
                      Proveedores
                  </b-dropdown-item>
                  <b-dropdown-item href="/Vendedores/ListarVendedores">
                      Vendedores
                  </b-dropdown-item>
                  <b-dropdown-item href="/Clientes/ListarClientes">
                      Clientes
                  </b-dropdown-item>
                </b-dropdown-group>                
              </b-nav-item-dropdown>
              <b-nav-item-dropdown text="Administración"  v-if="showAdminMenu">
                <b-dropdown-group id="dropdown-group-1" header="Funciones Principales">
                  <b-dropdown-item href="/admin" >
                      Admin Board
                  </b-dropdown-item>
                </b-dropdown-group>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown text="SuperAdmin" v-if="showSuperAdminMenu">
                <b-dropdown-item href="/superadmin" >
                    SuperAdmin Board
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown text="Usuario" right>
                <b-dropdown-item  v-if="!currentUser"  to="/register">
                    <font-awesome-icon icon="user-plus" />Registrarse
                </b-dropdown-item>
                <b-dropdown-item  v-if="!currentUser"  href="/login">
                    <font-awesome-icon icon="sign-in-alt" />Login
                </b-dropdown-item>
                <b-dropdown-item v-if="currentUser" href="/profile" >
                    <font-awesome-icon icon="user" />
                    {{ currentUser.username }}
                </b-dropdown-item>
                <b-dropdown-item  v-if="currentUser" href @click.prevent="logOut" >
                      <font-awesome-icon icon="sign-out-alt" />LogOut
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    <!--
    
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href class="navbar-brand" >SUnit</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" />Home
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">Admin Board</router-link>
        </li>
        <li v-if="showModeratorBoard" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Board</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" />Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" />Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" />LogOut
          </a>
        </li>
      </div>
    </nav>
-->

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showVentasMenu() {
      
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_VENTAS');
      }

      return false;
    },
    showAdminMenu() {
      
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN') || this.currentUser.roles.includes('ROLE_SUPERADMIN');
      }

      return false;
    },
    showSuperAdminMenu() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_SUPERADMIN');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>
