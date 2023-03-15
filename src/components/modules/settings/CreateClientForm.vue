<template>
  <v-container fluid fill-height>
    <v-skeleton-loader v-if="loading" type="table-tbody" />
    <v-row v-else class="pt-8">
      <v-col
        v-for="input in createClientInputs"
        :key="input.id"
        :cols="input.type === 'title' ? 12 : 4"
      >
        <v-text-field
          v-if="input.type === 'text'"
          v-model="client[input.input]"
          :label="input.label"
          :placeholder="input.placeholder"
          :rules="_self[input.rules]"
          outlined
          persistent-placeholder
        />
        <v-combobox
          v-else-if="input.type === 'timeZoneSelect'"
          v-model="client[input.input]"
          :items="_self[input.items]"
          :placeholder="input.placeholder"
          :rules="_self[input.rules]"
          :label="input.label"
          outlined
          height="32px"
          class="mb-n4"
          persistent-placeholder
        />
        <v-combobox
          v-else-if="input.type === 'select'"
          v-model="client[input.input]"
          :items="_self[input.items]"
          :rules="_self[input.rules]"
          :label="input.label"
          :placeholder="input.placeholder"
          item-value="id"
          item-text="name"
          outlined
          height="32px"
          class="mb-n4"
          persistent-placeholder
        />
        <v-combobox
          v-else-if="input.type === 'countriesSelect'"
          v-model="client[input.input]"
          :items="_self[input.items]"
          :rules="_self[input.rules]"
          :label="input.label"
          :placeholder="input.placeholder"
          item-value="code"
          item-text="name"
          outlined
          height="32px"
          class="mb-n4"
          persistent-placeholder
        />
        <v-combobox
          v-else-if="input.type === 'localeSelect'"
          v-model="client[input.input]"
          :items="_self[input.items]"
          :rules="_self[input.rules]"
          :label="input.label"
          :placeholder="input.placeholder"
          item-value="locale"
          item-text="language"
          outlined
          height="32px"
          class="mb-n4"
          persistent-placeholder
        />
        <div v-if="input.type === 'title'" class="mt-5">
          {{ input.label }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import dateMixin from '@/mixins/util/dateMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  name: 'CreateClientForm',
  mixins: [validationMixin, dateMixin, adminBffMixin],
  props: {
    client: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      resellersByClient: [],
      timezoneList: [],
      countriesList: [],
      localesList: [],
      createClientInputs: [
        {
          id: 1,
          input: 'name',
          label: 'Nombre',
          rules: 'nameRules',
          placeholder: 'Ingresa nombre',
          type: 'text',
        },
        {
          id: 2,
          input: 'rut',
          label: 'RUT',
          rules: 'rutRules',
          placeholder: 'Ingresa Rut',
          type: 'text',
        },
        {
          id: 3,
          input: 'phone',
          label: 'Teléfono',
          rules: 'phoneRules',
          placeholder: 'Ingresa teléfono',
          type: 'text',
        },
        {
          id: 4,
          input: 'legalName',
          label: 'Nombre legal',
          rules: 'legalNameRules',
          placeholder: 'Ingresa el Nombre legal',
          type: 'text',
        },
        {
          id: 5,
          input: 'email',
          label: 'Email',
          rules: 'emailRules',
          placeholder: 'Ingresa Email',
          type: 'text',
        },
        {
          id: 6,
          input: 'address',
          label: 'Dirección',
          rules: 'addressRules',
          placeholder: 'Ingresa dirección',
          type: 'text',
        },
        {
          id: 7,
          input: 'country',
          label: 'Pais',
          items: 'countriesList',
          rules: 'countryRules',
          placeholder: 'Ingresa País',
          type: 'countriesSelect',
        },
        {
          id: 8,
          input: 'city',
          label: 'Ciudad',
          rules: 'cityRules',
          placeholder: 'Ingresa ciudad',
          type: 'text',
        },
        {
          id: 9,
          input: 'town',
          label: 'Comuna',
          rules: 'townRules',
          placeholder: 'Ingresa comuna',
          type: 'text',
        },
        {
          id: 10,
          input: 'timezone',
          items: 'timezoneList',
          label: 'Zona horaria',
          placeholder: 'Selecciona zona horaria',
          rules: 'timeZoneRules',
          type: 'timeZoneSelect',
        },
        {
          id: 11,
          input: 'locale',
          items: 'localesList',
          label: 'Localidad / Lenguaje',
          placeholder: 'Selecciona localidad',
          rules: 'localeRules',
          type: 'localeSelect',
        },
        {
          id: 12,
          input: 'reseller',
          items: 'resellersByClient',
          label: 'Reseller',
          rules: 'resellerRules',
          placeholder: 'Selecciona Reseller',
          type: 'select',
        },
        {
          id: 13,
          label: 'Tamaño máximo subida de archivos',
          type: 'title',
        },
        {
          id: 14,
          input: 'maxfilesize',
          label: 'Megas',
          placeholder: 'Ingresa tamaño máximo de archivos',
          type: 'text',
        },
      ],
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre cliente')]
    },
    rutRules() {
      return [(v) => this.isRequired(v, 'Rut cliente')]
    },
    phoneRules() {
      return [
        (v) => this.isRequired(v, 'Teléfono'),
        (v) => this.minLength(v, 11),
        (v) => this.maxLength(v, 12),
      ]
    },

    legalNameRules() {
      return [(v) => this.isRequired(v, 'Nombre legal')]
    },
    emailRules() {
      return [(v) => this.isRequired(v, 'Email'), (v) => this.isValidEmail(v)]
    },
    addressRules() {
      return [(v) => this.isRequired(v, 'Dirección cliente')]
    },
    townRules() {
      return [(v) => this.isRequired(v, 'Comuna')]
    },

    cityRules() {
      return [(v) => this.isRequired(v, 'Ciudad')]
    },
    timeZoneRules() {
      return [(v) => this.isRequired(v, 'Zona horaria')]
    },

    localeRules() {
      return [(v) => this.isRequired(v, 'Localidad')]
    },

    countryRules() {
      return [(v) => this.isRequired(v, 'País')]
    },
    resellerRules() {
      return [(v) => this.isRequired(v, 'Reseller')]
    },
  },
  async mounted() {
    this.loading = true
    this.resellersByClient = await this.getResellersByClient()
    const filterInit = await this.getFilterInit()
    this.timezoneList = filterInit.timezoneList
    this.localesList = filterInit.localesList
    this.countriesList = filterInit.countriesList
    this.loading = false
  },
}
</script>
