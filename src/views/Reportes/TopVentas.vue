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
                >{{ Al }}<h1 class="text-primary">Top Ventas</h1></b-col
              >{{ Del }}
            </b-row>
          </header>
        </b-col>
      </b-row>
      <b-row> </b-row>
      <b-row class="mb-1">
        <b-col cols="5">
          <b-input-group prepend="Del">
            <b-form-datepicker
              id="example-datepicker"
              v-model="Del"
              placeholder="Fecha Inicio"
            ></b-form-datepicker>
          </b-input-group>
        </b-col>
        <b-col cols="5">
          <b-input-group prepend="Al">
            <b-form-datepicker
              id="example-datepicker2"
              v-model="Al"
              placeholder="Fecha Fin"
            ></b-form-datepicker>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="5">
          <b-input-group prepend="Categorias" class="mb-2">
            <b-form-select
              v-model="FiltroCategoria"
              :options="categorias"
              value-field="id"
              text-field="Nombre"
              name='FiltroCategoria'
            ></b-form-select>
          </b-input-group>
        </b-col>
        <b-col cols="2">
          <button class="btn btn-primary"  v-on:click="SinFiltrar()">
            Borrar Filtros
          </button>
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
      <b-row>
          <b-col sm="7" md="6" class="mt-2">
            <div
              v-if="mensaje"
              class="alert"
              :class="successful ? 'alert-success' : 'alert-danger'"
            >
              {{ mensaje }}
            </div>
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
      Al: null,
      mensaje: '',
      Del: null,
      FiltroCategoria:null,
      BanderaSeguridad: false,
      fields: [
        { key: 'Nombre', sortable: true, label: 'Producto' },
        { key: 'Conteo', sortable: true, label: 'Cantidad Vendida' }
      ],
      items: [],
      categorias: [],
      filter: null,
      perPage: 10,
      totalRows: 1,
      currentPage: 1
    };
  },
  computed: {},
  mounted() {
    this.getCategorias();
    axios
      .get(this.$IPServidor + '/api/topVentas', {
        headers: authHeader()
      })
      .then(response => {
        this.items = response.data;
        this.totalRows = this.items.length;
        this.mensaje='';
      })
      .catch(error => {
        this.mensaje = error.response.data.message;
      });
    UserService.getAdminBoard().then(
      response => {
        this.content = response.data;
        this.BanderaSeguridad = true;
      },
      error => {
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
    getCategorias() {
      axios({
        method: 'GET',
        headers: authHeader(),
        url: this.$IPServidor + '/api/ListarCategoriaProducto',
      }).then(response => {
        this.categorias = response.data;
      });
    },
    SinFiltrar() {
      this.FiltroCategoria=null,
      this.Del=null,
      this.Al=null
    },
    Filtrar() {
      axios({
        method: 'GET',
        headers: authHeader(),
        url: this.$IPServidor + '/api/topVentas',
        params: {
          Del: this.Del,
          Al: this.Al,
          Categoria: this.FiltroCategoria
        }
      }).then(response => {
        this.items = response.data;
        this.totalRows = this.items.length;
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>
