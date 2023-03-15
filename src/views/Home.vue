<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div class="home">
        <modules-list v-if="availableModules" :modules="availableModules" />
      </div>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ModulesList from '@/components/home/ModulesList.vue'

export default {
  name: 'Home',
  components: {
    ModulesList,
  },
  computed: {
    ...mapGetters(['availableModules']),
  },
}
</script>
