<template>
  <div class="container">
    <header class="jumbotron" v-if="!BanderaSeguridad">
      <h3>{{ content }}</h3>
    </header>
    <div class="col-md-12  mt-3 card card-container" v-if="BanderaSeguridad">
      <componentelistadoproductos></componentelistadoproductos>
      
    </div>
  </div>
</template>

<script>
import UserService from '../../services/user.service';
import Componentelistadoproductos from '@/components/Componentelistadoproductos'
export default {
  name: 'Register',
  components:{
     Componentelistadoproductos
  },
  data() {
    return {
      content: '',
      BanderaSeguridad: false,
    }
  },
  mounted(){
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
  }
};
</script>

