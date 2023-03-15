<template>
  <v-container fluid>
    <v-form v-model="isFormValid">
      <v-row class="pt-8">
        <v-col
          v-for="smtpInput in smtpInputs"
          :key="smtpInput.id"
          :cols="inputsCols"
        >
          <v-text-field
            v-if="smtpInput.type === 'textfield'"
            v-model="connector[smtpInput.model]"
            :label="smtpInput.label"
            :placeholder="smtpInput.placeholder"
            :rules="_self[smtpInput.rules]"
            class="pr-5"
            outlined
          />
          <v-text-field
            v-if="smtpInput.type === 'password'"
            v-model="connector[smtpInput.model]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :label="smtpInput.label"
            :placeholder="smtpInput.placeholder"
            :rules="_self[smtpInput.rules]"
            :type="showPassword ? 'text' : 'password'"
            class="pr-5"
            outlined
            @click:append="showPassword = !showPassword"
          />
        </v-col>
      </v-row>
      <v-row class="flex-column" no-gutters>
        <v-switch
          v-model="connector.auth"
          color="primary"
          flat
          label="Autenticación"
        />
        <v-switch v-model="connector.ttls" color="primary" flat label="TTLS" />
        <v-switch
          v-model="retryPortSwitch"
          color="primary"
          flat
          label="Puerto de reintento"
        />
      </v-row>
      <v-row v-if="retryPortSwitch" class="align-center mt-5" no-gutters>
        <v-col cols="1">
          <v-text-field
            v-model="retryPortField"
            label="Puerto de reintento"
            type="number"
            outlined
            hide-details
            :disabled="retryPortList.length >= 3"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            class="ml-5"
            color="primary"
            outlined
            text
            :disabled="retryPortList.length >= 3"
            @click="addChip()"
          >
            GUARDAR
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="retryPortSwitch" no-gutters>
        <v-col cols="4">
          <div class="d-flex flex-wrap justify-start ml-n2 mr-1 mt-4">
            <v-chip
              v-for="port in retryPortList"
              :key="port"
              class="ma-2"
              close
              @click:close="removeChip(port)"
            >
              {{ port }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row dense class="align-center mt-10" no-gutters>
        Verifica que el conector funcione
        <v-btn
          v-if="!apiLoadingStatus && connectorTestButton && !apiResponseStatus"
          class="ml-10"
          outlined
          :disabled="!isFormValid"
          @click="testConnector()"
        >
          probar conector
        </v-btn>
        <v-icon
          v-if="apiLoadingStatus && !apiResponseStatus && !connectorTestButton"
          class="ml-5"
          x-large
          color="primary"
        >
          mdi-spin mdi-loading
        </v-icon>
        <v-sheet
          v-if="!apiLoadingStatus && apiResponseStatus && !connectorTestButton"
          outlined
          rounded
          class="ml-10"
          :color="connectorStatus ? 'success' : 'error'"
        >
          <v-row
            class="white pa-2 rounded accent--text text-button font-weight-bold"
            dense
            no-gutters
          >
            <v-icon class="pr-1" :color="connectorStatus ? 'success' : 'error'">
              {{ connectorStatus ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{
              connectorStatus ? 'conector habilitado' : 'conector deshabilitado'
            }}
          </v-row>
        </v-sheet>
      </v-row>
    </v-form>
    <v-row
      v-if="isConnectorSended && connector.id === null"
      class="mt-10"
      no-gutters
    >
      <v-sheet outlined rounded :color="isConnectorValid ? 'success' : 'error'">
        <v-card flat>
          <v-card-text
            class="d-flex justify-space-between accent--text text-subtitle-1"
          >
            <v-icon
              class="pr-10"
              :color="isConnectorValid ? 'success' : 'error'"
            >
              {{ isConnectorValid ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{
              isConnectorValid
                ? 'Se ha creado con éxito el conector'
                : 'No se ha creado el conector'
            }}
            <v-spacer />
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-row>
    <v-tabs v-model="tab" class="mt-15" color="primary">
      <v-tab v-for="tabHeader in tabs" :key="tabHeader">
        {{ tabHeader }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tabItem in tabs" :key="tabItem">
        <div>
          <v-data-table
            :headers="datableHeaders"
            :items="pathsList"
            item-key="path"
            :items-per-page="5"
            :footer-props="{
              itemsPerPageText: 'Filas',
            }"
            class="rounded-sm striped-table"
          >
            <template v-slot:top>
              <div class="d-flex justify-end">
                <v-btn rounded color="primary" @click="addPathDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data>
              <v-card-text>
                <v-col>
                  <span class="text-h7 gray300--text">
                    No existen rutas registradas para este conector. Si deseas
                    agregar una ruta pincha
                  </span>

                  <v-btn text color="primary" @click="addPathDialog = true">
                    aquí
                  </v-btn>
                </v-col>
              </v-card-text>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn dark icon @click="activeEditPath(item)">
                <v-icon medium color="primary" class="mr-2">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteDialogActivator = true"
                  >
                    <v-icon medium color="primary" class="mr-2">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>

                <v-dialog
                  v-model="deleteDialogActivator"
                  persistent
                  max-width="30%"
                >
                  <v-card>
                    <div class="d-flex justify-end mb-n8">
                      <v-btn
                        class="ml-15"
                        color="grey"
                        plain
                        @click="deleteDialogActivator = false"
                      >
                        <v-icon color="grey">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="pa-10">
                      <v-card-title
                        class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
                      >
                        <v-spacer />
                        <v-icon x-large color="warning" class="pb-5">
                          mdi-alert-circle
                        </v-icon>
                        <v-spacer />
                      </v-card-title>
                      <v-card-text align="center">
                        Va a eliminar el header
                        <span class="accent--text font-weight-bold">
                          {{ item.key }}
                        </span>
                      </v-card-text>
                    </div>
                    <v-card-actions class="justify-center pb-10">
                      <v-btn
                        large
                        outlined
                        color="primary"
                        @click="deleteDialogActivator = false"
                      >
                        CANCELAR
                      </v-btn>
                      <v-btn
                        large
                        color="primary"
                        depressed
                        class="ml-5"
                        @click="deletePath(item)"
                      >
                        ELIMINAR
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-row no-gutters>
      <v-btn large outlined color="primary" @click="returnToMainView()">
        CANCELAR
      </v-btn>
      <v-btn
        large
        color="primary"
        depressed
        class="ml-5"
        :disabled="!isFormValid || pathsList.length === 0"
        @click="saveConnector()"
      >
        CREAR CONECTOR
      </v-btn>
    </v-row>
    <v-dialog v-model="addPathDialog" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="addPathDialog = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Añadir Header</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Comprueba si el header está habilitado
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn large outlined color="primary" @click="addPathDialog = false">
            CERRAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="addPath()"
          >
            AÑADIR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialogActivator" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            @click="editDialogActivator = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Editar</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Modifica los valores que necesitas.
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.key"
                  label="Key"
                  placeholder="Key"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.value"
                  label="Valor"
                  placeholder="Valor"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPathAux.description"
                  label="Descripción"
                  placeholder="Ingrese una descripción"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="editDialogActivator = false"
          >
            CANCELAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            @click="editPath()"
          >
            GUARDAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import connectorsMixin from '@/mixins/services/connectorsMixin'

export default {
  name: 'SmtpConnector',
  components: {},
  mixins: [validationMixin, connectorsMixin],
  props: {
    connector: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      inputsCols: 4,
      tab: null,
      tabs: ['header'],
      addPathDialog: false,
      dialogActivator: false,
      editDialogActivator: false,
      deleteDialogActivator: false,
      retryPortSwitch: false,
      isFormValid: false,
      connectorStatus: false,
      connectorTestButton: true,
      apiLoadingStatus: false,
      apiResponseStatus: false,
      isConnectorValid: false,
      isConnectorSended: false,
      isPathDeleted: false,
      showPassword: false,
      retryPortList: [],
      retryPortField: '',
      selectedPath: {
        id: null,
        key: null,
        value: null,
        description: null,
      },
      selectedPathAux: {
        id: null,
        key: null,
        value: null,
        description: null,
      },
      datableHeaders: [
        { text: 'Key', value: 'key' },
        { text: 'Valor', value: 'value' },
        { text: 'Descripción', value: 'description' },
        { text: '', value: 'actions', sortable: false },
      ],
      selectedPathIndex: 0,
      pathsList: [],
      smtpInputs: [
        {
          id: 1,
          model: 'name',
          label: 'Nombre de conector',
          placeholder: 'Ingresar',
          rules: 'nameRules',
          type: 'textfield',
        },
        {
          id: 2,
          model: 'user',
          label: 'Usuario',
          placeholder: 'Ingresar',
          rules: 'userRules',
          type: 'textfield',
        },
        {
          id: 3,
          model: 'password',
          label: 'Contraseña',
          placeholder: 'Ingresar',
          rules: 'passwordRules',
          type: 'password',
        },
        {
          id: 4,
          model: 'server',
          label: 'Servidor',
          placeholder: 'Ingresar',
          rules: 'serverRules',
          type: 'textfield',
        },
        {
          id: 5,
          model: 'port',
          label: 'Puerto',
          placeholder: 'Ingresar',
          rules: 'portRules',
          type: 'textfield',
        },
      ],
    }
  },
  computed: {
    nameRules() {
      return [
        (v) => this.isRequired(v, 'Nombre de conector'),
        (v) => this.minLength(v, 4),
      ]
    },
    userRules() {
      return [(v) => this.isRequired(v, 'Usuario'), (v) => this.minLength(v, 4)]
    },
    passwordRules() {
      return [
        (v) => this.isRequired(v, 'Contraseña'),
        (v) => this.minLength(v, 1),
      ]
    },
    serverRules() {
      return [
        (v) => this.isRequired(v, 'Servidor'),
        (v) => this.minLength(v, 2),
      ]
    },
    portRules() {
      return [(v) => this.isRequired(v, 'Puerto'), (v) => this.minLength(v, 4)]
    },
  },
  created() {
    if (this.connector.id !== null && this.connector.id.length > 1) {
      this.isConnectorValid = true
      this.pathsList = JSON.parse(JSON.stringify(this.connector.paths))
    }
  },
  methods: {
    async testConnector() {
      this.connectorTestButton = false
      this.apiLoadingStatus = true
      if (this.connector.server && this.connector.port) {
        this.connectorStatus = await this.testSmtpConnector(this.connector)
        this.apiLoadingStatus = false
        this.apiResponseStatus = true
      }
    },
    getSelectedPathIndex(item) {
      this.selectedPathIndex = this.pathsList.indexOf(item)
    },
    async saveConnector() {
      const connectorToSend = JSON.parse(JSON.stringify(this.connector))
      connectorToSend.headers = this.pathsList
      connectorToSend.retryPort = this.retryPortList
      await this.saveSmtpConnector(connectorToSend)
      this.returnToMainView()
    },
    cleanSelectedPath() {
      this.selectedPath = {
        id: null,
        key: null,
        value: null,
        description: null,
      }
    },
    cleanSelectedPathAux() {
      this.selectedPath = {
        id: null,
        key: null,
        value: null,
        description: null,
      }
    },
    addPath() {
      this.pathsList.push(this.selectedPath)
      this.cleanSelectedPath()
      this.addPathDialog = false
    },
    activeEditPath(item) {
      this.selectedPathIndex = this.pathsList.indexOf(item)
      this.selectedPathAux = { ...item }
      this.editDialogActivator = true
    },
    editPath() {
      Object.assign(
        this.pathsList[this.selectedPathIndex],
        this.selectedPathAux
      )
      this.editDialogActivator = false
      this.cleanSelectedPathAux()
    },
    async deletePath(path) {
      this.deleteDialogActivator = false
      if (path.id === null) {
        this.removeElementFromArray(this.pathsList, path)
      } else {
        this.isPathDeleted = await this.deletePathById(path.id)
        if (this.isPathDeleted)
          this.removeElementFromArray(this.pathsList, path)
      }
    },
    removeElementFromArray(array, item) {
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    returnToMainView() {
      this.$router.push({ name: 'Connectors' })
    },
    removeChip(item) {
      this.retryPortList.splice(this.retryPortList.indexOf(item), 1)
    },
    addChip() {
      if (this.retryPortList.length < 3) {
        this.retryPortList.push(this.retryPortField)
        this.retryPortField = ''
      }
    },
  },
}
</script>
