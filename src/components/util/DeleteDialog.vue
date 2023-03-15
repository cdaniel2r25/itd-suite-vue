<template>
  <v-dialog v-model="dialogDelete" width="550">
    <v-card>
      <v-card-title class="text-h5 lighten-2 d-flex justify-space-between">
        <div>{{ title }}</div>
        <v-btn
          color="grey"
          plain
          style="font-size: 1rem"
          @click="$emit('change-model', false)"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text align="center">
        <v-icon x-large color="warning" class="pb-5"> mdi-alert-circle </v-icon>
        <br />
        ¿Está seguro de eliminar <b> {{ elementToDelete }} </b>?
        <div class="mt-3">
          Por seguridad ingresa la palabra ‘borrar’ para confirmar.
        </div>
        <v-text-field
          v-model="textDelete"
          label='Ingresar "borrar"'
          placeholder='Ingresar "borrar"'
          type="text"
          outlined
          class="mt-10 mx-16"
          @input="verifyDelete($event)"
        />
      </v-card-text>
      <v-card-actions class="justify-center pb-10">
        <v-btn
          large
          outlined
          color="primary"
          @click="$emit('change-model', false)"
        >
          CANCELAR
        </v-btn>
        <v-btn
          large
          color="primary"
          depressed
          class="ml-5"
          :disabled="disabledDelete"
          @click="$emit('btn-active-action')"
        >
          SI ELIMINAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DeleteDialog',
  model: {
    prop: 'dialogDelete',
    event: 'change-model',
  },
  props: {
    dialogDelete: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    elementToDelete: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      disabledDelete: true,
      textDelete: '',
    }
  },
  watch: {
    dialogDelete: {
      handler(value) {
        if (!value) this.textDelete = ''
      },
    },
  },
  methods: {
    verifyDelete(item) {
      if (item === 'borrar') {
        this.disabledDelete = false
        return
      }
      this.disabledDelete = true
    },
  },
}
</script>
<style></style>
