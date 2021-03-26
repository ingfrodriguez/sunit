<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12  mt-3  card card-container" v-if="BanderaSeguridad">
      <b-row>
          <b-col cols="9">
            <header>
              <b-row class="mb-4" align-v="center">
                      <b-col md="2" ><b-avatar variant="primary" icon="folder"></b-avatar></b-col>
                      <b-col md="10"><h1  class="text-primary ">Listado Categorias Proveedores</h1></b-col>
              </b-row>
            </header>
          </b-col>
          <b-col cols="3">
            <b-button href="CrearCategorias" variant="light"
              >Crear Categoria<b-icon font-scale="1" icon="plus"></b-icon
            ></b-button>
          </b-col>
      </b-row>
      <p></p>
      <b-table striped hover :items="items" :fields="fields" responsive></b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserService from '../../services/user.service';
import authHeader from '../../services/auth-header';
export default {
  name: 'Listar',
  data() {
    return {
      content: '',
      BanderaSeguridad: false,
      fields: ['id', 'Nombre', 'createdAt'],
      items: []
    };
  },
  computed: {},
  mounted() {
    axios
      .get(this.$IPServidor+'/api/ListarCategoriasProveedores',{ headers: authHeader()})
      .then((response) => {
        this.items = response.data;
      });
    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
        this.BanderaSeguridad = true;
      },
      (error) => {
        this.BanderaSeguridad = false;
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {},
};
</script>
