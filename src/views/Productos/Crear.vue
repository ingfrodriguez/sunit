<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12 mt-3  card card-container" v-if="BanderaSeguridad">
      <header>
          <b-row class="mb-4" align-v="center">
            <b-col md="1" ><b-avatar variant="primary" icon="screwdriver"></b-avatar></b-col>
            <b-col md="11"><h1  class="text-primary ">Crear  Producto</h1></b-col>
          </b-row>
      </header>
      <form name="form" @submit.prevent="handle">
        <div v-if="!successful">
        <b-row>
          <b-col  md="6">
            <div class="form-group">
              <b-input-group prepend="Código" class="mb-2">
                <input
                  v-model="Producto.Codigo"
                  v-validate="'required|min:3|max:70'"
                  type="Codigo"
                  class="form-control"
                  name="Codigo"
                />
              </b-input-group>
              <div v-if="submitted && errors.has('Codigo')" class="alert-danger">
                {{ errors.first('Codigo') }}
              </div>
            </div>
          </b-col>
          <b-col  md="6">
            <div class="form-group">
              <b-input-group prepend="Nombre" class="mb-2">
                <input
                  v-model="Producto.Nombre"
                  v-validate="'required|min:3'"
                  type="Nombre"
                  class="form-control"
                  name="Nombre"
                />
              </b-input-group>
              <div v-if="submitted && errors.has('Nombre')" class="alert-danger">
                {{ errors.first('Nombre') }}
              </div>
            </div>
          </b-col>
          <b-col  md="6">
            <div class="form-group">
              <b-input-group prepend="Descripción" class="mb-2">
              <input
                v-model="Producto.Descripcion"
                v-validate="'required|min:3'"
                type="text"
                class="form-control"
                name="Descripcion"
              />
              </b-input-group>
              <div
                v-if="submitted && errors.has('Descripcion')"
                class="alert-danger"
              >
                {{ errors.first('Descripcion') }}
              </div>
            </div>
          </b-col>
          <b-col  md="6">
            <div class="form-group">
              <b-input-group prepend="Categorias Productos" class="mb-2">
              <b-form-select
                v-model="Producto.CategoriaProductoId"
                :options="CategoriasProductos"
                value-field="id"
                text-field="Nombre"
              ></b-form-select>
              </b-input-group>
            </div>
          </b-col>
          <b-col  md="6">
            <div class="form-group">
              <b-input-group prepend="Unidad Medida" class="mb-2">
              <b-form-select
                v-model="Producto.UnidadMedidaId"
                :options="UnidadesMedidas"
                value-field="id"
                text-field="Nombre"
              ></b-form-select>
              </b-input-group>
            </div>
          </b-col>
        </b-row>
          <div class="form-group">
            <button class="btn btn-primary btn-block">Crear</button>
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
  name: 'Register',
  data() {
    return {
      content: '',
      BanderaSeguridad: false,
      submitted: false,
      successful: false,
      mensaje: '',
      UnidadesMedidas: [],
      CategoriasProductos: [],
      Producto: {
        Codigo: '',
        Nombre: '',
        Descripcion: '',
        UnidadMedidaId: 1,
        CategoriaProductoId: 1,
      },
    };
  },
  computed: {},
  mounted() {
    axios
      .get(this.$IPServidor + '/api/ListarUnidadesMedidas',{ headers: authHeader()})
      .then((response) => {
        this.UnidadesMedidas = response.data;
      });
    axios
      .get(this.$IPServidor + '/api/ListarCategoriaProducto',{ headers: authHeader()})
      .then((response) => {
        this.CategoriasProductos = response.data;
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
    handle() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          axios
            .post(this.$IPServidor + '/api/CrearProducto', this.Producto,{ headers: authHeader()})
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

