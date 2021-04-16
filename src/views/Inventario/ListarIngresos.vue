<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12 mt-3 card card-container" v-if="BanderaSeguridad">
      <b-row>
        <b-col cols="9">
          <header>
            <b-row class="mb-4" align-v="center">
              <b-col md="2"
                ><b-avatar variant="primary" icon="person"></b-avatar
              ></b-col>
              <b-col md="10"
                ><h1 class="text-primary">Listado Ingresos</h1></b-col
              >
            </b-row>
          </header>
        </b-col>
        <b-col cols="3">
          <b-button href="Ingreso" variant="light"
            >Ingresar Producto a Inventario<b-icon font-scale="1" icon="bag-plus"></b-icon
          ></b-button>
        </b-col>
      </b-row>
      <b-row>
        
      </b-row>
      <b-row class="mb-1">
        <b-col cols="5" >
          <b-input-group prepend="Del" >
            <b-form-datepicker id="example-datepicker" v-model="Del" placeholder="Fecha Inicio"></b-form-datepicker>
          </b-input-group>
        </b-col>
        <b-col cols="5">
          <b-input-group prepend="Al" >
            <b-form-datepicker id="example-datepicker2" v-model="Al" placeholder="Fecha Fin"></b-form-datepicker>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="5">
          <b-input-group prepend="Correlativo" >
           <b-form-input v-model="Correlativo" placeholder="Correlativo del ingreso"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="2">
          <button class="btn btn-primary" v-on:click="Filtrar()">
                    Filtrar
          </button>
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
        <template #cell(Ver)="data">
          <b-link
            :to="{ name: 'IngresoInventario', params: { id: data.item.id,ver:true } }"
            ><b-button variant="outline-secondary" size="sm"
              ><b-icon font-scale="1" icon="search"></b-icon></b-button
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
      Al:null,
      Del:null,
      Correlativo:null,
      BanderaSeguridad: false,
      fields: [
        { key: 'id', sortable: true,label: 'Correlativo' },
        { key: 'FechaIngreso', sortable: true,label: 'Fecha Ingreso' },
        { key: 'TipoIngreso.Nombre', sortable: true, label: 'Tipo Ingreso' },
        { key: 'Ver', label: 'Ver' }
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
      .get(this.$IPServidor + '/api/ListarIngresos', {
        headers: authHeader(),
      })
      .then((response) => {
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
    Filtrar(){
      axios({
            method:'GET',
            headers: authHeader(),
            url:this.$IPServidor + '/api/ListarIngresos',
            params:{
              Del:this.Del,
              Al:this.Al,
              Correlativo:this.Correlativo
            }
          })
      .then((response) => {
        this.items = response.data;
        this.totalRows = this.items.length
      });
    },
    onFiltered(filteredItems) {
      
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows  = filteredItems.length
        this.currentPage = 1
    }
  },
};
</script>

