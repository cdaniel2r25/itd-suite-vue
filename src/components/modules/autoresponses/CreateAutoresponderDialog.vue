<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <v-card-title class="text-h5 lighten-2 position">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          Crear Autorrespuesta
        </div>
      </v-card-title>
      <v-card-text class="my-10 px-10">
        <v-text-field
          v-model="newAutoresponder"
          label="Nombre"
          color="primary"
          placeholder="Ingresar nombre"
          outlined
          @input="verifyCreate($event)"
        />
      </v-card-text>
      <v-card-actions class="justify-center">
        <div class="mb-6">
          <v-btn
            large
            color="primary"
            outlined
            @click="$emit('change-model', false)"
          >
            cancelar
          </v-btn>
          <v-btn
            large
            color="primary"
            class="ml-4"
            :disabled="activeDisabled"
            @click="createAutoresponder()"
          >
            crear
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateAutoresponderDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newAutoresponder: '',
      activeDisabled: true,
    }
  },
  methods: {
    createAutoresponder() {
      this.$emit('create-autoresponse', this.newAutoresponder)
    },
    verifyCreate(item) {
      if (item.length > 5) {
        this.activeDisabled = false
        return
      }
      this.activeDisabled = true
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
.position {
  position: relative;
}
</style>
