<template>
  <v-dialog v-model="show" width="550">
    <v-card>
      <v-card-title class="text-h5 lighten-2 d-flex justify-space-between">
        <div></div>
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
        ¿Está seguro de eliminar <b>{{ selectedRestriccion.name }}</b> que esta
        <br />
        siendo utilizada en restricciones?
        <div class="mt-3">
          Por seguridad ingresa la palabra ‘borrar’ para confirmar.
        </div>
        <v-text-field
          v-model="textDelete"
          label='Ingresar "borrrar"'
          placeholder='Ingresar "borrrar"'
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
          @click="$emit('btn-delete-action')"
        >
          SI ELIMINAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteRestrictionDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    selectedRestriccion: {
      type: Object,
      default: () => ({}),
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disabledDelete: true,
      textDelete: '',
    }
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
