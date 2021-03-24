<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12 mt-3  card card-container" v-if="BanderaSeguridad">
      <header>
        <h1 class="text-primary">Listado Proveedores</h1>
      </header>
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
      fields: ['id', 'NIT', 'Nombre','TelefonoPrincipal','createdAt'],
      items: []
    };
  },
  computed: {},
  mounted() {
    axios
      .get(this.$IPServidor+'/api/ListarProveedores',{ headers: authHeader()})
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


<style scoped>
.card-container.card {
  max-width: 850px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>