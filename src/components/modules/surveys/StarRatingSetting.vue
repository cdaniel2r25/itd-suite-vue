<template>
  <div>
    <v-text-field
      v-model="selectedItem.question"
      hide-details
      label="Ingresa tu pregunta"
      @change="$emit('apply-saving')"
    />
    <div class="mt-4 d-flex justify-center">
      <v-rating
        v-model="rating"
        :length="selectedItem.option.length"
        color="gray300"
        background-color="grey lighten-1"
      />
    </div>
    <div class="d-flex align-center mt-6">
      <div>Cantidad de estrellas</div>
      <div class="ml-2" style="width: 100px">
        <v-select
          v-model="selectedItem.option.length"
          :items="numberItems"
          dense
          hide-details
          outlined
          @change="$emit('apply-saving')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StarRatingSetting',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rating: 2,
      numberItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    }
  },
}
</script>
