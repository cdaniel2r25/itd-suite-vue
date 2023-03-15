<template>
  <v-hover v-slot="{ hover }">
    <div
      class="d-flex flex-column align-center text-center"
      style="width: 64px"
    >
      <v-btn
        depressed
        :class="isModal ? 'modal-module-btn' : 'module-btn rounded-lg'"
        :color="isModal ? 'white' : moduleApp.color"
        :text="isModal ? true : false"
        :disabled="!moduleApp.available"
        :elevation="hover ? 2 : 0"
        @click="goToModuleView(moduleApp.viewName)"
      >
        <v-icon large :color="isModal ? 'primary' : 'white'">
          {{ moduleApp.icon }}
        </v-icon>
      </v-btn>
      <div class="module-text mt-4" :class="{ 'modal-module-text': isModal }">
        <div>
          {{ moduleApp.name }}
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script>
export default {
  name: 'ModuleButton',
  props: {
    moduleApp: {
      type: Object,
      default: () => ({}),
    },
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    iconColor: '#FFFFFF',
  }),
  methods: {
    goToModuleView(name) {
      this.$router.push({ name })
    },
  },
}
</script>
<style scoped>
.module-btn {
  height: 64px !important;
  width: 64px;
}
.modal-module-btn {
  height: 40px !important;
  min-width: 40px !important;
  width: 40px;
}
.module-text {
  font-style: normal;
  letter-spacing: 1px;
  color: #979797;
  line-height: 1.1;
}
.modal-module-text {
  font-size: 11px;
}
</style>
