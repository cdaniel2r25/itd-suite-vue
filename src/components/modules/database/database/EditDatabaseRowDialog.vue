<template>
  <v-dialog v-model="show" persistent width="550">
    <v-card>
      <header-dialog
        header-title="Editar registro"
        :activate-close-button="showCancelBtn"
        @btn-close-action="cancelDialog()"
      />
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-text class="body-dialog overflow-y-auto">
          <div v-for="(key, index) in Object.keys(itemDatabase)" :key="index">
            <v-text-field
              v-if="
                key !== 'id' &&
                key !== 'customTableId' &&
                key !== 'uuid' &&
                key !== 'menu'
              "
              v-model="itemDatabase[key]"
              :label="key"
              :placeholder="key"
              :rules="nameRules"
              dense
              outlined
            />
          </div>
        </v-card-text>
        <footer-dialog
          button-label="GUARDAR"
          :valid="valid"
          :activate-close-button="showCancelBtn"
          @btn-close-action="cancelDialog()"
          @btn-active-action="editAction()"
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
  name: 'EditDatabaseRowDialog',
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
    itemDatabase: {
      type: Object,
      default: () => {},
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      valid: true,
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
  },
  methods: {
    cancelDialog() {
      this.$emit('primary-btn-cancel')
    },
    editAction() {
      this.$emit('input', this.itemDatabase)
      this.$emit('primary-btn-action')
    },
  },
}
</script>
<style scoped>
.body-dialog {
  max-height: calc(100vh * 0.7);
}
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
</style>
