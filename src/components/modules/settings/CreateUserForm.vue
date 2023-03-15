<template>
  <v-form ref="form" v-model="valid">
    <v-row class="mt-1 flex-wrap">
      <v-col cols="12">
        <v-select
          v-model="userFormObj.clients"
          :items="clients"
          item-text="name"
          item-value="id"
          return-object
          chips
          label="Es cliente de"
          :rules="clientListRules"
          multiple
          outlined
          required
          :height="userFormObj.clients.length > 2 ? 'auto' : '32px'"
          class="mb-n4"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="userFormObj.defaultClient"
          :items="userFormObj.clients"
          item-text="name"
          item-value="id"
          chips
          label="Cliente por defecto"
          :rules="selectedDefaultclientRules"
          :disabled="!userFormObj.clients.length"
          outlined
          height="32px"
          class="mb-n4"
        />
      </v-col>
      <v-col
        v-for="input in createUserInputs"
        :key="input.id"
        md="6"
        sm="12"
        class="inputStyling"
      >
        <v-text-field
          v-model="userFormObj[input.input]"
          :label="input.label"
          :placeholder="input.placeholder"
          :rules="_self[input.rules]"
          class="inputStyling"
          outlined
        />
      </v-col>
    </v-row>
    <v-card
      v-if="userFormObj.password !== undefined"
      flat
      rounded="1"
      color="gray"
      height="80px"
      style="min-width: 300px"
    >
      <v-row>
        <v-col cols="8" class="pl-4">
          <h4 class="font-weight-bold">Contraseña recomendada</h4>
          <v-text-field
            v-model="generatedPassword"
            dense
            solo
            flat
            readonly
            background-color="transparent"
            color="complement"
          />
        </v-col>
        <v-col cols="4" width="100%" align="right">
          <v-btn
            color="transparent"
            icon
            elevation="0"
            class="mt-3 mr-3"
            @click="copy(generatedPassword), (snackbar = true)"
          >
            <v-icon class="mr-1" color="primary"> mdi-content-copy </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-row v-if="userFormObj.password !== undefined" class="pt-8">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="userFormObj.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="show1 ? 'text' : 'password'"
          label="Contraseña"
          hint="Al menos 8 carácteres"
          counter
          outlined
          @click:append="show1 = !show1"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="userFormObj.confirmPassword"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="confirmPasswordRules"
          :type="show2 ? 'text' : 'password'"
          label="Repetir contraseña"
          hint="Al menos 8 carácteres"
          counter
          outlined
          @click:append="show2 = !show2"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="timeout" min-width="10%">
      <h4 style="text-align: center">{{ text }}</h4>
    </v-snackbar>
    <v-btn
      :disabled="!valid"
      color="primary"
      class="white--text"
      @click="validate"
    >
      Siguiente
    </v-btn>
  </v-form>
</template>
<script>
import { mapGetters } from 'vuex'
import validationMixin from '@/mixins/validation/validationMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  mixins: [validationMixin, adminBffMixin],
  props: {
    userFormObj: {
      type: Object,
      default: () => ({}),
    },
    clients: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    valid: true,
    show1: false,
    show2: false,
    snackbar: false,
    text: 'Contraseña copiada!',
    timeout: 1800,
    generatedPassword: '',
    createUserInputs: [
      {
        id: 1,
        input: 'givenName',
        label: 'Nombre',
        rules: 'nameRules',
        placeholder: 'Ingresa nombre',
      },
      {
        id: 2,
        input: 'familyName',
        label: 'Apellido',
        rules: 'lastNameRules',
        placeholder: 'Ingresa apellido',
      },
      {
        id: 3,
        input: 'email',
        label: 'Email',
        rules: 'emailRules',
        placeholder: 'Ingresa email',
      },
      {
        id: 4,
        input: 'phone',
        label: 'Teléfono',
        rules: 'phoneRules',
        placeholder: 'Ingresa teléfono',
      },
    ],
  }),
  computed: {
    ...mapGetters(['userClientsList']),
    emailRules() {
      return [(v) => this.isRequired(v, 'Email'), (v) => this.isValidEmail(v)]
    },
    passwordRules() {
      return [
        (v) => this.isRequired(v, 'Contraseña'),
        (v) => this.minLength(v, 8),
      ]
    },
    confirmPasswordRules() {
      return [
        (v) => this.isRequired(v, 'Confirmar contraseña'),
        (v) => this.minLength(v, 8),
        (v) => this.matchingPasswords(this.userFormObj.password, v),
      ]
    },
    phoneRules() {
      return [
        (v) => this.isRequired(v, 'Teléfono'),
        (v) => this.isValidPhone(v),
        (v) => this.minLength(v, 11),
      ]
    },
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre'), (v) => this.minLength(v, 2)]
    },
    lastNameRules() {
      return [
        (v) => this.isRequired(v, 'Apellido'),
        (v) => this.minLength(v, 2),
      ]
    },
    clientListRules() {
      return [
        this.isRequiredMultiple(this.userFormObj.clients.length, 'cliente'),
      ]
    },
    selectedDefaultclientRules() {
      return [(v) => this.isRequired(v, 'Cliente por defecto')]
    },
  },
  async mounted() {
    this.getPassword()
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$emit('create-new-user', this.userFormObj)
      }
    },
    copy(str) {
      navigator.clipboard.writeText(str)
    },
    getPassword() {
      const passwordLength = 16
      const chars =
        '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+?><:{}[]'
      let generatedPass = ''
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < passwordLength; i++) {
        generatedPass += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      this.generatedPassword = generatedPass
    },
  },
}
</script>
<style scoped>
.inputStyling {
  min-width: 230px;
}
</style>
