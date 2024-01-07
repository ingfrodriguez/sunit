<template>
  <div class="container" id="myelement">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="card mt-3 card-container" v-if="BanderaSeguridad">
      <header>
        <b-row class="mb-4" align-v="center">
          <b-col md="1"
            ><b-avatar variant="primary" icon="box"></b-avatar
          ></b-col>
          <b-col md="10"
            ><h1 class="text-primary">{{titulo}}</h1>
            </b-col>
          <b-col md="1">
            <b-icon font-scale="2" icon="printer" v-on:click="Imprimir()" v-if="BanderaVer" class="mr-2"></b-icon>  
            <b-icon font-scale="2" icon="question-circle"  v-if="!BanderaVer" v-b-popover.hover.v-warning="'1.Cuando este ingresando el detalle presione INSERT para agregar otro producto.    \n   2.Puede usar TAB para navegar sin el mouse  3.Puede presionar la lupita para buscar productos'"></b-icon>  
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
                        v-validate="'required'"
                        text-field="Nombre"
                        name='TipoIngresoId'
                        :disabled =BanderaVer
                        @change="cambioingreso()"
                      ></b-form-select>
                    </b-input-group>
                    <div
                      v-if="submitted && errors.has('TipoIngresoId')"
                      class="alert-danger"
                    >
                      {{ errors.first('TipoIngresoId') }}
                    </div>
                  </div>
                </b-col>
                <b-col md="6" v-if="Compras"> 
                  <b-input-group prepend="Factura" class="mb-2">
                    <input
                      v-model="Ingreso.SerieNumero"
                      v-validate="'required|min:3|max:12'"
                      class="form-control"
                      name="SerieNumero"
                      :disabled =BanderaVer
                      placeholder="Serie"
                    />
                    <input
                      v-model="Ingreso.FacturaNumero"
                      v-validate="'required|min:3|max:12'"
                      class="form-control"
                      name="FacturaNumero"
                      :disabled =BanderaVer
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
                      :disabled =BanderaVer
                    ></b-form-select>
                  </b-input-group>
                </b-col>
                <b-col md="6">
                  <b-input-group prepend="Notas" class="mb-2">
                    <input
                      v-model="Ingreso.Notas"
                      class="form-control"                      
                      placeholder="Notas"
                      :disabled =BanderaVer
                    />
                  </b-input-group>
                </b-col>
                <b-col md="6">
                  <div class="form-group">
                        <input type="file" @change="upload" ref="file"  v-if="!BanderaVer && !Guardado" accept="image/*">
                        <b-alert variant="success" show v-if="!BanderaVer && Guardado">Documento adjunto!</b-alert>
                        <b-button v-if="BanderaVer" @click="bajarDocumento()">Bajar Documento</b-button>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <h3 class="mb-3 mt-5">Detalle del Ingreso</h3>
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
                    <b-input-group class="Codigo">
                      <b-form-input  v-on:keyup.45="Agregar()"  v-model="data.item.Codigo" @change="NombreProducto(data.item.Linea,data.item.Codigo)" :disabled =BanderaVer></b-form-input>
                      <b-input-group-append>
                        <b-button @click="abrircomponente(data.item.Linea)" variant="info" v-if="!BanderaVer"><b-icon class="mb-1" font-scale="0.90" icon="search"></b-icon>  </b-button>                      
                      </b-input-group-append>
                    </b-input-group>
                  </template>
                  <template #cell(Cantidad)="data">
                     <b-form-input v-on:keyup.45="Agregar(data.item.Linea)" v-model="data.item.Cantidad" @change="sumar(data.item.Linea,data.item.Cantidad,data.item.CostoUnitario)" class="Cantidad" type="number" :disabled =BanderaVer></b-form-input>
                  </template>
                  <template #cell(CostoUnitario)="data">
                     <b-form-input  v-on:keyup.45="Agregar()" v-model="data.item.CostoUnitario"  @change="sumar(data.item.Linea,data.item.Cantidad,data.item.CostoUnitario)" class="CostoUnitario" :disabled =BanderaVer></b-form-input>
                  </template>
                  <template #cell(CostoTotal)="data">
                     <b-form-input v-model="data.item.CostoTotal" disabled class="CostoTotal" ></b-form-input>
                  </template>
                  <template #cell(Eliminar)="data">
                     <b-icon font-scale="0" icon="trash" v-on:click="Eliminar(data.item.Linea)" v-if="!BanderaVer"></b-icon>  
                  </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="11">
                </b-col>
                <b-col md="1" v-if="!BanderaVer">
                  <b-icon  font-scale="0" icon="plus" class="h2"  v-on:click="Agregar()" ></b-icon>  
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <button class="btn btn-primary mt-4" v-if="!BanderaVer">
                    Ingresar Productos
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
      <b-modal ok-only ok-title="Cerrar" size="xl" id="my-modal">
        <componentelistadoproductos BanderaSeleccionar=true @select="selectProducto"></componentelistadoproductos>

      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserService from '../../services/user.service';
import authHeader from '../../services/auth-header';
import Componentelistadoproductos from '@/components/Componentelistadoproductos'
import { Printd } from 'printd'
import UploadService from "../../services/UploadFilesService";

export default {
  components:{
     Componentelistadoproductos
  },
  data() {
    return {
      content: '',
      titulo:'Ingreso a Inventario',
      BanderaVer:false,
      Guardado:false,
      idContacto: 0,
      LineaSeleccionada:null,
      mensaje: '',
      BanderaSeguridad: false,
      submitted: false,
      successful: false,
      TiposIngreso: [],
      Proveedores: [],
      documento:"sinImagen.jpg",
      currentImage:null,
      NombreImagen:'',
      Ingreso: {
        FacturaNumero: null,
        SerieNumero: null,
        TipoIngresoId: null,
        ProveedorId: 1,
        Notas:null,
        Documento:null
      },
      fields: [
        { key: 'Linea' },
        { key: 'Codigo',label:'Codigo' },
        { key: 'UnidadMedida',label:'UMedida' },
        { key: 'ProductoNombre',label:'Nombre' },
        { key: 'Cantidad' },
        { key: 'CostoUnitario' },
        { key: 'CostoTotal' },
        { key: 'Eliminar',label:'' }
      ],
      IngresoDetalle: [
         { BanderaTotal:true,BanderaProducto:true,_rowVariant: null,Linea:0,ProductoId:null,Codigo:null,ProductoNombre:'',Cantidad: 0, CostoUnitario: 0,CostoTotal:0 }
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
    this.BanderaVer= this.$route.params.ver
    if (this.BanderaVer){
      axios
        .get(this.$IPServidor + '/api/VerIngreso', {
          params: {
            id: this.$route.params.id,
          },
          headers: authHeader(),
        })
        .then((response) => {
          for (var i = 0; i < response.data.IngresosDetalles.length; i++) {
            response.data.IngresosDetalles[i].Linea=i+1
            response.data.IngresosDetalles[i].Codigo=response.data.IngresosDetalles[i].Producto.Codigo
            response.data.IngresosDetalles[i].ProductoNombre=response.data.IngresosDetalles[i].Producto.Nombre
            response.data.IngresosDetalles[i].UnidadMedida=response.data.IngresosDetalles[i].Producto.UnidadesMedida.Nombre
          }
          this.Ingreso = response.data;
          this.titulo='Ingreso a Inventario No. '  + this.Ingreso.id;
          //this.factura="upload/"+this.Ingreso.id+".jpg";
          this.IngresoDetalle = response.data.IngresosDetalles;
        });

    } else {
      this.titulo='Ingreso a Inventario'
    }
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
    Imprimir(){
      const styles = [
        `.Linea {  
          width:50px;
        }
        .b-icon.bi{visibility: hidden;}
        `
      ]
      const d = new Printd()
      d.print( document.getElementById('myelement'),styles)
    },
    cambioingreso(){
      if(this.Ingreso.TipoIngresoId!=1){
        this.Ingreso.FacturaNumero=null
        this.Ingreso.SerieNumero=null 
        this.Ingreso.ProveedorId=null 
      }
    },
    abrircomponente(id){
      this.LineaSeleccionada=id
      this.$bvModal.show('my-modal')
    },
    selectProducto(plan){
      this.$bvModal.hide('my-modal')
      var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(this.LineaSeleccionada);
      this.IngresoDetalle[Index].Codigo=plan
      this.NombreProducto(this.LineaSeleccionada,plan)
    },
    sumar(numerobuscar,Cantidad,CostoUnitario){
      var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
      let total=this.round(Cantidad*CostoUnitario,2)
      if(Number.isNaN(total)){        
        this.IngresoDetalle[Index].BanderaTotal=false
      } else{
        this.IngresoDetalle[Index].BanderaTotal=true
      }
      if(Number.isNaN(total) || !this.IngresoDetalle[Index].BanderaProducto){        
        this.IngresoDetalle[Index]._rowVariant='danger'
      } else{
        this.IngresoDetalle[Index]._rowVariant=null
      }
      this.IngresoDetalle[Index].CostoTotal=total
    },
    Agregar(){
      this.IngresoDetalle.push(
        { BanderaTotal:true,BanderaProducto:true,_rowVariant: null,Linea:0,ProductoId:null,Codigo:null,ProductoNombre:'',Cantidad: 0, CostoUnitario: 0,CostoTotal:0 }
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
        this.IngresoDetalle[Index].BanderaProducto=true
        this.IngresoDetalle[Index].UnidadMedida=response.data.UnidadesMedida.Nombre
        if(this.IngresoDetalle[Index].BanderaTotal && this.IngresoDetalle[Index].BanderaProducto){
          this.IngresoDetalle[Index]._rowVariant=null
        } else{
          this.IngresoDetalle[Index]._rowVariant='danger'
        }
        
      })
      .catch(() => {
        var Index = this.IngresoDetalle.map(function(item) { return item.Linea; }).indexOf(numerobuscar);
        this.IngresoDetalle[Index].ProductoNombre='Código Incorrecto'
        this.IngresoDetalle[Index].ProductoId=null
        this.IngresoDetalle[Index].BanderaProducto=false
        if(this.IngresoDetalle[Index].BanderaTotal && this.IngresoDetalle[Index].BanderaProducto){
          this.IngresoDetalle[Index]._rowVariant=null
        } else{
          this.IngresoDetalle[Index]._rowVariant='danger'
        }
      });
    },
    handle() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          axios({
            method:'POST',
            headers: authHeader(),
            url:this.$IPServidor + '/api/IngresoInventario',
            params:{
              Ingreso:this.Ingreso,
              IngresoDetalle:this.IngresoDetalle
            }
          })
            .then((response) => {
              this.mensaje = response.data.message;
              //this.upload(response.data.id+'.jpg');
              this.successful = true;
              setTimeout(()=>{this.$router.push('/inventario/listaringresos');}, 2000);
            })
            .catch((error) => {
              this.mensaje = error.response.data.message;
              this.successful = false;
            });
        }
      });
    },
    upload() {      
      this.currentImage = this.$refs.file.files.item(0);                            
      UploadService.upload(this.currentImage)
      .then((response) => {
        this.NombreImagen=response.data.nombreArchivo
        this.Guardado=true;
        this.Ingreso.Documento=this.NombreImagen
        //this.mensaje = response.data.message;
      })
      .catch((err) => {
        this.mensaje = "Could not upload the image! "+err.response.data.message ;
        this.successful = false;
        this.currentImage = undefined;
      });
    },
    bajarDocumento() {      
      axios({
            url:this.$IPServidor + '/files/'+this.Ingreso.Documento,
          })
      .then(() => {
        //this.titulo=this.Ingreso.Documento
        window.open(this.$IPServidor + '/files/'+this.Ingreso.Documento, '_blank');        
        this.mensaje = null
      })
      .catch((err) => {
        this.mensaje = 'No se adjunto Documento en el ingreso. '+err.response.data.message;
              this.successful = false;
      });
    }
  },
};
</script>

<style>
 @import "../../assets/css/ingreso.css"
</style>