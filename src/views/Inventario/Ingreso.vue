<template>
  <div  class="container">
    <header class="jumbotron"  v-if="!BanderaSeguridad">
      <h3>{{content}}</h3>
    </header>
    <div class="card mt-3 card-container" v-if="BanderaSeguridad" >
        <header >
        <b-row class="mb-4" align-v="center">
          <b-col md="1" ><b-avatar variant="primary" icon="people-fill"></b-avatar></b-col>
          <b-col md="11"><h1  class="text-primary ">Ingreso a Inventario</h1></b-col>
        </b-row>
        </header>
        <form name="form" @submit.prevent="handle">
          <div v-if="!successful">          
            <div class="form-group">
              <b-container class="bv-example-row">
              
              <b-row class="mt-2">
                <b-col  md="6">
                  <b-input-group prepend="Factura Número" class="mb-2">
                  <input
                    v-model="Ingreso.FacturaNumero"
                    v-validate="'required|min:3|max:70'"
                    class="form-control"
                    name="NIT"
                    placeholder="Ingreselo tal y como saldrá en la factura"
                  />
                  </b-input-group>
                  <div
                    v-if="submitted && errors.has('NIT')"
                    class="alert-danger"
                  >{{errors.first('NIT')}}</div>
                </b-col>
                <b-col  md="6">
                  <div class="form-group">
                    <b-input-group prepend="Vendedor Asignado" class="mb-2">
                    <b-form-select
                      v-model="Ingreso.TipoIngresoId"
                      :options="Vendedores"
                      value-field="id"
                      text-field="Nombre"
                    ></b-form-select>
                    </b-input-group>
                  </div>
                </b-col>
              </b-row>
             
            
              
              
              


              <b-row>
                <b-col>
                  <button class="btn btn-primary mt-4">Crear</button>
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
      idContacto:0,
      BanderaSeguridad:false,
      submitted: false,
      successful: false,
      Ingreso:{
        FacturaNumero:null,
        TipoIngresoId:null
      }
    };
  },
  computed: {
  },
  mounted() {     
    axios
      .get(this.$IPServidor + '/api/ListarVendedores',{ headers: authHeader()})
      .then((response) => {
        this.Vendedores = response.data;
      });
    axios
    .get(this.$IPServidor + '/api/ListarCategoriasProveedores',{ headers: authHeader()})
    .then((response) => {
      this.Categorias = response.data;
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
    agregar(){
      this.idContacto++
      this.Contactos.push(
        {
          numero:this.idContacto,
          id_Nombre:'Nombre del Contacto '+this.idContacto,
          id_Tel:'Telefono del Contacto '+this.idContacto,
          Nombre:'',
          Telefono:0,
          Email:'',
          Notas:''
        }
      )
    },
    borrar(numeroborrar){
      var removeIndex = this.Contactos.map(function(item) { return item.numero; }).indexOf(numeroborrar);
      this.Contactos.splice(removeIndex, 1);
    },
    handle() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          axios({
            method:'POST',
            headers: authHeader(),
            url:this.$IPServidor + '/api/CrearCliente',
            data:{
              Cliente:this.Cliente,
              Contactos:this.Contactos
            }
          })
          .then(response => {
            this.mensaje=response.data.message;
            this.successful = true;
            this.$router.push('/Clientes/ListarClientes');
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
