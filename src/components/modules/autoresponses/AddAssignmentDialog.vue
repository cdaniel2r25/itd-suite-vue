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
          Asignar Por defecto
        </div>
      </v-card-title>
      <v-card-text class="text-center">
        Asigna Por defecto la autorrespuesta a:
      </v-card-text>
      <v-card-text>
        <v-select
          v-model="selectedItem.assignedDefault"
          :items="sendersList"
          color="primary"
          chips
          label="Remitentes"
          multiple
          outlined
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
          <v-btn large color="primary" class="ml-4" @click="changeList">
            guardar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'

export default {
  name: 'AddAssignmentDialog',
  mixins: [customTableBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      sendersList: null,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.sendersList = await this.getExistingSenders(this.clientId)
  },
  methods: {
    changeList() {
      this.$emit('save-changes-new', this.selectedItem)
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
.position {
  position: relative;
}
</style>
