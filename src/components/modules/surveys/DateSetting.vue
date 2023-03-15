<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <div class="mt-10 d-flex align-center">
      <v-icon color="gray300">mdi-calendar</v-icon>
      <div style="width: 120px">
        <v-text-field
          v-model="selectedItem.option.date"
          hide-details
          dense
          label="Fecha"
          class="ml-2"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
