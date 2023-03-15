<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-sheet outlined color="greencheck" rounded class="mt-4">
        <v-card outlined elevation="0">
          <v-card-text class="text-subtitle-1">
            <v-icon color="greencheck" class="mr-2"> mdi-check-circle </v-icon>
            Se ha enviado con exito la campaña.
          </v-card-text>
        </v-card>
      </v-sheet>
      <div class="mt-6">
        <span class="text-h5">{{ content.title }}</span>
      </div>
    </v-col>
    <v-col cols="6">
      <v-card outlined class="mt-6">
        <v-card-title>{{ content.subtitle }}</v-card-title>
        <v-card-text class="text-left">
          <div v-for="(item, index) in content.items" :key="index">
            <div class="mb-2">
              {{ item.label }} <strong> {{ item.text }} </strong>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-btn
        class="mt-10 px-6"
        color="primary"
        @click="$emit('btn-add-action')"
      >
        Volver listado remitentes
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DialogSentSuccessfully',
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
