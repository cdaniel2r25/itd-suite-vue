<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card>
      <header-dialog
        header-title="Crear proceso"
        @btn-close-action="cancelDialog()"
      />
      <v-form ref="form" v-model="valid">
        <v-card-text class="body-dialog overflow-y-auto">
          <v-text-field
            v-model="newProcessName"
            label="Nombre"
            placeholder="Ingresar nombre"
            :rules="nameRules"
            dense
            outlined
            class="mx-2"
          />
        </v-card-text>
        <footer-dialog
          :valid="valid"
          @btn-close-action="cancelDialog()"
          @btn-active-action="
            $emit('btn-new-name-process-action', newProcessName)
          "
        />
      </v-form>
      <v-progress-linear
        v-if="saving"
        indeterminate
        color="primary"
        class="mb-0"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'

export default {
  name: 'CreateProcessDialog',
  components: { HeaderDialog, FooterDialog },
  mixins: [validationMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      newProcessName: '',
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
