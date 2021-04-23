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
                ><h1 class="text-primary">Reporte Kardex</h1></b-col
              >
            </b-row>
          </header>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="5" >
          <b-input-group prepend="Del" >
            <b-form-input v-model="CodigoProducto" placeholder="Código del producto"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="2">
          <button class="btn btn-primary" v-on:click="Filtrar()">
                    Filtrar
          </button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3>{{Nombre}}</h3>--cambiar a codigo
        </b-col>
      </b-row>
      <b-row>
        <b-col>
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
        </b-col>
      </b-row>
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
        {{items}}
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
      Nombre:'',
      Al:null,
      Del:null,
      CodigoProducto:null,
      BanderaSeguridad: false,
      fields: [
        { key: 'id'},
        { key: 'fecha'},
        { key: 'tipomovimiento'},
        { key: 'Cantidad'},
        { key: 'CostoUnitario'},
        { key: 'CostoTotal'},
        { key: 'Saldo'},
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
            url:this.$IPServidor + '/api/kardex',
            params:{
              CodigoProducto:this.CodigoProducto
            }
          })
      .then((response) => {
        if (this.items){
          this.items = response.data;
          this.Nombre='Producto id: '+this.items[0].id+' Nombre: '+this.items[0].Nombre
           // eslint-disable-next-line
          var Saldo=0  
          // eslint-disable-next-line
          var ExistenciaTotal=0 
          for (var i = 0; i < this.items.length; i++) {
            if(this.items[i].operacion=='i'){
              Saldo+=this.items[i].CostoTotal
              ExistenciaTotal+=this.items[i].Cantidad
            }
            if(this.items[i].operacion=='s'){
              Saldo-=this.items[i].CostoTotal
              ExistenciaTotal-=this.items[i].Cantidad
            }
            this.items[i].Saldo=this.items[i].CostoTotal
          }
          this.items.push(
            {Saldo:Saldo,Cantidad:ExistenciaTotal}
          )
        }
        else{
          this.items=null
          this.Nombre=''
        }
        
        
      })
      .catch(() => {
        
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

