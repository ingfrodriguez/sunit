<template>
  <div  class="container">
    <header class="jumbotron"  v-if="!BanderaSeguridad">
      <h3>{{content}}</h3>
    </header>
    <div class="col-md-12  mt-3 card card-container" v-if="BanderaSeguridad" >
        <header >
          <h1  class="text-primary">Crear Categoria Proveedores</h1>
        </header>
        <form name="form" @submit.prevent="handle">
          <div v-if="!successful">          
            <div class="form-group">
              <b-input-group prepend="Nombre" class="mb-2">
                <input
                  v-model="Nombre"
                  v-validate="'required|min:3|max:70'"
                  type="Nombre"
                  class="form-control"
                  name="Nombre"
                />
              </b-input-group>
              <div
                v-if="submitted && errors.has('Nombre')"
                class="alert-danger"
              >{{errors.first('Nombre')}}</div>
            </div>
            <div class="form-group">
              <button class="btn boton-tamano btn-primary btn-block">Crear</button>
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
import authHeader from '../../services/auth-header';
export default {
  data() {
    return {
      content:'',
      BanderaSeguridad:false,
      submitted: false,
      successful: false,
      mensaje:'',
      Nombre:''
    };
  },
  computed: {
  },
  mounted() {      
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
    handle() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          axios
          .post(this.$IPServidor+'/api/CrearCategoriaProveedor',{
            Nombre: this.Nombre
          },{ headers: authHeader()})
          .then(response => {
            this.mensaje=response.data.message;
            this.successful = true;
            this.$router.push('/Proveedores/ListarCategorias');
          })
          .catch( error => {
              this.mensaje=error.response.data.message;
              this.successful = false;
          });
        }
      });
    }
  }
};
</script>
<style>
.form-group{
  width:500px;
}
</style>