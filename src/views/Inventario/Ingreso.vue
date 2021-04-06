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
            ><h1 class="text-primary">Ingreso a Inventario</h1></b-col
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
                <b-col md="6">
                  <h3>Detalle del Ingreso</h3>
                  <b-table
                    responsive
                    striped
                    hover
                    :items="IngresoDetalle"
                    :fields="fields"
                  >
                  <template #cell(Cantidad)="data">
                     <b-form-input v-model="data.item.Cantidad" ></b-form-input>
                  </template>
                  <template #cell(CostoUnitario)="data">
                     <b-form-input v-model="data.item.CostoUnitario" ></b-form-input>
                  </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
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
        { key: 'Cantidad' },
        { key: 'CostoUnitario' }
      ],
      IngresoDetalle: [{ Cantidad: 1, CostoUnitario: 10.5 }],
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
