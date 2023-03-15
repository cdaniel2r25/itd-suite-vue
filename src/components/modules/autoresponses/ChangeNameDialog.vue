<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
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
        <v-card-text class="mt-6">
          <v-text-field
            v-model="name.name"
            :label="tipo === 'btn' ? 'Nombre del botón' : 'Nombre de la lista'"
            placeholder="Coloque..."
            outlined
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
              :disabled="name.name === ''"
              color="primary"
              class="ml-4"
              @click="$emit('new-name', name, tipo)"
            >
              guardar
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ChangeNameDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    name: {
      type: Object,
      default: () => ({}),
    },
    show: {
      type: Boolean,
      default: false,
    },
    tipo: {
      type: String,
      default: 'btn',
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
