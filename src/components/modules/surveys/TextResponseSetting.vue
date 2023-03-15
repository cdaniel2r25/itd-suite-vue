<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <v-textarea
      disabled
      auto-grow
      outlined
      rows="1"
      row-height="100"
      hide-details
      placeholder="Ingresa tu respuesta..."
      class="mt-6"
    />
    <div class="mt-1 d-flex justify-end align-center">
      <div>Máximo</div>
      <div style="width: 50px">
        <v-text-field
          v-model.number="selectedItem.option.maximumCharacters"
          hide-details
          solo
          dense
          flat
          @change="$emit('apply-saving')"
        />
      </div>
      <div>caracteres.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextResponseSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
