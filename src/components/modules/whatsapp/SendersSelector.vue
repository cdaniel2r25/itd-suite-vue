<template>
  <v-container class="px-1">
    <v-select
      v-model="selectedSender"
      :hint="selectedSender.type"
      :items="sendersList"
      :menu-props="{ bottom: true, offsetY: true }"
      item-text="name"
      persistent-hint
      return-object
      single-line
    >
      <template v-slot:prepend>
        <v-avatar class="outlined">
          <v-img
            v-if="selectedSender.img"
            contain
            :aspect-ratio="4 / 3"
            :width="55"
            :src="require('@/assets/logo_itd_oficial_1.png')"
          />
          <v-icon v-else class="primary" color="white">
            mdi-card-account-phone
          </v-icon>
        </v-avatar>
      </template>
      <template v-if="!$vuetify.breakpoint.sm" v-slot:append-outer>
        <v-icon color="greencheck">mdi-check-circle</v-icon>
      </template>
    </v-select>
  </v-container>
</template>

<script>
export default {
  name: 'SendersSelector',
  props: {
    sendersList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedSender: {
        id: '1',
        name: 'ITD Chile',
        businessIdAccount: '',
        phone: '+5698562127',
        state: 'VALIDADO',
        type: 'Cuenta Empresa',
        img: '@/assets/logo_itd_oficial_1.png',
      },
    }
  },
}
</script>

<style scoped>
.v-avatar.outlined.outlined {
  border: 1px solid var(--v-gray300-base);
}
</style>
