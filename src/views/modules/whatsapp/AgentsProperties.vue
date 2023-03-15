<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <v-row no-gutters class="mb-4">
          <v-col cols="7">
            <h1>Propiedades de Agentes</h1>
          </v-col>
          <v-col cols="5">
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                :disabled="loading"
                @click="updateAgentsProperties()"
              >
                <v-icon> mdi-content-save </v-icon>GUARDAR
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row
          v-for="property in propertiesCheckboxes"
          :key="property.model"
          no-gutters
        >
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-checkbox
                v-model="agentsProperties[property.model]"
                :label="property.label"
                class="pt-0 my-3 mr-2"
                hide-details
              />
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <span>{{ property.tooltip }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import WhatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  name: 'AgentsProperties',
  mixins: [WhatsappBffMixin],
  data() {
    return {
      loading: false,
      agentsProperties: {
        automaticAssignment: false,
        deleteHistoricalChats: false,
        unassignContacts: false,
        duplicateTreeAutoReplay: false,
      },
      propertiesCheckboxes: [
        {
          model: 'automaticAssignment',
          label: 'Asignación automática',
          tooltip:
            'Realiza una asignación automática de las conversaciones a todos los usuarios con permiso de atención de chat. Se priorizan a los usuarios que tengan menor cantidad de agentes asignados y de no ser así, se asignan los agentes de forma aleatoria.',
        },
        {
          model: 'deleteHistoricalChats',
          label: 'Eliminación automática de conversaciones históricas',
          tooltip:
            'Tiempo en meses para que los contactos archivados en Históricos sean eliminados.',
        },
        {
          model: 'unassignContacts',
          label: 'Desasignación automática de contactos',
          tooltip:
            'Tiempo en minutos para que el contacto automáticamente se desasigne del agente.',
        },
        {
          model: 'duplicateTreeAutoReplay',
          label: 'Intervalo de autorespuestas de árbol duplicados',
          tooltip:
            'Tiempo de espera para que no se envíe otra autorespuesta de árbol cuando ya se envió una previamente. Mínimo 20 segundos.',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.loading = true
    this.agentsProperties = await this.getAgentsPropertiesByClient()
    this.loading = false
  },
  methods: {
    async updateAgentsProperties() {
      this.loading = true
      // TODO: get status code from request to know when trigger the success alert
      const statusCode = 200
      await this.updateAgentsPropertiesByClient(this.agentsProperties)
      if (statusCode === 200)
        this.$store.commit('alert', {
          type: 'success',
          text: 'Se han actualizado las propiedades de agentes con éxito',
        })
      this.loading = false
    },
  },
}
</script>
