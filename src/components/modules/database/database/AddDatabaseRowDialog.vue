<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <header-dialog
        :activate-close-button="showCancelBtn"
        header-title="Añadir registros manualmente"
        @btn-close-action="cancelDialog()"
      />
      <v-form ref="form" v-model="valid">
        <v-card-text class="body-dialog overflow-y-auto">
          <div class="box-row px-6 pt-6">
            <div v-for="(head, key, index) in selectedDatabase" :key="index">
              <v-text-field
                v-if="key !== 'menu'"
                v-model="selectedDatabase[key]"
                :label="headers[key]"
                :placeholder="`Escriba ${headers[key]}`"
                :rules="nameRules"
                dense
                outlined
              />
            </div>
          </div>
          <div class="mt-6">
            <v-alert
              v-model="alertRegAdd"
              :value="alertRegAdd"
              dense
              text
              dismissible
              transition="scale-transition"
              type="success"
            >
              La información fue registrado satisfactoriamente
            </v-alert>
          </div>
        </v-card-text>
        <footer-dialog
          :activate-close-button="showCancelBtn"
          :valid="valid"
          @btn-close-action="cancelDialog()"
          @btn-active-action="$emit('primary-btn-add-action')"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'

export default {
  name: 'AddDatabaseRowDialog',
  components: { HeaderDialog, FooterDialog },
  mixins: [validationMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    alertRegAdd: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    selectedDatabase: {
      type: Object,
      default: () => {},
    },
    headers: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      valid: false,
      alertReg: false,
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
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
.body-dialog {
  max-height: calc(100vh * 0.7);
}
.box-row {
  border: 1px solid var(--v-gray100-base);
  width: 100%;
  overflow-y: auto;
}
</style>
