<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12  mt-3 card card-container" v-if="BanderaSeguridad">
      <header>
         <b-row class="mb-4" align-v="center">
            <b-col md="1" ><b-avatar variant="primary" icon="screwdriver"></b-avatar></b-col>
            <b-col md="11"><h1  class="text-primary ">{{titulo}} </h1></b-col>
          </b-row>
      </header>
      <form name="form" @submit.prevent="handle">
        <div v-if="!successful">
          <b-row>
            <b-col  md="6">
              <div class="form-group">
                <label for="UnidadesMedidas">Activo</label>
                <b-form-checkbox
                  switch 
                  v-model="Producto.Activo"
                  type="checkbox"
                  name="Activo"
                  :disabled =BanderaVer
                ></b-form-checkbox>
              </div>
            </b-col>
            <b-col  md="6">
              <div class="form-group">
                <b-input-group prepend="Codigo" class="mb-2">
                  <input
                    v-model="Producto.Codigo"
                    v-validate="'required|min:3|max:70'"
                    type="Codigo"
                    class="form-control"
                    name="Codigo"
                    disabled
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
                    :disabled =BanderaVer
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
                    type="Descripcion"
                    class="form-control"
                    name="Descripcion"
                    :disabled =BanderaVer
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
                    :disabled =BanderaVer
                  ></b-form-select>
                </b-input-group>
              </div>
            </b-col>
            <b-col  md="6">
              <div class="form-group">
                <b-input-group prepend="Unidad de Medida" class="mb-2">
                  <b-form-select
                    v-model="Producto.UnidadMedidaId"
                    :options="UnidadesMedidas"
                    value-field="id"
                    text-field="Nombre"
                    :disabled =BanderaVer
                  ></b-form-select>
                </b-input-group>
              </div>
            </b-col>
          </b-row>
          <div class="form-group">
            <button  v-if="!BanderaVer" class="btn boton-tamano btn-primary btn-block">Modificar</button>
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
  name: 'Modificar',
  data() {
    return {
      content: '',
      BanderaSeguridad: false,
      BanderaVer:false,
      submitted: false,
      successful: false,
      titulo:'Modificar Producto',
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
    this.BanderaVer= this.$route.params.ver
    if (this.BanderaVer) this.titulo ='Ficha del producto'
    axios
      .get(this.$IPServidor + '/api/ListarUnidadesMedidas', {
        headers: authHeader(),
      })
      .then((response) => {
        this.UnidadesMedidas = response.data;
      });
    axios
      .get(this.$IPServidor + '/api/verproducto', {
        params: {
          id: this.$route.params.id,
        },
        headers: authHeader(),
      })
      .then((response) => {
        this.Producto = response.data;
        this.Producto.Activo = this.Producto.Activo == 'Si' ? true : false;
      });
    axios
      .get(this.$IPServidor + '/api/ListarCategoriaProducto',{ headers: authHeader() })
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
            .post(this.$IPServidor + '/api/ModificarProducto', this.Producto,{ headers: authHeader() })
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
