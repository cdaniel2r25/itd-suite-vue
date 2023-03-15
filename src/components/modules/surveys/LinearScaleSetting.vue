<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <div class="mt-6 d-flex align-center">
      <div class="mr-4">De</div>
      <div style="width: 70px">
        <v-select
          v-model.number="selectedItem.option.from"
          :items="listNumeric"
          hide-details
          class="mx-1 pt-0 mt-0"
          @change="$emit('apply-saving')"
        />
      </div>
      <div class="ml-10 mr-4">a</div>
      <div style="width: 70px">
        <v-select
          v-model.number="selectedItem.option.to"
          :items="listNumeric"
          hide-details
          class="mx-1 pt-0 mt-0"
          @change="$emit('apply-saving')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinearScaleSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      listNumeric: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    }
  },
}
</script>
