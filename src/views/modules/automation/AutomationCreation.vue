<!-- eslint-disable prefer-destructuring -->
<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      fullscreen
      hide-overlay
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="container">
        <v-toolbar>
          <div>
            <v-btn text color="primary" @click="exitModelDatabase()">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              volver a procesos
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            <div v-if="!activateEditAutomationName">
              {{ selectedAutomation.name }}
              <v-btn
                icon
                color="primary"
                @click="
                  activateEditAutomationName = !activateEditAutomationName
                "
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div v-else class="pt-6" style="width: 300px">
              <v-text-field
                v-model="selectedAutomation.name"
                outlined
                dense
                @blur="activateEditAutomationName = !activateEditAutomationName"
                @change="renameAutomation()"
              />
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <div class="d-flex align-center">
              <v-chip
                class="ma-2 mr-10"
                :color="selectedAutomation.activated ? 'success' : 'gray300'"
                outlined
              >
                {{ selectedAutomation.activated ? 'En ejecución' : 'Detenido' }}
                <v-icon small right>mdi-circle</v-icon>
              </v-chip>
              <div class="d-flex flex-column">
                <v-btn
                  color="primary"
                  outlined
                  class="white--text"
                  :class="{ 'change-btn': changesMade }"
                  @click="saveAutomations()"
                >
                  <v-icon class="mr-2">mdi-content-save</v-icon>
                  guardar
                </v-btn>
                <v-progress-linear
                  v-if="progressSave"
                  indeterminate
                  color="primary darken-2"
                  class="pr-6"
                />
              </div>
              <v-btn
                color="primary"
                class="ml-6 white--text"
                @click="activateExecute()"
              >
                <v-icon class="mr-2">
                  {{ selectedAutomation.activated ? 'mdi-stop' : 'mdi-play' }}
                </v-icon>
                {{ selectedAutomation.activated ? 'detener' : 'ejecutar' }}
              </v-btn>
            </div>
          </div>
        </v-toolbar>
        <div class="all-screen">
          <v-container fluid class="px-0 py-0">
            <v-navigation-drawer
              v-model="leftDrawer"
              absolute
              class="left-column"
            >
              <v-list dense>
                <v-list-item class="px-0">
                  <v-icon
                    color="grey"
                    small
                    class="pt-1 pr-1 close-bottom"
                    @click="closeLeftColumn()"
                  >
                    mdi-close
                  </v-icon>
                  <div class="d-flex">
                    <v-btn
                      color="primary"
                      text
                      @click="activeNewAutomation = !activeNewAutomation"
                    >
                      <v-icon color="primary" class="mr-2">
                        mdi-plus-circle-outline
                      </v-icon>
                      crear automatización
                    </v-btn>
                  </div>
                </v-list-item>
                <v-list dense>
                  <v-sheet
                    v-if="activeNewAutomation"
                    outlined
                    color="primary"
                    rounded
                    class="mx-2"
                  >
                    <v-card>
                      <v-card-text>
                        <v-text-field
                          v-model="newNameAutomation"
                          label="Nombre de automatización"
                          placeholder="Coloque"
                          outlined
                          dense
                          class="caption"
                          hide-details
                        />
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          small
                          text
                          color="primary"
                          @click="activeNewAutomation = !activeNewAutomation"
                          >cancelar</v-btn
                        >
                        <v-btn
                          small
                          outlined
                          color="primary"
                          :disabled="newNameAutomation.length <= 5"
                          @click="createAutomation()"
                          >Crear</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-sheet>
                </v-list>
                <v-divider></v-divider>
                <v-list-item class="px-0">
                  <div class="d-flex flex-column">
                    <div>
                      <v-icon class="mr-2"> mdi-menu-down </v-icon>
                      Proceso:
                    </div>
                    <div class="pr-4 pl-9">
                      <span class="caption white-space">
                        {{ processItem.processName }}
                      </span>
                    </div>
                  </div>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item
                  v-for="child in processItem.automationList"
                  :key="child.id"
                  class="px-0"
                >
                  <v-btn
                    text
                    block
                    max-width="256"
                    color="gray300"
                    class="caption justify-start"
                    :class="child.selected ? 'active' : ''"
                    @click="changeSelection(child)"
                  >
                    <v-icon small class="mr-2">mdi-arrow-right-bottom</v-icon>
                    <span class="white-space">{{ child.name }}</span>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
            <v-navigation-drawer
              v-model="rightDrawer"
              absolute
              right
              width="395"
              class="right-column"
            >
              <v-icon
                color="grey"
                class="mt-2 close-bottom"
                style="right: 11px"
                @click="rightDrawer = !rightDrawer"
              >
                mdi-close
              </v-icon>
              <div
                v-if="selectedActivity"
                class="d-flex justify-space-between align-center px-4 pt-2"
              >
                <div>
                  <v-icon color="primary" class="mr-2">
                    {{ iconActivity(selectedActivity.name) }}
                  </v-icon>
                  {{ titleActivity(selectedActivity.name) }}
                </div>
                <div>
                  <v-switch
                    v-model="selectedActivity.active"
                    color="success"
                    inset
                    :label="
                      selectedActivity.active ? 'Activado' : 'Desactivado'
                    "
                    @change="changesMade = true"
                  />
                </div>
              </div>
              <v-sheet>
                <trigger-configuration
                  v-if="selectedActivity && activateTriggerConfig"
                  v-model="activateTriggerConfig"
                  :selected-activity="selectedActivity"
                  @change-element="changesMade = true"
                />
                <search-files-configuration
                  v-if="selectedActivity && activateSearchFilesConfig"
                  v-model="activateSearchFilesConfig"
                  :selected-activity="selectedActivity"
                  :client-id="clientId"
                  @change-element="changesMade = true"
                />
                <upload-files-configuration
                  v-if="selectedActivity && activateUploadFilesConfig"
                  v-model="activateUploadFilesConfig"
                  :selected-activity="selectedActivity"
                  :client-id="clientId"
                  @change-element="changesMade = true"
                  @delete-file-structure="deleteFileStructure"
                  @new-file-structure="newFileStructure()"
                  @delete-all-file-structure="deleteAllFileStructure()"
                />
                <generate-pdf-configuration
                  v-if="selectedActivity && activateGeneratePdfConfig"
                  v-model="activateGeneratePdfConfig"
                  :selected-activity="selectedActivity"
                  :client-id="clientId"
                  :process-id="processId"
                  :atomation-id="selectedAutomation.id"
                  :directory="processItem.directory"
                  @change-element="changesMade = true"
                  @save-automations="saveAutomations()"
                />
                <send-email-configuration
                  v-if="selectedActivity && activateSendEmailConfig"
                  :selected-activity="selectedActivity"
                  :client-id="clientId"
                  :process-id="processId"
                  :atomation-id="selectedAutomation.id"
                  @change-element="changesMade = true"
                />
              </v-sheet>
            </v-navigation-drawer>
          </v-container>
          <div
            v-if="centerColumn"
            id="center-column"
            class="p-10 center-column"
            :class="{ 'margin-left': leftDrawer }"
          >
            <div class="d-flex flex-column justify-center">
              <v-icon
                v-if="icoMenu"
                large
                color="primary"
                class="menu-buttom"
                @click="btnMenu()"
              >
                mdi-menu
              </v-icon>
              <div v-if="activeCardSummary" class="card-position">
                <v-sheet outlined color="primary" rounded>
                  <v-card elevation="5" width="260" outlined color="lightcyan">
                    <v-card-title
                      class="subtitle-1 gray300--text border-bottom-color"
                    >
                      <v-icon
                        size="20"
                        color="grey"
                        class="btn-close-card"
                        @click="activeCardSummary = !activeCardSummary"
                      >
                        mdi-close
                      </v-icon>
                      <div class="accent--text">
                        <v-icon color="primary"> mdi-file-document </v-icon>
                        Resumen
                      </div>
                    </v-card-title>
                    <v-divider class="mb-4 primary"></v-divider>
                    <v-card-text class="mt-4 ml-4 py-0">
                      Fecha última ejecución:
                    </v-card-text>
                    <v-card-title class="ml-4 py-0 accent--text">
                      {{ selectedAutomation.lastRun }}
                    </v-card-title>
                    <v-card-text class="mt-4 ml-4 py-0">
                      Fecha siguiente ejecución:
                    </v-card-text>
                    <v-card-title class="ml-4 pt-0 pb-4 accent--text">
                      {{ selectedAutomation.nextRun }}
                    </v-card-title>
                  </v-card>
                </v-sheet>
              </div>
              <div class="position-line">
                <div class="mt-6 pb-6 line">
                  <v-card class="mx-auto py-4" max-width="250" outlined>
                    <v-list-item-title class="text-center">
                      Crear entrada
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-center">
                      Agrega un elemento al flujo
                    </v-list-item-subtitle>
                  </v-card>
                </div>
                <div
                  v-for="childActivity in selectedAutomation.activityList"
                  :key="childActivity.id"
                  class="my-6"
                >
                  <v-sheet
                    outlined
                    color="bluelagoon"
                    class="mx-auto mt-6 hover-sheet"
                    :class="childActivity.selected ? 'selected-card' : ''"
                    rounded
                    max-width="350"
                    style="position: relative"
                  >
                    <div class="hover-card">
                      <v-icon
                        small
                        color="white"
                        class="hover-icon"
                        @click="moveUp(childActivity)"
                      >
                        mdi-arrow-up-thick
                      </v-icon>
                      <v-icon
                        small
                        color="white"
                        class="hover-icon"
                        @click="moveDown(childActivity)"
                      >
                        mdi-arrow-down-thick
                      </v-icon>
                    </div>
                    <v-card
                      class="mx-auto"
                      max-width="350"
                      @click="selectActivity(childActivity)"
                    >
                      <v-app-bar color="bluelagoon" height="40" class="py-0">
                        <v-toolbar-title class="white--text py-0 subtitle-2">
                          <v-icon small color="white">
                            {{ iconActivity(childActivity.name) }}
                          </v-icon>
                          {{ titleActivity(childActivity.name) }}
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-menu offset-x>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn color="white" icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item
                              v-for="(menuItem, index) in menuItems"
                              :key="index"
                              @click="
                                menuActions(childActivity, menuItem.title)
                              "
                            >
                              <v-list-item-icon>
                                <v-icon>{{ menuItem.icon }}</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>{{
                                menuItem.title
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-app-bar>
                      <v-list-item-subtitle
                        class="text-center accent--text py-4"
                      >
                        {{ descriptionActivity(childActivity) }}
                      </v-list-item-subtitle>
                    </v-card>
                  </v-sheet>
                </div>
              </div>
              <v-card
                v-if="!activeActivityMenu"
                class="mx-auto py-1 text-center"
                width="40"
                color="warning"
                @click="activeActivityMenu = !activeActivityMenu"
              >
                <v-icon color="white">mdi-plus-circle</v-icon>
              </v-card>
              <activity-menu
                v-if="activeActivityMenu"
                @close-menu="activeActivityMenu = false"
                @selection-activity="addActivityBySelectionType"
              />
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <delete-dialog
      v-model="activeDeleteDialog"
      :connector-to-delete="connectorToDelete"
      @change-model="activeDeleteDialog = false"
      @btn-active-action="deleteActivity()"
    />
    <base-dialog
      v-model="changesMadeDialog"
      text-alert="Tienes cambios sin guardar, ¿Estás seguro de salir? "
      primary-btn-text="Sí, Salir"
      @primary-btn-action="$router.push({ name: 'ProcessesAutomation' })"
    />
    <base-dialog
      v-model="changesMadeDialogAuto"
      text-alert="¿Deseas guardar tus cambios?"
      text-alert2="Si cambias de automatización sin guardar, se perderán
tus cambios realizados."
      primary-btn-text="guardar cambios"
      secondary-btn-text="cancelar"
      @primary-btn-action="changeAutomation()"
    />
    <base-dialog
      v-model="missingSearchFileDialog"
      text-alert="Debe seleccionar primero buscar archivos"
      primary-btn-text="Aceptar"
      :is-cancel="false"
      @primary-btn-action="missingSearchFileDialog = !missingSearchFileDialog"
    />
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import automationBffMixin from '@/mixins/services/automationBffMixin'
import { mapGetters } from 'vuex'
import ActivityMenu from '@/components/modules/automation/ActivityMenu.vue'
import TriggerConfiguration from '@/components/modules/automation/TriggerConfiguration.vue'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import BaseDialog from '@/components/util/BaseDialog.vue'
import SearchFilesConfiguration from '@/components/modules/automation/SearchFilesConfiguration.vue'
import UploadFilesConfiguration from '@/components/modules/automation/UploadFilesConfiguration.vue'
import GeneratePdfConfiguration from '@/components/modules/automation/GeneratePdfConfiguration.vue'
import SendEmailConfiguration from '@/components/modules/automation/SendEmailConfiguration.vue'

export default {
  name: 'AutomationCreation',
  components: {
    ActivityMenu,
    TriggerConfiguration,
    DeleteDialog,
    BaseDialog,
    SearchFilesConfiguration,
    UploadFilesConfiguration,
    GeneratePdfConfiguration,
    SendEmailConfiguration,
  },
  mixins: [validationMixin, automationBffMixin],
  data() {
    return {
      activateEditAutomationName: false,
      newNameAutomation: '',
      activeNewAutomation: false,
      changesMade: false,
      changesMadeDialog: false,
      changesMadeDialogAuto: false,
      itemAutomationTMP: null,
      missingSearchFileDialog: false,
      progressSave: false,
      showNewTemplate: false,
      show: true,
      valid: false,
      tab: 0,
      processId: '',
      automationId: '',
      processItem: {},
      selectedAutomation: {},
      selectedActivity: null,
      centerColumn: true,
      leftDrawer: true,
      rightDrawer: false,
      icoMenu: false,
      activeCardSummary: true,
      activeActivityMenu: false,
      activateTriggerConfig: false,
      activateSearchFilesConfig: false,
      activateUploadFilesConfig: false,
      activateGeneratePdfConfig: false,
      activateSendEmailConfig: false,
      activeDeleteDialog: false,
      connectorToDelete: '',
      activityElement: [
        {
          text: 'Generar PDF',
          icon: 'mdi-file-pdf-box',
          value: 'generatePDF',
          description: 'Generar PDF',
        },
        {
          text: 'Buscar archivos',
          icon: 'mdi-folder',
          value: 'searchFiles',
          description: 'Buscar archivos',
        },
        {
          text: 'Cargar archivo',
          icon: 'mdi-cloud-upload',
          value: 'fileUpload',
          description: 'Cargar archivos',
        },
        {
          text: 'Entregar archivo',
          icon: 'mdi-archive-arrow-up',
          value: 'deliverFile',
          description: 'Entregar archivo',
        },
        {
          text: 'Mover archivos',
          icon: 'mdi-database-refresh',
          value: 'moveFiles',
          description: 'Mover archivos',
        },
        {
          text: 'Disparador',
          icon: 'mdi-lightning-bolt-circle',
          value: 'trigger',
          description: 'Disparador',
        },
        {
          text: 'En espera',
          icon: 'mdi-timer-outline',
          value: 'onHold',
          description: 'En espera',
        },
        {
          text: 'Conexión',
          icon: 'mdi-file',
          value: 'connection',
          description: 'Conexión',
        },
        {
          text: 'Inicio',
          icon: 'mdi-play',
          value: 'beginning',
          description: 'Inicio',
        },
        {
          text: 'Condición',
          icon: 'mdi-code-tags',
          value: 'condition',
          description: 'Condición',
        },
        {
          text: 'Notificación',
          icon: 'mdi-bell',
          value: 'notification',
          description: 'Notificación',
        },
        {
          text: 'Enviar email',
          icon: 'mdi-email',
          value: 'sendEmail',
          description: 'Enviar email',
        },
        {
          text: 'Enviar SMS',
          icon: 'mdi-message-text',
          value: 'sendSMS',
          description: 'Enviar SMS',
        },
      ],
      menuItems: [
        { title: 'Editar', icon: 'mdi-pencil' },
        { title: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
  },
  created() {
    this.loading = true
    this.processId = this.$route.params.id
    this.getList()
    this.loading = false
  },
  methods: {
    async getList() {
      const array =
        await this.getProcessAndAutomationListByClientIdAndProcessId(
          this.clientId,
          this.processId
        )
      if (array.automationList.length !== 0) {
        array.automationList.forEach((item) => {
          item.selected = false
          if (item.activityList !== undefined) {
            if (item.activityList.length !== 0) {
              item.activityList.forEach((itemA) => {
                itemA.selected = false
              })
            }
          }
        })
      }
      this.processItem = array
      const item = array.automationList[0]
      item.selected = 'true'
      this.automationId = array.id
      this.selectedAutomation =
        await this.getAutomationListByClientIdProcessIdAndAutomationId(
          this.clientId,
          this.processId,
          item.id
        )
    },
    async activateExecute() {
      this.selectedAutomation.activated = !this.selectedAutomation.activated
      // TODO: falta programacion de ejecutar proceso de automatización
      await console.log('cambiar estado', this.processItem)
    },
    async createAutomation() {
      this.activeNewAutomation = false
      const newAutomation = {
        clientId: this.clientId,
        processId: this.processId,
        name: this.newNameAutomation,
      }
      const response =
        this.createNewAutomationByClientIdAndProcessId(newAutomation)
      if (response !== '') {
        const newItem = {
          id: response,
          activated: false,
          name: this.newNameAutomation,
          lastRun: '',
          nextRun: '',
        }
        this.processItem.automationList.push(newItem)
      }
    },
    async saveAutomations() {
      this.progressSave = true
      const recordModify = {
        clientId: this.clientId,
        processId: this.processId,
        automationId: this.automationId,
        automationItem: this.selectedAutomation,
      }
      await this.modifyProcessByClientIdAndProcessId(recordModify)
      this.changesMade = false
      this.progressSave = false
      const directoryModify = {
        clientId: this.clientId,
        processId: this.processId,
        directory: this.processItem.directory,
      }
      await this.modifyProcessDirectoryByClientIdAndProcessId(directoryModify)
    },
    async renameAutomation() {
      const recordModify = {
        clientId: this.clientId,
        processId: this.processId,
        automationId: this.automationId,
        nameModify: this.selectedAutomation.name,
      }
      const response =
        await this.renameProcessAutomationByClientIdProcessIdAndAutomationId(
          recordModify
        )
      if (response) {
        const itemSelect = this.processItem.automationList.find(
          (f) => f.id === this.automationId
        )
        itemSelect.name = this.selectedAutomation.name
      }
    },
    async changeAutomation() {
      this.deselect()
      await this.saveAutomations()
      this.selectedAutomation =
        await this.getAutomationListByClientIdProcessIdAndAutomationId(
          this.clientId,
          this.processId,
          this.itemAutomationTMP.id
        )
      this.selectedAutomation.selected = 'true'
      this.getSelection(this.itemAutomationTMP.id)
      this.changesMadeDialogAuto = false
      this.changesMade = false
    },
    async changeSelection(itemAutomation) {
      if (this.changesMade) {
        this.itemAutomationTMP = itemAutomation
        this.changesMadeDialogAuto = true
      } else {
        this.deselect()
        itemAutomation.selected = 'true'
        this.selectedAutomation =
          await this.getAutomationListByClientIdProcessIdAndAutomationId(
            this.clientId,
            this.processId,
            itemAutomation.id
          )
        this.getSelection(itemAutomation.id)
        this.activeCardSummary = true
      }
    },
    getSelection(item) {
      const itemSelect = this.processItem.automationList.find(
        (f) => f.id === item
      )
      this.automationId = itemSelect.id
      itemSelect.selected = true
    },
    deselect() {
      this.rightDrawer = false
      this.processItem.automationList.forEach((item) => {
        item.selected = false
        if (item.activityList !== undefined) {
          if (item.activityList.length !== 0) {
            item.activityList.forEach((itemA) => {
              itemA.selected = false
            })
          }
        }
      })
    },
    deselectActivity() {
      this.processItem.automationList.forEach((item) => {
        if (item.activityList !== undefined) {
          if (item.activityList.length !== 0) {
            item.activityList.forEach((itemA) => {
              itemA.selected = false
            })
          }
        }
      })
    },
    closeLeftColumn() {
      this.leftDrawer = false
      this.icoMenu = true
    },
    btnMenu() {
      this.leftDrawer = true
      this.icoMenu = false
    },
    placeChangesMade() {
      this.changesMade = true
    },
    menuActions(item, action) {
      if (action === 'Editar') {
        this.selectActivity(item)
      }
      if (action === 'Eliminar') {
        this.connectorToDelete = ` el elemento ${item.name}`
        this.selectedActivity = item
        this.activeDeleteDialog = true
      }
    },
    deleteActivity() {
      const index = this.selectedAutomation.activityList.findIndex(
        (t) => t.id === this.selectedActivity.id
      )
      this.selectedAutomation.activityList.splice(index, 1)
      if (this.selectedAutomation.activityList.length !== 0) {
        this.selectedAutomation.activityList.forEach((item, index2) => {
          item.order = index2
        })
      }
      this.changesMade = true
      this.activeDeleteDialog = false
      this.rightDrawer = false
    },
    async addActivityBySelectionType(type) {
      this.activeActivityMenu = false
      this.rightDrawer = false
      let newItem = null
      let config = null
      if (type === 'trigger') {
        config = {
          expression: '',
          type: 'Minutos',
          countMinutes: '',
          hourlyOrStartTo: '',
          countHours: '',
          hours: '',
          minutes: '',
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          allDaysOrMondayFriday: '',
        }
      } else if (type === 'searchFiles') {
        config = {
          directoryType: 'FTP',
          connectorId: '',
          routesValue: '',
          prefix: '',
          fileTypeCSV: false,
          fileTypeTXT: false,
          fileTypeXLS: false,
          fileTypeXLSX: false,
          fileTypeOTHER: false,
          extensionOTHER: '',
        }
      } else if (type === 'fileUpload') {
        if (!this.checkIf('searchFiles')) {
          this.missingSearchFileDialog = true
        } else {
          config = {
            prefix: this.getValue('searchFiles', 'prefix'),
            fileTypeCSV: this.getValue('searchFiles', 'fileTypeCSV'),
            fileTypeTXT: this.getValue('searchFiles', 'fileTypeTXT'),
            fileTypeXLS: this.getValue('searchFiles', 'fileTypeXLS'),
            fileTypeXLSX: this.getValue('searchFiles', 'fileTypeXLSX'),
            fileTypeOTHER: this.getValue('searchFiles', 'fileTypeOTHER'),
            extensionOTHER: this.getValue('searchFiles', 'extensionOTHER'),
            coding: '',
            readingMode: '',
            separators: '',
            listFileStructure: [
              {
                id: '1',
                name: 'Nombre',
                setting: 'text',
              },
            ],
          }
        }
      } else if (type === 'generatePDF') {
        config = {
          type: '',
          pdfName: '@nombre@',
          generatePassword: false,
          password: {
            generate: false,
            type: '',
            databaseColumnName: '',
            Format: '',
            structure: '',
            operation: '',
            from: '',
            to: '',
          },
          listParameters: {
            name: 'HTML',
            charged: false,
            list: [],
          },
          compressZip: false,
          maxBatch: '1000',
          template: {
            generateTemplate: false,
            localContent: '',
            imageContent: '',
            imageExtension: '',
            name: '',
            description: '',
            id: '-1',
          },
          jasper: {},
          dataBase: [],
          dataConfiguration: {
            filter: 'all',
            listColumns: [],
          },
        }
      } else if (type === 'sendEmail') {
        config = {
          filter: 'all',
          connection: {
            type: '',
            connectionId: '',
          },
          sender: '',
          addressee: '',
          answerTo: '',
          attach: {
            attachDynamic: false,
            staticList: [],
          },
          dataBase: [],
          template: {
            generateTemplate: false,
            localContent: '',
            imageContent: '',
            imageExtension: '',
            stageContainer: {},
            templateId: '-1',
          },
        }
      }
      if (config !== null) {
        newItem = {
          id: '-1',
          order: this.selectedAutomation.activityList.length,
          active: false,
          name: type,
          config,
        }
        const registerItem = {
          clientId: this.clientId,
          processId: this.processId,
          newItem,
        }
        const returId = await this.createNewAutomationItem(registerItem)
        newItem.id = returId
        this.selectedAutomation.activityList.push(newItem)
        this.changesMade = true
      }
    },
    getValue(itemActivity, variable) {
      let result = null
      this.selectedAutomation.activityList.forEach((item) => {
        if (item.name === itemActivity) {
          Object.entries(item.config).forEach((entry) => {
            const [key, value] = entry
            if (key === variable) {
              result = value
            }
          })
        }
      })
      return result
    },
    checkIf(itemActivity) {
      let action = false
      this.selectedAutomation.activityList.forEach((item) => {
        if (item.name === itemActivity) {
          action = true
        }
      })
      return action
    },
    titleActivity(value) {
      if (typeof value !== 'undefined') {
        const activityElementTMP = this.activityElement
        return activityElementTMP.find((item) => item.value === value).text
      }
      return ''
    },
    iconActivity(value) {
      if (typeof value !== 'undefined') {
        const activityElementTMP = this.activityElement
        return activityElementTMP.find((item) => item.value === value).icon
      }
      return ''
    },
    descriptionActivity(value) {
      if (typeof value !== 'undefined') {
        const activityElementTMP = this.activityElement
        let texto = ''
        if (value.name === 'trigger') {
          texto = ` por ${value.config.type}`
        }
        return (
          activityElementTMP.find((item) => item.value === value.name)
            .description + texto
        )
      }
      return ''
    },
    initializeActivity() {
      this.activateTriggerConfig = false
      this.activateSearchFilesConfig = false
      this.activateUploadFilesConfig = false
      this.activateGeneratePdfConfig = false
      this.activateSendEmailConfig = false
    },
    selectActivity(selectedItem) {
      this.initializeActivity()
      this.deselectActivity()
      selectedItem.selected = 'true'
      this.rightDrawer = true
      this.selectedActivity = selectedItem
      if (selectedItem.name === 'trigger') {
        this.activateTriggerConfig = true
      } else if (selectedItem.name === 'searchFiles') {
        this.activateSearchFilesConfig = true
      } else if (selectedItem.name === 'fileUpload') {
        this.activateUploadFilesConfig = true
      } else if (selectedItem.name === 'generatePDF') {
        this.activateGeneratePdfConfig = true
      } else if (selectedItem.name === 'sendEmail') {
        this.activateSendEmailConfig = true
      }
    },
    moveList(selectedItem) {
      let arrayTMP = []
      if (selectedItem.order === this.selectedAutomation.activityList.length) {
        arrayTMP = this.selectedAutomation.activityList
        arrayTMP.push(selectedItem)
      } else {
        this.selectedAutomation.activityList.forEach((item, index) => {
          if (index === selectedItem.order) {
            arrayTMP.push(selectedItem)
          }
          arrayTMP.push(item)
        })
        arrayTMP.forEach((item, index) => {
          item.order = index
        })
      }
      this.selectedAutomation.activityList = arrayTMP
      this.changesMade = true
    },
    moveDown(selectedItem) {
      const newPosition = selectedItem.order + 1
      if (newPosition <= this.selectedAutomation.activityList.length - 1) {
        const index = this.selectedAutomation.activityList.indexOf(selectedItem)
        this.selectedAutomation.activityList.splice(index, 1)
        selectedItem.order = newPosition
        this.moveList(selectedItem)
      }
    },
    moveUp(selectedItem) {
      const newPosition = selectedItem.order - 1
      if (newPosition >= 0) {
        const index = this.selectedAutomation.activityList.indexOf(selectedItem)
        this.selectedAutomation.activityList.splice(index, 1)
        selectedItem.order = newPosition
        this.moveList(selectedItem)
      }
    },
    exitModelDatabase() {
      if (this.changesMade) {
        this.changesMadeDialog = true
      } else {
        this.$router.push({ name: 'ProcessesAutomation' })
      }
    },
    deleteFileStructure(item) {
      this.changesMade = true
      const index = this.selectedActivity.config.listFileStructure.indexOf(item)
      if (index > -1) {
        this.selectedActivity.config.listFileStructure.splice(index, 1)
      }
    },
    newFileStructure() {
      this.changesMade = true
      const index = this.selectedActivity.config.listFileStructure.length + 1
      const newItem = {
        id: index,
        name: 'Nombre',
        setting: 'text',
      }
      this.selectedActivity.config.listFileStructure.push(newItem)
    },
    deleteAllFileStructure() {
      this.changesMade = true
      this.selectedActivity.config.listFileStructure = []
    },
    dowloadJsonFileStructure() {
      console.log(
        'array: ',
        JSON.stringify(this.selectedActivity.config.listFileStructure)
      )
    },
  },
}
</script>
<style scoped>
.container {
  max-width: 100%;
  overflow: hidden;
}
.all-screen {
  width: 100%;
  background-color: var(--v-gray-base);
  height: calc(100vh - 64px) !important;
  overflow: hidden;
}
.left-column,
.right-column {
  max-height: calc(100vh - 65px) !important;
  height: calc(100vh - 65px) !important;
  top: 65px !important;
  box-shadow: -11px 1px 19px -11px rgba(30, 30, 60, 0.25);
}
.center-column {
  position: relative;
  padding: 10px;
  width: 100%;
  max-height: calc(100vh - 65px) !important;
  height: calc(100vh - 65px) !important;
  overflow-y: auto;
}
.margin-left {
  margin-left: 215px;
  width: calc(100vw - 227px) !important;
}
.white-space {
  max-width: 206px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.active {
  background-color: var(--v-gray100-base);
  border-right: 2px solid var(--v-primary-base);
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.active-card {
  border: 2px solid var(--v-lightcyan-base);
}
.close-bottom {
  position: absolute;
  top: -9px;
  right: 0;
}
.btn-close-card {
  position: absolute;
  top: 5px;
  right: 5px;
}
.menu-buttom {
  z-index: 10;
  position: absolute;
  top: 10px;
  left: 5px;
}
.card-position {
  z-index: 11;
  position: absolute;
  top: 10px;
  left: 50px;
}
.card-overflow {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}
.position-line {
  position: relative;
  margin-top: -22px;
}
.line:before {
  left: calc(50% - 1px);
  right: auto;
  background: var(--v-gray300-base);
  bottom: 0;
  content: '';
  height: cal(100% - 24px);
  position: absolute;
  top: 24px;
  width: 2px;
  text-decoration: inherit;
  vertical-align: inherit;
}
.selected-card {
  border: 3px solid var(--v-primary-base);
  box-shadow: 0px 0px 10px 4px rgba(30, 30, 60, 0.4);
}
.change-btn {
  animation: changeAnimation 3s ease 0s infinite normal none;
}
.hover-card {
  display: none;
  position: absolute;
  right: -30px;
  top: 4px;
  background-color: var(--v-primary-base);
  color: white;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-top-right-radius: 25%;
  border-bottom-right-radius: 25%;
  width: 30px;
  height: 30px;
}
.hover-card .hover-icon {
  cursor: pointer;
}
.hover-card .hover-icon:hover {
  opacity: 0.5;
}
.hover-sheet:hover .hover-card {
  display: flex;
}
@keyframes changeAnimation {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}
</style>
