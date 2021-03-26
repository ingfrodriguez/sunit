<template>
  <div  class="container">
    <header class="jumbotron"  v-if="!BanderaSeguridad">
      <h3>{{content}}</h3>
    </header>
    <div class="col-md-12 card card-container" v-if="BanderaSeguridad" >
        <header >
          <h1  class="text-primary">Ingreso Producto</h1>
        </header>
        <form name="form" @submit.prevent="handle">
          <div v-if="!successful">
            <div class="form-group">
              <b-input-group prepend="Factura Serie y Numero" class="mb-2">
                <b-form-input 
                  v-model="Ingreso.Nombre"
                  v-validate="'required|min:3'" 
                  aria-label="Serie">
                </b-form-input>
                <b-form-input 
                  v-model="Ingreso.Nombre"
                  v-validate="'required|min:3'"
                  aria-label="Numero">
                </b-form-input>
              </b-input-group>
              
            </div>
            <div class="form-group">
              <b-input-group prepend="Tipo Ingreso" class="mb-2">
                
                <b-form-select
                  v-model="Ingreso.TipoIngresoId"
                  :options="TiposIngreso"
                  value-field="id"
                  text-field="Nombre"
                ></b-form-select>
              </b-input-group>
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block">Crear</button>
            </div>
          </div>
        </form>
        <div
          v-if="mensaje"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >{{mensaje}}</div>

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
      content:'',
      BanderaSeguridad:false,
      submitted: false,
      successful: false,
      mensaje:'',
      TiposIngreso:[],
      Ingreso:{
        TipoIngresoId:null,
        SerieNumero:null,
        FacturaNumero:null
      }
    };
  },
  computed: {
  },
  mounted() { 
    axios
    .get(this.$IPServidor+'/api/ListarTiposIngreso',)
    .then(response => {
      this.TiposIngreso= response.data;
    });
   
    UserService.getAdminBoard().then(
      response => {
        this.content = response.data;
        this.BanderaSeguridad=true;
      },
      error => {
        this.BanderaSeguridad=false;
        this.content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {   
  }
};
</script> 