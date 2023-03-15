<template>
  <div>
    <div v-for="itemHeaders in listHeaders" :key="itemHeaders.id">
      <v-row no-gutters class="align-center caption mx-2">
        <v-col cols="3" class="font-weight-medium">
          <v-switch
            v-model="itemHeaders.isRequired"
            color="primary"
            :disabled="itemHeaders.isObligatory"
            hide-details
            class="pt-0 mt-0"
          />
        </v-col>
        <v-col
          cols="4"
          class="font-weight-medium"
          :class="itemHeaders.isRequired ? '' : 'darkgray--text'"
        >
          {{ itemHeaders.key }}
        </v-col>
        <v-col
          cols="4"
          class="font-weight-medium"
          :class="itemHeaders.isRequired ? '' : 'darkgray--text'"
        >
          {{ itemHeaders.value }}
        </v-col>
        <v-col cols="1" class="font-weight-medium">
          <v-btn
            icon
            color="primary"
            :disabled="!(itemHeaders.isEditable && itemHeaders.isRequired)"
            @click="$emit('edit-hearders', itemHeaders)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-1"> </v-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableHeadersParameter',
  props: {
    listHeaders: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
