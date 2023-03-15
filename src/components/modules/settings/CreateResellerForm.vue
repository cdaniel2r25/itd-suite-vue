<template>
  <v-container fluid fill-height>
    <v-row>
      <img-input v-model="reseller.img" />
    </v-row>

    <v-row class="pt-10">
      <v-col v-for="input in createResellerInputs" :key="input.id" cols="4">
        <v-text-field
          v-model="reseller[input.input]"
          :label="input.label"
          :placeholder="input.placeholder"
          :rules="_self[input.rules]"
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <h2>Servicios</h2>
        <div v-if="!!applications.length">
          <v-switch
            v-for="application in applications"
            :key="application.id"
            v-model="reseller.applications"
            flat
            :label="application.name"
            :value="application.id"
          />
        </div>
      </v-col>
      <v-col cols="6">
        <h2>Sincronización</h2>
        <v-switch flat label="Sincronización Base de Usuarios" />
        <v-switch flat label="Sincronización Desuscritos" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ImgInput from '@/components/util/ImgInput.vue'
import validationMixin from '@/mixins/validation/validationMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  name: 'CreateResellerForm',
  components: { ImgInput },
  mixins: [validationMixin, adminBffMixin],
  props: {
    reseller: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      createResellerInputs: [
        {
          id: 1,
          input: 'name',
          label: 'Nombre reseller',
          rules: 'resellerRules',
          placeholder: 'Ingresa nombre del Reseller',
        },
        {
          id: 2,
          input: 'email',
          label: 'Email',
          rules: 'emailRules',
          placeholder: 'Ingresa Email del Reseller',
        },
        {
          id: 3,
          input: 'description',
          label: 'Descripción',
          placeholder: 'Ingresa Descripción del Reseller',
        },
        {
          id: 4,
          input: 'appUrl',
          label: 'URL Acceso Plataforma',
          rules: 'urlRules',
          placeholder: 'Ingresa URL',
        },
        {
          id: 5,
          input: 'website',
          label: 'Sitio web reseller',
          rules: 'webRules',
          placeholder: 'Ingresa Sitio Web',
        },
      ],
      applications: [],
    }
  },
  computed: {
    resellerRules() {
      return [(v) => this.isRequired(v, 'Nombre reseller')]
    },
    emailRules() {
      return [
        (v) => this.isRequired(v, 'Email reseller'),
        (v) => this.isValidEmail(v),
      ]
    },
    urlRules() {
      return [(v) => this.isRequired(v, 'URL')]
    },
    webRules() {
      return [(v) => this.isRequired(v, 'Web')]
    },
  },
  async mounted() {
    try {
      this.applications = (await this.getAllApplications()).filter(
        ({ description }) =>
          !['settings', 'administration'].includes(description)
      )
    } catch (e) {
      console.error(e)
    }
  },
}
</script>
