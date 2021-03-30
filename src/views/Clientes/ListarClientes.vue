<template>
  <div class="container">
    <div class="col-md-12 mt-3 card card-container">
      <b-row>
        <b-col cols="9">
          <header>
            <b-row class="mb-4" align-v="center">
              <b-col md="2"
                ><b-avatar variant="primary" icon="person"></b-avatar
              ></b-col>
              <b-col md="10"
                ><h1 class="text-primary">Listado Clientes</h1></b-col
              >
            </b-row>
          </header>
        </b-col>
        <b-col cols="3" v-if="BanderaSeguridad">
          <b-button href="CrearCliente" variant="light"
            >Crear Cliente<b-icon font-scale="1" icon="person-plus"></b-icon
          ></b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="8" class="mb-3">
          <b-form-input
              v-model="filter"
              type="search"
              placeholder="Filtrar Clientes"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-table
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
        <template #cell(Modificar)="data">
          <b-link
            :to="{ name: 'ModificarCliente', params: { id: data.item.id,ver:true } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="search"></b-icon></b-button
          ></b-link>
          <b-link v-if="BanderaSeguridad"
            :to="{ name: 'ModificarCliente', params: { id: data.item.id } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="pencil-fill"></b-icon></b-button
          ></b-link>
        </template>
      </b-table>
      <b-row>
        <b-col sm="7" md="6" class="mt-2">
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
  name: 'Listar',
  data() {
    return {
      content: '',
      BanderaSeguridad: false,
      fields: [
        { key: 'NIT', sortable: true },
        { key: 'Nombre', sortable: true },
        { key: 'TelefonoPrincipal', sortable: false,label: 'Tel Principal' },
        { key: 'createdAt', sortable: true, label: 'Creado' },
        { key: 'Modificar', label: 'Modificar' }
      ],
      items: [],
      filter:null,
      perPage: 10,
      totalRows: 1,
      currentPage: 1,
    };
  },
  computed: {},
  mounted() {
    axios
      .get(this.$IPServidor + '/api/ListarClientes', {
        headers: authHeader(),
      })
      .then((response) => {
        this.items = response.data;
        this.totalRows = this.items.length
      });
    UserService.getAdminBoard().then(
      () => {
        this.BanderaSeguridad = true;
      },
      () => {
        this.BanderaSeguridad = false;        
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

