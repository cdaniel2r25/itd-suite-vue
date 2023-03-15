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
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          Asignada Por defecto a remitente(s):
        </div>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-center flex-wrap mt-6">
          <v-chip
            v-for="(item, i) in selectedItem.assignedDefault"
            :key="i"
            color="blue200"
            close
            class="mr-2"
            @click:close="$emit('delete-item-assigned', item)"
          >
            {{ item }}
          </v-chip>
        </div>
      </v-card-text>
      <v-card-text class="mt-6 text-center">
        <v-btn text color="primary" @click="addAssignment()">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          asignar por defecto
        </v-btn>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          large
          color="primary"
          class="mb-6"
          @click="$emit('change-model', false)"
        >
          cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AssignedDefaultDialog',
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
  methods: {
    addAssignment() {
      this.$emit('add-assignment')
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
