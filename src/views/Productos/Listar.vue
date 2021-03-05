<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12 card card-container" v-if="BanderaSeguridad">
      <header>
        <h1 class="text-primary">Listado Productos</h1>
      </header>
      <p></p>
      <b-row class="text-right">
        <b-col cols="8">
          <b-form-input
              v-model="filter"
              type="search"
              placeholder="Filtrar productos"
          ></b-form-input>
        </b-col>
        <b-col cols="4">
          <b-button href="crear" variant="light"
            >Crear Producto<b-icon font-scale="1" icon="plus"></b-icon
          ></b-button> </b-col
      ></b-row>
      <b-table
        id="my-table"
        striped
        hover
        :items="items"
        :fields="fields"
        responsive
        :per-page="perPage"
        :current-page="currentPage"
        :filter="filter"
        @filtered="onFiltered"
      >
        <template #cell(Creado)="data">
          {{ data.item.createdAt | moment('YYYY-MM-D H:m') }}
        </template>
        <template #cell(Modificar)="data">
          <b-link
            :to="{ name: 'modificarproductos', params: { id: data.item.id } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="pencil-fill"></b-icon></b-button
          ></b-link>
        </template>
      </b-table>
      <b-row>
        <b-col sm="7" md="6">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            aria-controls="my-table"
            pills
          ></b-pagination>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserService from '../../services/user.service';

export default {
  name: 'Register',
  data() {
    return {
      content: '',
      filter:null,
      perPage: 5,
      totalRows: 1,
      currentPage: 1,
      BanderaSeguridad: false,
      fields: [
        { key: 'Codigo', sortable: true },
        { key: 'Activo' },
        { key: 'Nombre', sortable: true },
        {
          key: 'CategoriasProducto.Nombre',
          sortable: true,
          label: 'Categoria',
        },
        { key: 'UnidadesMedida.Nombre', label: 'U.Medida' },
        { key: 'Creado', sortable: true, label: 'Creado' },
        { key: 'Modificar', label: 'Modificar' },
      ],
      items: [],
    };
  },
  computed: {
    total:function(){
      return this.totalRows = this.items.length //cambiar
    }
  },
  mounted() {
    
    axios.get(this.$IPServidor + '/api/ListarProductos').then((response) => {
      this.items = response.data;
      this.totalRows = this.items.length //cambiar
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
  methods: {
    onFiltered(filteredItems) {
      
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows  = filteredItems.length
        this.currentPage = 1
    }
  },
};
</script>


<style scoped>
.card-container.card {
  max-width: 1050px !important;
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