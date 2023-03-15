<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <v-card-title class="text-h5 lighten-2 position">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-6 text-center">
        <v-icon color="secondary" large>mdi-alert-circle</v-icon>
      </v-card-text>
      <v-card-text class="mt-6 px-10 text-center">
        ¿Está seguro de eliminar autorrespuesta
        <span class="font-weight-bold">{{ selectedItem.name }}</span> que está
        siendo utilizada en campaña Cobranzas en curso?
      </v-card-text>
      <v-card-text class="mt-6 text-center">
        Por seguridad ingresa la palabra ‘borrar’ para confirmar.
      </v-card-text>
      <v-card-text class="mt-6">
        <v-text-field
          v-model="textDelete"
          label="Ingresar borrrar"
          placeholder="Ingresar borrrar"
          type="text"
          outlined
          class="mt-10 mx-16"
          @input="verifyDelete($event)"
        />
      </v-card-text>
      <v-card-actions class="justify-center">
        <div class="mb-6">
          <v-btn
            large
            color="primary"
            outlined
            @click="$emit('change-model', false)"
          >
            cancelar
          </v-btn>
          <v-btn
            large
            :disabled="disabledDelete"
            color="primary"
            class="ml-4"
            @click="actionDelete()"
          >
            si eliminar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteAutoresponseDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => ({}),
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
    actionDelete() {
      this.textDelete = ''
      this.$emit('delete-autoresponse', this.selectedItem)
      this.$emit('change-model', false)
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.position {
  position: relative;
}
</style>
