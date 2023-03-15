<template>
  <div class="chip-btn">
    <div>{{ btnItem.name }}</div>
    <div class="d-flex">
      <v-icon
        color="primary"
        class="button-hover"
        @click="$emit('change-name', btnItem)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        color="primary"
        class="button-hover"
        @click="$emit('delete-item-btn', btnItem)"
      >
        mdi-close-circle
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeeButton',
  props: {
    btnItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style scoped>
.button-hover:hover {
  color: #4cbad2 !important;
}
.chip-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 21px;
  font-size: 14px;
  height: 42px;
  border: 1px solid var(--v-primary-base);
  padding: 0 10px;
  width: 200px;
  margin-top: 10px;
}
.chip-btn .button-hover:hover {
  color: #4cbad2 !important;
}
.chip-btn div {
  width: 132px;
  min-width: 132px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
