<template>
  <div class="pa-10">
    <v-form ref="form" v-model="valid">
      <div class="text-h4 accent--text">Asignar remitente a conector</div>
      <v-row no-gutters class="mt-10 accent--text">
        <v-col cols="12" class="text-h6">
          Selecciona conector al que quieres asignar al remitente
        </v-col>
        <v-col cols="4" class="mt-5">
          <v-select
            v-model="senderObj.connector"
            outlined
            class="pr-5"
            label="Selección"
            placeholder="Selecciona una conexión"
            :items="connectionsList"
            item-text="name"
            item-value="id"
            :rules="connectorRules"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="accent--text">
        <v-col cols="12" class="text-h6 my-3">General</v-col>
        <v-col v-for="input in senderGeneralInputs" :key="input.input" cols="4">
          <v-text-field
            v-model="senderObj[input.input]"
            class="pr-5"
            :label="input.label"
            :placeholder="input.placeholder"
            :rules="_self[input.rules]"
            :type="input.type"
            outlined
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="accent--text">
        <v-col cols="12" class="text-h6 my-3">Atributos conector</v-col>
        <v-col v-for="input in connectorInputs" :key="input.input" cols="4">
          <v-text-field
            v-model="senderObj[input.input]"
            class="pr-5"
            :label="input.label"
            :placeholder="input.placeholder"
            :rules="_self[input.rules]"
            :type="input.type"
            outlined
          />
        </v-col>
      </v-row>
    </v-form>
    <v-row no-gutters class="mt-5">
      <div>
        <v-btn
          outlined
          color="primary"
          @click="$router.push({ name: 'WhatsappConnectors' })"
        >
          cancelar
        </v-btn>
        <v-btn
          class="ml-5"
          color="primary"
          :disabled="!valid"
          @click="assignSenderToConnection()"
        >
          asignar
        </v-btn>
      </div>
    </v-row>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  name: 'SenderForm',
  mixins: [adminBffMixin, validationMixin],

  data() {
    return {
      valid: false,
      senderObj: {},
      connectionsList: [],
      senderGeneralInputs: [
        {
          input: 'name',
          label: 'Nombre',
          rules: 'nameRules',
          placeholder: 'Ingresa nombre',
          type: 'text',
        },
        {
          input: 'iterationMessages',
          label: 'Cantidad mensajes por iteración',
          rules: 'iterationMessagesRules',
          placeholder: 'Ingresa cantidad',
          type: 'number',
        },
        {
          input: 'windowsSize',
          label: 'Windows size',
          rules: 'windowsSizeRules',
          placeholder: 'Ingresa windows size',
          type: 'number',
        },
        {
          input: 'iterationInterval',
          label: 'Intervalos por cada iteración',
          rules: 'iterationIntervalRules',
          placeholder: 'Ingresa intervalos',
          type: 'number',
        },
        {
          input: 'token',
          label: 'Token',
          rules: 'tokenRules',
          placeholder: 'Ingresar token',
          type: 'text',
        },
        {
          input: 'phone',
          label: 'ANI',
          rules: 'aniRules',
          placeholder: 'Ingresar ANI',
          type: 'text',
        },
      ],
      connectorInputs: [
        {
          input: 'apiKey',
          label: 'API-KEY',
          rules: 'apikeyRules',
          placeholder: 'Ingresar API-KEY',
          type: 'text',
        },
        {
          input: 'webhook',
          label: 'Configuración Webhook',
          rules: 'webhookRules',
          placeholder: 'Ingresar configuración webhook',
          type: 'text',
        },
      ],
    }
  },
  computed: {
    connectorRules() {
      return [(v) => this.isRequired(v, 'Conector')]
    },
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre')]
    },
    iterationMessagesRules() {
      return [(v) => this.isRequired(v, 'Cantidad mensajes por iteración')]
    },
    windowsSizeRules() {
      return [(v) => this.isRequired(v, 'Windows size')]
    },
    iterationIntervalRules() {
      return [(v) => this.isRequired(v, 'Intervalos por cada iteración')]
    },
    tokenRules() {
      return [(v) => this.isRequired(v, 'Token')]
    },
    aniRules() {
      return [(v) => this.isRequired(v, 'ANI')]
    },
    apikeyRules() {
      return [(v) => this.isRequired(v, 'API-KEY')]
    },
    webhookRules() {
      return [(v) => this.isRequired(v, 'Configuración Webhook')]
    },
  },
  mounted() {
    if (this.$route.params.id && this.$route.params.id !== '') this.getSender()
    this.getConnectionsList()
  },

  methods: {
    async getSender() {
      this.senderObj = await this.getAssignedSender(this.$route.params.id)
    },
    async getConnectionsList() {
      let id = '-1'
      if (this.clientIdAux !== '') id = this.clientIdAux
      const filterService = {
        clientId: id,
        page: -1,
      }
      console.log(filterService)
      const connectionsObjectQuery = await this.getWhatsappConnections(
        filterService
      )
      this.connectionsList = await connectionsObjectQuery.dataList
    },
    async assignSenderToConnection() {
      if (this.valid)
        await this.assignSenderToWhatsappConnection(this.senderObj)
      this.$router.push({ name: 'WhatsappConnectors' })
    },
  },
}
</script>
