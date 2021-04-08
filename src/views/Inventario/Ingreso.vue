<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="card mt-3 card-container" v-if="BanderaSeguridad">
      <header>
        <b-row class="mb-4" align-v="center">
          <b-col md="1"
            ><b-avatar variant="primary" icon="people-fill"></b-avatar
          ></b-col>
          <b-col md="11"
            ><h1 class="text-primary">Ingreso a Inventario</h1>
            </b-col
          >
        </b-row>
      </header>
      <form name="form" @submit.prevent="handle">
        <div v-if="!successful">
          <div class="form-group">
            <b-container class="bv-example-row">
              <b-row class="mt-2">
                <b-col md="6">
                  <div class="form-group">
                    <b-input-group prepend="Tipo de Ingreso" class="mb-2">
                      <b-form-select
                        v-model="Ingreso.TipoIngresoId"
                        :options="TiposIngreso"
                        value-field="id"
                        text-field="Nombre"
                      ></b-form-select>
                    </b-input-group>
                  </div>
                </b-col>
                <b-col md="6" v-if="Compras">
                  <b-input-group prepend="Factura" class="mb-2">
                    <input
                      v-model="Ingreso.SerieNumero"
                      v-validate="'required|min:3|max:70'"
                      class="form-control"
                      name="SerieNumero"
                      placeholder="Serie"
                    />
                    <input
                      v-model="Ingreso.FacturaNumero"
                      v-validate="'required|min:3|max:70'"
                      class="form-control"
                      name="FacturaNumero"
                      placeholder="Número"
                    />
                  </b-input-group>
                  <div
                    v-if="submitted && errors.has('SerieNumero')"
                    class="alert-danger"
                  >
                    {{ errors.first('SerieNumero') }}
                  </div>
                  <div
                    v-if="submitted && errors.has('FacturaNumero')"
                    class="alert-danger"
                  >
                    {{ errors.first('FacturaNumero') }}
                  </div>
                </b-col>
                <b-col md="6" v-if="Compras">
                  <b-input-group prepend="Proveedor" class="mb-2">
                    <b-form-select
                      v-model="Ingreso.ProveedorId"
                      :options="Proveedores"
                      value-field="id"
                      text-field="Nombre"
                    ></b-form-select>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <h3>Detalle del Ingreso</h3>
                  <b-table
                    responsive
                    striped
                    hover
                    :items="IngresoDetalle"
                    :fields="fields"
                  >
                  <template #cell(Linea)="data">
                     <b-form-input v-model="data.item.Linea" disabled class="Linea"></b-form-input>
                  </template>
                  <template #cell(Codigo)="data">
                     <b-form-input v-model="data.item.Codigo" @change="NombreProducto(data.item.Linea,data.item.Codigo)"></b-form-input>
                  </template>
                  <template #cell(Cantidad)="data">
                     <b-form-input v-on:keyup.115="Agregar()" v-model="data.item.Cantidad" @change="sumar(data.item.Linea,data.item.Cantidad,data.item.CostoUnitario)"></b-form-input>
                  </template>
                  <template #cell(CostoUnitario)="data">
                     <b-form-input  v-on:keyup.115="Agregar()" v-model="data.item.CostoUnitario"  @change="sumar(data.item.Linea,data.item.Cantidad,data.item.CostoUnitario)"></b-form-input>
                  </template>
                  <template #cell(CostoTotal)="data">
                     <b-form-input v-model="data.item.CostoTotal" disabled></b-form-input>
                  </template>
                  <template #cell(Eliminar)="data">
                     <b-icon font-scale="0" icon="trash" v-on:click="Eliminar(data.item.Linea)"></b-icon>  
                  </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="11">
                </b-col>
                <b-col v-b-tooltip.hover title="Puede Presionar F4 cuando este ingresando para agregar más Líneas" md="1">
                  <b-icon  font-scale="0" icon="plus" class="h2"  v-on:click="Agregar()" ></b-icon>  
                </b-col>
              </b-row>
              <b-row>
                <b-col>{{IngresoDetalle}}
                  <button class="btn btn-primary mt-4">
                    Ingresar Producto
                  </button>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </div>
      </form>
      <div
        v-if="mensaje"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserService from '../../services/user.service';
import authHeader from '../../services/auth-header';
export default {
  data() {
    return {
      content: '',
      idContacto: 0,
      mensaje: '',
      BanderaSeguridad: false,
      submitted: false,
      successful: false,
      TiposIngreso: [],
      Proveedores: [],
      Ingreso: {
        FacturaNumero: null,
        SerieNumero: null,
        TipoIngresoId: null,
        ProveedorId: 1,
      },
      fields: [
        { key: 'Linea' },
        { key: 'Codigo',label:'Producto' },
        { key: 'ProductoNombre',label:'Nombre Producto' },
        { key: 'Cantidad' },
        { key: 'CostoUnitario' },
        { key: 'CostoTotal' },
        { key: 'Eliminar' }
      ],
      IngresoDetalle: [
      ],
    };
  },
  computed: {
    Compras() {
      if (this.Ingreso.TipoIngresoId == 1) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    axios
      .get(this.$IPServidor + '/api/ListarProveedoresSinInclude', {
        headers: authHeader(),
      })
      .then((response) => {
        this.Proveedores = response.data;
      });
    axios
      .get(this.$IPServidor + '/api/ListarTiposIngreso', {
        headers: authHeader(),
      })
      .then((response) => {
        this.TiposIngreso = response.data;
      });
    axios;

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
    sumar(numerobuscar,Cantidad,CostoUnitario){
      var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
      this.IngresoDetalle[Index].CostoTotal=Cantidad*CostoUnitario
    },
    Agregar(){
      this.IngresoDetalle.push(
        { Linea:0,ProductoId:null,Codigo:null,ProductoNombre:'',Cantidad: 0, CostoUnitario: 0,CostoTotal:0 }
      )
      for (var i = 0; i < this.IngresoDetalle.length; i++) {
        this.IngresoDetalle[i].Linea=i+1
      }
    },
    Eliminar(numerobuscar){
      var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
      this.IngresoDetalle.splice(Index, 1);
      //for (const value of this.IngresoDetalle) {
      for (var i = 0; i < this.IngresoDetalle.length; i++) {
        this.IngresoDetalle[i].Linea=i+1
      }
    },
    NombreProducto(numerobuscar,Codigo){
      axios({
            method:'GET',
            headers: authHeader(),
            url:this.$IPServidor + '/api/VerProductoCorto',
            params:{
              Codigo:Codigo
            }
          })
      .then((response) => {
        var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
        this.IngresoDetalle[Index].ProductoNombre=response.data.Nombre
        this.IngresoDetalle[Index].ProductoId=response.data.id

      })
      .catch(() => {
        var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
        this.IngresoDetalle[Index].ProductoNombre='Código Incorrecto'
        this.IngresoDetalle[Index].ProductoId=null
      });
    },
    handle() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          axios
            .post(this.$IPServidor + '/api/IngresoInventario', this.Ingreso, {
              headers: authHeader(),
            })
            .then((response) => {
              this.mensaje = response.data.message;
              this.successful = true;
              this.$router.push('/productos/listar');
            })
            .catch((error) => {
              this.mensaje = error.response.data.message;
              this.successful = false;
            });
        }
      });
    },
  },
};
</script>


<style scoped>
.Linea {  
  width:50px;
}
.Cantidad {  
  width:75px;
}
</style>