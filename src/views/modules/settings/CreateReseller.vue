<template>
  <v-container fluid>
    <v-col cols="12">
      <v-row v-if="!creationSuccess">
        <v-stepper v-model="e6" vertical>
          <h1 class="ml-5 mt-5">Creación de Reseller</h1>
          <v-stepper-step :complete="e6 > 1" step="1">
            Información Reseller
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="form" v-model="valid" lazy-validation>
              <create-reseller-form :reseller="reseller" />
            </v-form>
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="submitCreateReseller()"
            >
              Crear
            </v-btn>
          </v-stepper-content>
          <v-stepper-step step=""></v-stepper-step>
        </v-stepper>
      </v-row>
      <v-row v-else-if="creationSuccess">
        <v-col cols="12">
          <v-row>
            <v-alert outlined type="success" class="red--text">
              ¡Se ha creado el reseller con éxito!
            </v-alert>
          </v-row>
          <v-row>
            <v-btn color="primary" @click="goToResellersList('resellers')">
              IR AL LISTADO DE RESELLERS
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import CreateResellerForm from '@/components/modules/settings/CreateResellerForm.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  name: 'CreateReseller',
  components: { CreateResellerForm },
  mixins: [adminBffMixin],
  data() {
    return {
      e6: 1,
      reseller: { applications: [] },
      valid: true,
      creationSuccess: false,
    }
  },
  methods: {
    submitCreateReseller() {
      if (this.$refs.form.validate()) {
        this.createReseller(this.reseller)
          .then(() => {
            this.creationSuccess = true
          })
          .catch(() => {
            this.creationSuccess = false
          })
      }
    },
    goToResellersList(route) {
      this.$router.push(route)
    },
  },
}
</script>

<style scoped>
.v-btn :deep(.v-label) {
  /* ✏️ Label */
  font-weight: bold;
}
</style>
