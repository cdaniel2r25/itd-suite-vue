<template>
  <div class="pa-1">
    <v-row no-gutters class="mt-2 mb-8">
      Aquí podrás configurar cuenta de usuario
    </v-row>
    <div class="d-flex flex-wrap divCustomWidth">
      <div
        v-for="input in inputs"
        :key="input.model"
        class="d-flex align-center my-1"
      >
        <p style="width: calc(100% - 40px)">{{ input.label }}</p>
        <v-switch
          v-model="userObj.config[input.model]"
          color="primary"
          class="mt-0"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateUserConfig',
  props: {
    userObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      inputs: [
        {
          model: 'enabled',
          label: 'Habilitada',
        },
        {
          model: 'mailNotification',
          label: 'Notificar por correo',
        },
        {
          model: 'expiredPassword',
          label: 'Contraseña caducada',
        },
        {
          model: 'blocked',
          label: 'Bloqueada',
        },
        {
          model: 'refreshPassword',
          label: 'Refrescar contraseña cada 6 meses',
        },
        {
          model: 'enablePassword',
          label: 'Activar contraseña',
        },
        {
          model: 'expiredAccount',
          label: 'Caducada',
        },
      ],
    }
  },
}
</script>

<style scoped>
@media only screen and (min-width: 1000px) {
  .divCustomWidth {
    margin-right: calc(100% - 800px) !important;
  }
  .divCustomWidth div {
    width: 400px;
  }
}
@media only screen and (max-width: 1000px) {
  .divCustomWidth {
    margin-right: 300px;
  }
  .divCustomWidth div {
    width: 400px;
  }
}
</style>
