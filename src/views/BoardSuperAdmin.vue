<template>
  <div class="container">
    <header class="jumbotron"  v-if="!BanderaSeguridad" >
      <h3>{{content}}</h3>
    </header>
    <div v-if="BanderaSeguridad" >
      <p>Esto solo lo puede ver el SuperAdmin</p>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Moderator',
  data() {
    return {
      content: '',
      BanderaSeguridad:false
    };
  },
  mounted() {
    UserService.getSuperAdminBoard().then(
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
  }
};
</script>
