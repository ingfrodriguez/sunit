<template>
  <div  class="container">
    <header class="jumbotron"  v-if="!BanderaSeguridad">
      <h3>{{content}}</h3>
    </header>
    <div class="col-md-12 card card-container" v-if="BanderaSeguridad" >
        <header >
          <h1  class="text-primary">Crear categoria Producto</h1>
        </header>
        <form name="form" @submit.prevent="handle">
          <div v-if="!successful">          
            <div class="form-group">
              <label for="Nombre">Nombre</label>
              <input
                v-model="Nombre"
                v-validate="'required|min:3|max:40'"
                type="Nombre"
                class="form-control"
                name="Nombre"
              />
              <div
                v-if="submitted && errors.has('Nombre')"
                class="alert-danger"
              >{{errors.first('Nombre')}}</div>
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
          .post(this.$IPServidor+'/api/CrearCategoriaProducto',{
            Nombre: this.Nombre
          })
          .then(response => {
            this.mensaje=response.data.message;
            this.successful = true;
            this.$router.push('/categorias/listar');
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


<style scoped>
.card-container.card {
  max-width: 550px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>