<template>
  <div>
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div v-if="BanderaSeguridad">
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
          <b-input-group prepend="Codigo del Producto" >
            <b-form-input v-model="CodigoProducto" placeholder="Código del producto"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col>
          
        </b-col>
        <b-col cols="2">
          <button class="btn btn-primary" v-on:click="Filtrar()">
                    Filtrar
          </button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3>{{Nombre}}</h3>
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
            <template #thead-top="">
              <b-tr>
                <b-th colspan="3"></b-th>
                <b-th colspan="3" variant="info">Ingresos</b-th>
                <b-th colspan="3">Salidas</b-th>
                <b-th colspan="3" variant="info">Saldos</b-th>
              </b-tr>
            </template>

            <template #cell(id)="data">
              <b-link v-if="data.item.operacion=='i'"
              :to="{ name: 'IngresoInventario', params: { id: data.item.id,ver:true} }"
              >
                <b-icon font-scale="1" icon="box-arrow-up-right"></b-icon>                
              </b-link>
              <b-link v-if="data.item.operacion=='s'"
              :to="{ name: 'SalidaInventario', params: { id: data.item.id,ver:true} }"
              >
                <b-icon font-scale="1" icon="box-arrow-up-right"></b-icon>                
              </b-link>
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
      CodigoProducto:'VAL-01',
      BanderaSeguridad: false,
      fields: [
        { key: 'id',label:'Ver'},
        { key: 'fecha'},
        { key: 'tipomovimiento',label:'Detalle'},
        { key: 'ingresocantidad',variant: 'info',label:'Cant.'},
        { key: 'ingresocostounitario',variant: 'info',label:'C.U.'},
        { key: 'ingresocostototal',variant: 'info',label:'C.T.'},
        { key: 'salidacantidad',label:'Cant.'},
        { key: 'salidacostounitario',label:'C.U.'},
        { key: 'salidacostototal',label:'C.T.'},
        { key: 'saldocantidad',variant: 'info',label:'Cant.'},
        { key: 'saldocostounitario',variant: 'info',label:'C.P.'},
        { key: 'saldocostototal',variant: 'info',label:'C.T.'},
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
          this.Nombre='Producto Código: '+this.items[0].codigoproducto+', Nombre: '+this.items[0].nombre
           // eslint-disable-next-line
          var Saldo=0.0  
          // eslint-disable-next-line
          var ExistenciaTotal=0 
          for (var i = 0; i < this.items.length; i++) {
            //inicio conversión fecha aprovechando el for
            this.items[i].fecha=this.$func.format_date(this.items[i].fecha)
            //fin conversión fecha aprovechando el for
            if(this.items[i].operacion=='i'){
              Saldo+=this.items[i].ingresocostototal*1
              ExistenciaTotal+=this.items[i].ingresocantidad
              this.items[i].saldocantidad=ExistenciaTotal
              this.items[i].saldocostototal=Saldo.toFixed(2)
              this.items[i].saldocostounitario=(Saldo.toFixed(2)/ExistenciaTotal).toFixed(2)
            }
            if(this.items[i].operacion=='s'){
              Saldo-=this.items[i].salidacostototal*1
              ExistenciaTotal-=this.items[i].salidacantidad
              this.items[i].saldocantidad=ExistenciaTotal
              this.items[i].saldocostototal=Saldo.toFixed(2)
              this.items[i].saldocostounitario=(Saldo.toFixed(2)/ExistenciaTotal).toFixed(2)
            }
            this.items[i].Saldo=Saldo.toFixed(2)
          }
          this.items.push(
            {saldocostototal:Saldo.toFixed(2),saldocantidad:ExistenciaTotal}
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


<style>
.container {
    max-width: 1300px;
}
</style>