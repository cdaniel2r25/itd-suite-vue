<template>
  <v-dialog v-model="show" width="550">
    <v-card>
      <v-card-title class="text-h5 lighten-2">
        <v-btn
          v-if="isCancel"
          color="grey"
          plain
          class="btn-cancel"
          @click="cancelDialog()"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          {{ title }}
        </div>
      </v-card-title>
      <v-card-text align="center" class="pb-0">
        <v-icon x-large color="warning" class="pb-5"> {{ icon }} </v-icon>
        <br />
        {{ textAlert }}
      </v-card-text>
      <v-card-text v-if="textAlert2 !== ''" align="center">
        {{ textAlert2 }}
      </v-card-text>
      <v-card-actions class="justify-center pb-10">
        <v-btn
          v-if="isCancel"
          large
          outlined
          color="primary"
          @click="cancelDialog()"
        >
          {{ secondaryBtnText }}
        </v-btn>
        <v-btn
          large
          color="primary"
          :class="{ 'ml-5': isCancel }"
          @click="$emit('primary-btn-action')"
        >
          {{ primaryBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    isCancel: {
      type: Boolean,
      default: true,
    },
    textAlert: {
      type: String,
      default: '',
    },
    textAlert2: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'mdi-alert-circle',
    },
    primaryBtnText: {
      type: String,
      default: 'Aceptar',
    },
    secondaryBtnText: {
      type: String,
      default: 'Cancelar',
    },
  },
  methods: {
    cancelDialog() {
      this.$emit('change-model', false)
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
</style>
