<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <div class="mt-6">
      <div class="div-class">
        <div class="d-flex">
          <div style="width: 100px; min-width: 100px">&nbsp;</div>
          <div
            v-for="(col, i) in selectedItem.options.columns"
            :key="i"
            class="px-1 d-flex align-center"
            style="width: 110px"
          >
            <v-text-field
              v-model="col.col"
              hide-details
              class="caption px-1 pt-0"
              style="width: 76px; min-width: 76px"
              @change="$emit('apply-saving')"
            />
            <v-btn
              icon
              color="gray300"
              class="mr-0"
              width="24"
              @click="$emit('delete-col-option', selectedItem, i)"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div
          v-for="(row, rowi) in selectedItem.options.rows"
          :key="rowi"
          class="d-flex align-center mb-1"
        >
          <div
            class="d-flex align-center"
            style="width: 100px; min-width: 100px"
          >
            <v-text-field
              v-model="row.row"
              hide-details
              class="caption pt-0"
              style="width: 76px; min-width: 76px"
              @change="changeRow(row.row, rowi)"
            />
            <v-btn
              icon
              color="gray300"
              class="mr-0"
              @click="$emit('delete-row-option', selectedItem, rowi)"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
          <div
            v-for="coli in selectedItem.options.columns.length"
            :key="coli"
            class="px-1 text-center"
            style="width: 110px; min-width: 110px"
          >
            <v-icon color="gray300">mdi-square-rounded-outline</v-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex mt-10">
      <v-btn outlined color="primary" @click="$emit('add-row')">
        <v-icon left>mdi-plus</v-icon>
        añadir fila
      </v-btn>
      <v-btn class="ml-2" outlined color="primary" @click="$emit('add-col')">
        <v-icon left>mdi-plus</v-icon>
        añadir columna
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelectionsSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    changeRow(text, rowi) {
      this.selectedItem.response[rowi].value = text
      this.$emit('apply-saving')
    },
  },
}
</script>
<style scoped>
.div-class {
  width: 652px;
  max-width: 652px;
  overflow: auto;
}
</style>
