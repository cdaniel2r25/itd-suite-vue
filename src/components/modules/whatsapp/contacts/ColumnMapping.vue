<template>
  <v-row>
    <v-col class="my-5 color-text" :md="cols" sm="12" lg="5">
      <v-card
        class="pa-5"
        flat
        style="border: solid 2px; border-color: #dcdcdc"
      >
        <v-row>
          <v-col cols="8" style="font-weight: 500" class="color-text">
            Encabezado de columna Contactos
          </v-col>
          <v-col
            cols="4"
            class="d-flex justify-start color-text"
            style="font-weight: 500"
          >
            Corresponde a:
          </v-col>
        </v-row>
        <v-row
          v-for="input in inputs"
          :key="inputs[input]"
          class="mt-n4 mb-2 align-center color-text"
        >
          <v-col cols="12"><v-divider /></v-col>
          <v-col cols="4" class="pl-5">{{ input.label }}</v-col>
          <v-col cols="4" class="d-flex justify-start pl-14 secondary--text">
            <v-icon>mdi-arrow-right</v-icon>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="mapping[input.model]"
              :items="columns"
              label="Columna"
              item-text="field"
              item-value="field"
              hide-details
              outlined
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ColumnMapping',
  props: {
    mapping: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    cols: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      inputs: [
        {
          type: 'text',
          label: 'Nombre',
          model: 'name',
        },
        {
          type: 'text',
          label: 'Teléfono',
          model: 'phone',
        },
      ],
    }
  },

  mounted() {},

  methods: {},
}
</script>

<style scoped>
.color-text {
  color: var(--v-accent-base);
}
</style>
