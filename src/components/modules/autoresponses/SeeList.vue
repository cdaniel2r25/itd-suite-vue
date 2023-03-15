<template>
  <div class="d-flex">
    <div class="chip-list mr-2 first-list">
      <v-card-title>{{ index + 1 }}</v-card-title>
    </div>
    <div class="chip-list">
      <div>
        <div>{{ btnItem.name }}</div>
      </div>
      <div class="d-flex">
        <v-icon
          color="primary"
          class="button-hover"
          @click="$emit('change-selected-list', btnItem)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          color="primary"
          class="button-hover"
          @click="$emit('delete-item-list', btnItem)"
        >
          mdi-close-circle
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeeList',
  props: {
    btnItem: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
}
</script>
<style scoped>
.button-hover:hover {
  color: #4cbad2 !important;
}
.chip-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  font-size: 14px;
  height: 42px;
  border: 1px solid var(--v-gray300-base);
  padding: 0 10px;
  width: 200px;
}
.first-list {
  width: 50px !important;
  justify-content: center !important;
  background-color: var(--v-gray-base);
}
</style>
