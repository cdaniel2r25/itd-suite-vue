<template>
  <v-app v-if="!$auth.loading" id="app">
    <v-main>
      <component :is="layout" />
    </v-main>
  </v-app>
</template>

<script>
import BlankLayout from '@/layouts/BlankLayout.vue'
import SuiteLayout from '@/layouts/SuiteLayout.vue'

const layouts = {
  BlankLayout,
  SuiteLayout,
}

export default {
  name: 'App',
  computed: {
    layout() {
      return layouts[this.$route.meta.layout || 'SuiteLayout']
    },
  },
}
</script>
<style lang="scss">
body {
  margin: 0 !important;
}
.striped-table tbody tr:nth-of-type(odd) {
  background-color: var(--v-gray100-base);
}
.striped-table tr th {
  min-width: 180px;
}
.rotate {
  animation: rotation 2s infinite linear;
}
.inverse-rotate {
  animation: inverse-rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes inverse-rotation {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

::-webkit-scrollbar {
  -webkit-appearance: none;
}

::-webkit-scrollbar:vertical {
  width: 12px;
}

::-webkit-scrollbar-button:increment,
::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--v-gray300-base);
  border-radius: 20px;
  border: 2px solid var(--v-gray-base);
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}
</style>
