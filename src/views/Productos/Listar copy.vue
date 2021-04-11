<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12  mt-3 card card-container" v-if="BanderaSeguridad">
      <header>
        <b-row class="mb-4" align-v="center">
                <b-col md="2" ><b-avatar variant="primary" icon="screwdriver"></b-avatar></b-col>
                <b-col md="10"><h1  class="text-primary ">Listado Productos</h1></b-col>
        </b-row>
      </header>
      <p></p>
      <b-row class="text-right">
        <b-col cols="8"  class="mb-3">
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
            :to="{ name: 'modificarproductos', params: { id: data.item.id,ver:true } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="search"></b-icon></b-button
          ></b-link>
          <b-link
            :to="{ name: 'modificarproductos', params: { id: data.item.id } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="pencil-fill"></b-icon></b-button
          ></b-link>
        </template>
      </b-table>
      <b-row>
        <b-col sm="7" md="6"  class="mt-2">
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
import authHeader from '../../services/auth-header';

export default {
  name: 'Register',
  data() {
    return {
      content: '',
      filter:null,
      perPage: 10,
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
  },
  mounted() {
    
    axios.get(this.$IPServidor + '/api/ListarProductos',{ headers: authHeader()}).then((response) => {
      this.items = response.data;
      this.totalRows = this.items.length
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

