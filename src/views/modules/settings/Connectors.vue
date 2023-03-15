<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">{{ viewTitle }}</span>
        </v-col>
        <v-spacer />
        <v-col cols="4" class="pr-10" style="text-align: right">
          <v-btn
            v-if="can('CREATE_CONNECTOR', 'settings')"
            color="primary"
            @click="
              $router.push({ name: 'ConnectorsCrud', params: { id: 'create' } })
            "
          >
            <v-icon dark> mdi-plus </v-icon>crear conector
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-5" no-gutters>
        <v-col cols="12" class="mb-5">
          <span class="subtitle-1">
            {{ viewSubtitle }}
          </span>
        </v-col>
        <v-col>
          <v-tabs color="primary">
            <v-tab v-for="item in tabsHeaders" :key="item">
              {{ item }}
            </v-tab>
            <v-tab-item>
              <v-container fluid>
                <v-row class="mt-5" dense>
                  <v-col class="mr-5" cols="3">
                    <v-text-field
                      v-model="searchConnector"
                      label="Ingresar nombre conector"
                      dense
                      outlined
                    />
                  </v-col>
                  <v-col class="ml-5" cols="2">
                    <v-btn
                      outlined
                      color="primary"
                      @click="getConnectors(clientId, searchConnector)"
                    >
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
                <div v-if="connectors">
                  <v-data-table
                    :headers="datableHeaders"
                    :items="connectors.data"
                    :items-per-page="5"
                    :footer-props="{
                      itemsPerPageText: 'Filas',
                    }"
                    class="rounded-sm striped-table"
                  >
                    <template v-slot:no-data>
                      <v-card-text>
                        <v-col>
                          <span class="text-h7 gray300--text">
                            No se han creado campañas de whatsapp.
                          </span>
                        </v-col>
                      </v-card-text>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                      <v-icon :color="item.status ? 'success' : 'error'">
                        {{ item.status ? 'mdi-check' : 'mdi-close' }}
                      </v-icon>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark icon v-bind="attrs" v-on="on">
                            <v-icon small color="primary" class="mr-2">
                              mdi-dots-vertical
                            </v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="(mitem, i) in items"
                            :key="i"
                            @click="menuAction(item, mitem.title)"
                          >
                            <v-list-item-title>
                              {{ mitem.title }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-data-table>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-col>
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="connectorToDelete.name"
      @btn-active-action="deleteConnector()"
    />
    <test-connector-dialog
      v-if="dialogActivator"
      v-model="dialogActivator"
      :is-connector-active="selectedConnector"
      :api-request-loading="isLoading"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import connectorsMixin from '@/mixins/services/connectorsMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import TestConnectorDialog from '@/components/modules/settings/connectors/TestConnectorDialog.vue'

export default {
  components: { DeleteDialog, TestConnectorDialog },
  mixins: [permissionsMixin, connectorsMixin],
  data() {
    return {
      viewTitle: 'Conectores',
      viewSubtitle: 'Aquí podrás tus conectores creados y crear nuevos.',
      connectors: null,
      dialogActivator: false,
      selectedConnector: false,
      isLoading: true,
      deleteDialog: false,
      searchConnector: null,
      connectorToDelete: {
        id: null,
        clientId: null,
        name: null,
        host: null,
        port: null,
        type: null,
        status: false,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      },
      tabsHeaders: ['TODOS'],
      datableHeaders: [
        { text: 'Nombre', value: 'name' },
        { text: 'Host', value: 'host' },
        { text: 'Puerto', value: 'port' },
        { text: 'Tipo', value: 'type' },
        { text: 'Estado', value: 'status' },
        { text: 'Fecha creación', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      items: [
        { title: 'Editar' },
        { title: 'Eliminar' },
        { title: 'Probar conector' },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    dialogActivator: {
      handler(value) {
        if (!value) {
          this.selectedConnector = false
          this.isLoading = true
        }
      },
    },
  },
  beforeMount() {
    this.getConnectors(this.clientId, '-1')
  },
  methods: {
    async getConnectors(clientId, connectorType) {
      this.connectors = await this.getAllTypesConnectorsByClientId(
        clientId,
        connectorType
      )
    },
    async testConnector(connectorId) {
      this.dialogActivator = true
      this.selectedConnector = await this.testConnectorByClientId(
        connectorId,
        this.clientId
      )
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    },
    menuAction(item, action) {
      if (action === 'Eliminar') {
        this.deleteDialog = true
        this.connectorToDelete = item
      } else if (action === 'Editar') {
        this.$router.push({
          name: 'ConnectorsCrud',
          params: { id: item.id },
        })
      } else if (action === 'Probar conector') this.testConnector(item.id)
    },
    async deleteConnector() {
      await this.deleteConnectorByConnectorId(
        this.clientId,
        this.connectorToDelete.id
      )
      this.deleteDialog = false
    },
  },
}
</script>
