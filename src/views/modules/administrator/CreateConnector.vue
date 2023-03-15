<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            text
            color="primary"
            class="px-0"
            @click="$router.push({ name: 'WhatsappConnectors' })"
          >
            <v-icon color="primary"> mdi-arrow-left </v-icon>
            VOLVER A LISTADO
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <h1>
            {{ connectorId === -1 ? 'Crear' : 'Editar' }} conexión Whatsapp
          </h1>
        </v-col>
      </v-row>
      <v-form ref="form" v-model="valid">
        <div class="my-6">General</div>
        <v-row no-gutters>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="itemConnector.name"
                  dense
                  :rules="nameRules"
                  label="Nombre"
                  placeholder="Ingresar nombre"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="itemConnector.type"
                  dense
                  :rules="fieldRules"
                  :items="typeList"
                  label="Tipo"
                  hide-details
                  placeholder="Selecciona tipo"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="itemConnector.host"
                  :rules="nameRules"
                  dense
                  label="Host"
                  placeholder="Ingresar host"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row v-if="false">
              <v-col cols="4">
                <v-text-field
                  v-model="itemConnector.port"
                  dense
                  :rules="nameRules"
                  label="Puerto"
                  placeholder="Ingresar puerto"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="itemConnector.username"
                  dense
                  :rules="nameRules"
                  label="Usuario"
                  placeholder="Ingresar usuario"
                  outlined
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="itemConnector.password"
                  dense
                  :rules="nameRules"
                  label="Contraseña"
                  placeholder="Ingresar contraseña"
                  outlined
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="my-6">Otras opciones</div>
        <v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              v-model="itemConnector.retryTimeout"
              hide-details
              label="Reintentar Timeout"
            />
            <v-checkbox
              v-model="itemConnector.critic"
              hide-details
              label="Crítico"
            />
            <v-checkbox
              v-model="itemConnector.template"
              hide-details
              label="Permite plantilla"
            />
          </v-col>
        </v-row>
        <div v-if="!validRecord" class="mt-6 d-flex">
          <v-btn
            class="mr-2"
            outlined
            color="primary"
            @click="$router.push({ name: 'WhatsappConnectors' })"
          >
            cancelar
          </v-btn>
          <v-btn
            depressed
            :disabled="!valid"
            color="primary"
            @click="createConnector()"
          >
            {{ connectorId === -1 ? 'Crear conexión' : 'Guardar' }}
          </v-btn>
        </div>
        <div v-else class="mt-6">
          <v-alert outlined type="success">
            Se ha {{ connectorId === -1 ? 'creado' : 'editado' }} con éxito
            conector.
          </v-alert>
          <v-btn
            depressed
            color="primary"
            @click="$router.push({ name: 'WhatsappConnectors' })"
          >
            ir a listado de CONECTORES
          </v-btn>
        </div>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateConnector',
  mixins: [validationMixin, administratorBffMixin],
  data() {
    return {
      valid: false,
      validRecord: false,
      connectorId: 0,
      itemConnector: {
        id: '-1',
        name: '',
        type: '',
        host: '',
        retryTimeout: false,
        critic: false,
        template: false,
      },
      typeList: ['DUMMY', '360 DIALOG'],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, '')]
    },
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    ipRuler() {
      return [(v) => this.isValidIp(v)]
    },
  },
  created() {
    this.connectorId = this.$route.params.id
    if (this.connectorId !== -1) {
      this.findConnector()
    }
  },
  methods: {
    async findConnector() {
      this.itemConnector = await this.findConnectorId(
        this.clientId,
        this.connectorId
      )
    },
    async createConnector() {
      this.itemConnector.clienteId = this.clientId
      const result = await this.saveConnector(this.itemConnector)
      console.log(this.itemConnector)
      if (result) {
        this.validRecord = true
      }
    },
  },
}
</script>
