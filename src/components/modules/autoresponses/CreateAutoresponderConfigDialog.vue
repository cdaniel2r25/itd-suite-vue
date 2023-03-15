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
              volver
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-chip
            outlined
            :color="selectedItem.status === 'active' ? 'success' : 'darkgray'"
          >
            <v-icon
              small
              left
              :color="selectedItem.status === 'active' ? 'success' : 'darkgray'"
            >
              mdi-checkbox-blank-circle
            </v-icon>
            {{ selectedItem.status === 'active' ? 'Activo' : 'Inactivo' }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-toolbar-title v-if="!editName">
            {{ selectedItem.name }}
            <v-btn icon color="primary" @click="activeChangeName()">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-text-field
            v-if="editName"
            v-model="rename"
            clearable
            dense
            clear-icon="mdi-close-circle"
            append-icon="mdi-checkbox-marked-circle"
            class="mt-2"
            @click:clear="editName = !editName"
            @click:append="changeName()"
          >
            <template v-slot:prepend></template>
          </v-text-field>
          <v-spacer></v-spacer>
          <v-btn outlined color="gray300" @click="exitModelDatabase()">
            cerrar
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            class="ml-2"
            :class="{ 'change-btn': changesMade }"
            @click="saveAutoresponder()"
          >
            <v-icon left>mdi-content-save</v-icon>
            guardar
          </v-btn>
          <!-- TODO: Solo el Administrador tendra activado el boton 'ACTIVAR' -->
          <v-btn
            outlined
            class="ml-2"
            color="primary"
            @click="activeAutoresponder(selectedItem.status)"
          >
            <v-icon left color="primary">
              {{ selectedItem.status === 'inactive' ? 'mdi-play' : 'mdi-stop' }}
              mdi-play
            </v-icon>
            {{ selectedItem.status === 'inactive' ? 'activar' : 'DESACTIVAR' }}
          </v-btn>
        </v-toolbar>
        <div class="all-screen">
          <v-container fluid class="px-0 py-0">
            <v-navigation-drawer
              v-model="rightDrawer"
              absolute
              right
              width="350"
              class="right-column"
            >
              <v-icon
                color="grey"
                class="mt-2 close-bottom"
                style="right: 11px"
                @click="closeSetting()"
              >
                mdi-close
              </v-icon>
              <div class="px-4 pt-2">
                <set-trigger-setup
                  v-if="activateTriggerSetting"
                  :autoresponder-item="autoresponderItem"
                  @change-element="changesMade = true"
                />
                <autoresponder-setting
                  v-if="activeAutoresponderSetting"
                  :autoresponder-item="autoresponderItem"
                  @change-element="changesMade = true"
                />
                <autoresponder-menu-setting
                  v-if="activeMenuAutoresponderSetting"
                  :autoresponder-item="autoresponderItem"
                  @change-element="changesMade = true"
                />
                <exception-handling-setting
                  v-if="activeExceptionSetting"
                  :autoresponder-item="autoresponderItem"
                  @change-element="changesMade = true"
                />
              </div>
            </v-navigation-drawer>
            <div class="center-column" :class="{ 'right-margin': rightDrawer }">
              <div class="zoom-style">
                <v-btn
                  outlined
                  color="primary"
                  class="px-1"
                  style="min-width: inherit"
                  @click="applyZoom('menos')"
                >
                  <v-icon>mdi-minus-thick</v-icon>
                </v-btn>
                <v-btn
                  outlined
                  color="primary"
                  class="px-1 ml-2"
                  style="min-width: inherit"
                  @click="applyZoom('mas')"
                >
                  <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
              </div>
              <div id="centercolumn">
                <div class="position-line">
                  <div class="mt-6 pb-6 line">
                    <div
                      class="d-flex flex-column align-center mt-10"
                      style="position: relative"
                    >
                      <v-card v-if="autoresponderItem" flat width="260">
                        <div class="d-flex justify-space-between">
                          <div
                            style="position: relative; width: 100%"
                            class="mt-1 d-flex flex-column align-center gray300--text"
                          >
                            <v-icon color="primary" class="icon-left">
                              mdi-lightning-bolt-circle
                            </v-icon>
                            Entrada
                            <div
                              v-if="
                                autoresponderItem.triggerSetting.triggerId ===
                                -1
                              "
                            >
                              <p class="font-weight-bold">
                                Configura Disparador
                              </p>
                            </div>
                            <div v-else>
                              <p class="font-weight-bold">
                                Disparador:
                                {{
                                  autoresponderItem.triggerSetting.conditionText
                                }}
                              </p>
                            </div>
                          </div>
                          <div class="close-bottom">
                            <v-menu bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  color="gray300"
                                  class="mt-4"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon color="primary">
                                    mdi-dots-vertical
                                  </v-icon>
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-item
                                  v-for="(menuItem, index) in menuItems"
                                  :key="index"
                                  @click="menuActions(menuItem.value)"
                                >
                                  <v-list-item-title>
                                    {{ menuItem.text }}
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </div>
                      </v-card>
                      <div
                        class="absolute-left"
                        :class="{ 'absolute-left-margin': rightDrawer }"
                      >
                        <div class="d-flex align-center">
                          <div class="horizontal-line"></div>
                          <v-sheet outlined color="gray300" rounded>
                            <v-card flat color="lightgray">
                              <v-card-text class="pa-1">
                                <v-btn
                                  text
                                  class="px-0"
                                  @click="selectActivityException()"
                                >
                                  <v-icon color="secondary">
                                    mdi-lightbulb-outline
                                  </v-icon>
                                  <div class="caption">
                                    Manejo de excepciones
                                  </div>
                                </v-btn>
                                <tooltip
                                  :right="true"
                                  :left="false"
                                  message="Para cuando no se cumpla<br>con ninguna de las<br>condiciones u opciones<br>creadas en la<br>Autorespuesta."
                                />
                              </v-card-text>
                            </v-card>
                          </v-sheet>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <v-card
                  v-if="!activeActivityMenu && autoresponderItem"
                  :disabled="
                    autoresponderItem.triggerSetting.triggerId === -1 &&
                    autoresponderItem.triggerSetting.conditionText !== ''
                  "
                  class="mx-auto py-1 text-center"
                  width="40"
                  :color="
                    autoresponderItem.triggerSetting.triggerId !== -1 &&
                    autoresponderItem.triggerSetting.conditionText !== ''
                      ? 'warning'
                      : 'gray300'
                  "
                  @click="activeMenu()"
                >
                  <v-icon color="white">mdi-plus-circle</v-icon>
                </v-card>
                <autoresponder-menu-list
                  v-if="
                    activeActivityMenu &&
                    autoresponderItem.autoresponsesType === ''
                  "
                  @selection-activity="selectionActivity"
                  @close-menu="activeActivityMenu = !activeActivityMenu"
                />
                <autoresponder-type
                  v-if="
                    activeActivityMenu &&
                    autoresponderItem.autoresponsesType !== ''
                  "
                  :autoresponder-item="autoresponderItem"
                  @menu-activity-actions="menuActivityActions"
                  @select-activity="selectActivity()"
                />
                <div v-if="autoresponderItem">
                  <autoresponder-menu-btn
                    v-if="
                      autoresponderItem.autoresponsesSetting &&
                      autoresponderItem.autoresponsesSetting.menuSetting
                        .type === 'buttons'
                    "
                    :autoresponder-item="autoresponderItem"
                    @active-menu-col="activeMenuCol"
                    @active-menu-setting="selectActivity()"
                  />
                  <autoresponder-list
                    v-if="
                      autoresponderItem.autoresponsesSetting &&
                      autoresponderItem.autoresponsesSetting.menuSetting
                        .type === 'list'
                    "
                    :autoresponder-item="autoresponderItem"
                    :right-drawer="rightDrawer"
                    @active-menu-list="activeMenuList"
                  />
                </div>
              </div>
            </div>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
    <base-dialog
      v-model="changesMadeDialog"
      text-alert="Tienes cambios sin guardar, ¿Estás seguro de salir? "
      primary-btn-text="Sí, Salir"
      @primary-btn-action="goCancel()"
    />
    <delete-dialog
      v-model="activeDeleteModal"
      :title="titleDelete"
      :element-to-delete="elementToDelete"
      @change-model="activeDeleteDialog = false"
      @btn-active-action="deleteResponseType()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseDialog from '@/components/util/BaseDialog.vue'
import Tooltip from '@/components/util/Tooltip.vue'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'
import SetTriggerSetup from '@/components/modules/autoresponses/SetTriggerSetup.vue'
import AutoresponderMenuList from '@/components/modules/autoresponses/AutoresponderMenuList.vue'
import AutoresponderType from '@/components/modules/autoresponses/AutoresponderType.vue'
import AutoresponderSetting from '@/components/modules/autoresponses/AutoresponderSetting.vue'
import AutoresponderMenuSetting from '@/components/modules/autoresponses/AutoresponderMenuSetting.vue'
import AutoresponderMenuBtn from '@/components/modules/autoresponses/AutoresponderMenuBtn.vue'
import AutoresponderList from '@/components/modules/autoresponses/AutoresponderList.vue'
import ExceptionHandlingSetting from '@/components/modules/autoresponses/ExceptionHandlingSetting.vue'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

export default {
  name: 'CreateAutoresponderConfigDialog',
  components: {
    BaseDialog,
    Tooltip,
    SetTriggerSetup,
    AutoresponderMenuList,
    AutoresponderType,
    AutoresponderSetting,
    AutoresponderMenuSetting,
    AutoresponderMenuBtn,
    AutoresponderList,
    ExceptionHandlingSetting,
    DeleteDialog,
  },
  mixins: [customTableBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeDeleteModal: false,
      titleDelete: '',
      elementToDelete: '',
      changesMade: false,
      changesMadeDialog: false,
      editName: false,
      rename: '',
      rightDrawer: false,
      activeActivityMenu: false,
      activeCreateTrigger: false,
      menuItems: [{ text: 'Editar entrada', value: 'Edit' }],
      activeAutoresponderSetting: false,
      activeMenuAutoresponderSetting: false,
      activeExceptionSetting: false,
      autoresponderItem: null,
      activateTriggerSetting: false,
      zoom: 1,
      newAutoresponsesSetting: {
        messageType: '',
        messageText: '',
        assignAgent: {
          active: false,
          type: '',
          byDatabase: false,
          selectGroup: '',
        },
        exceptionHandlingStting: {
          actionType: '',
          exceptionText: '',
        },
        menuSetting: {
          type: '',
          buttonList: [
            {
              id: 1,
              name: 'Opción 1',
            },
            {
              id: 2,
              name: 'Opción 2',
            },
          ],
          listList: [
            {
              id: 1,
              name: 'Opción 1',
            },
            {
              id: 2,
              name: 'Opción 2',
            },
            {
              id: 3,
              name: 'Opción 3',
            },
            {
              id: 4,
              name: 'Opción 4',
            },
            {
              id: 5,
              name: 'Opción 5',
            },
          ],
        },
      },
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    'selectedItem.id': {
      handler() {
        this.searchAutoresponder()
      },
    },
  },
  mounted() {
    this.searchAutoresponder()
  },
  methods: {
    closeSetting() {
      this.activateTriggerSetting = false
      this.rightDrawer = false
      this.activeAutoresponderSetting = false
      this.activeExceptionSetting = false
      this.activeMenuAutoresponderSetting = false
    },
    async searchAutoresponder() {
      this.autoresponderItem =
        await this.getAutoresponseByClientIdAndAutoresponsesId(
          this.clientId,
          this.selectedItem.Id
        )
      console.log('array: ', this.selectedItem)
    },
    exitModelDatabase() {
      if (this.changesMade) {
        this.changesMadeDialog = true
      } else {
        this.$emit('change-model', false)
      }
    },
    activeChangeName() {
      this.rename = this.selectedItem.name
      this.editName = !this.editName
    },
    changeName() {
      this.selectedItem.name = this.rename
      this.editName = !this.editName
    },
    async saveAutoresponder() {
      const changeAutoresponse = {
        clientId: this.clientId,
        autoresponses: this.autoresponderItem,
      }
      await this.changeAutoresponseByclientId(changeAutoresponse)
      this.changesMade = false
    },
    async activeAutoresponder(status) {
      if (status === 'inactive') status = 'active'
      else status = 'inactive'
      const newStatus = {
        clientId: this.clientId,
        autoresponsesId: this.selectedItem.id,
        status,
      }
      const result = await this.changeStatusByClientId(newStatus)
      if (result) {
        this.selectedItem.status = status
      }
      console.log('active ', status)
    },
    menuActions(menuItem) {
      this.closeSetting()
      if (menuItem === 'Edit') {
        this.rightDrawer = true
        this.activateTriggerSetting = true
      }
    },
    activeMenu() {
      this.closeSetting()
      this.activeActivityMenu = !this.activeActivityMenu
    },
    selectionActivity(menuItem) {
      this.autoresponderItem.autoresponsesType = menuItem.value
      if (menuItem.value === 'menu') {
        this.autoresponderItem.autoresponsesSetting.menuSetting.type = 'buttons'
      }
    },
    goCancel() {
      this.changesMadeDialog = false
      this.$emit('change-model', false)
    },
    async selectActivity() {
      await this.closeSetting()
      this.rightDrawer = true
      if (this.autoresponderItem.autoresponsesType === 'single') {
        this.activeAutoresponderSetting = true
      }
      if (this.autoresponderItem.autoresponsesType === 'menu') {
        this.activeMenuAutoresponderSetting = true
      }
    },
    async selectActivityException() {
      await this.closeSetting()
      this.rightDrawer = true
      this.activeExceptionSetting = true
    },
    menuActivityActions(menuItem) {
      if (menuItem === 'Editar') this.selectActivity()
      if (menuItem === 'Eliminar') {
        this.activeDeleteModal = true
        this.titleDelete = `Eliminar la respuesta ${this.autoresponderItem.autoresponsesType}`
        this.elementToDelete = this.autoresponderItem.autoresponsesType
      }
    },
    async deleteResponseType() {
      await this.closeSetting()
      this.autoresponderItem.autoresponsesType = ''
      this.autoresponderItem.autoresponsesSetting = this.newAutoresponsesSetting
      this.changesMade = true
      this.activeDeleteModal = false
    },
    activeMenuCol(col) {
      console.log('agrega: ', col)
    },
    activeMenuList(col) {
      console.log('agrega: ', col)
    },
    applyZoom(type) {
      if (type === 'mas') {
        if (this.zoom < 1) this.zoom += 0.1
      } else if (this.zoom > 0.4) this.zoom -= 0.1
      const element = document.getElementById('centercolumn')
      element.style.transform = `scale(${this.zoom})`
    },
  },
}
</script>
<style scoped>
.all-screen {
  width: 100%;
  background-color: var(--v-gray-base);
  height: calc(100vh - 64px) !important;
  overflow: hidden;
}
.close-bottom {
  position: absolute;
  top: 0px;
  right: 0;
}
.absolute-left {
  position: absolute;
  top: 10px;
  left: calc(100vw / 2 + 114px);
}
.absolute-left-margin {
  left: calc((100vw / 2) - 169px + 114px);
}
.icon-left {
  position: absolute;
  top: 0;
  left: 5px;
}
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
  overflow: auto;
}
.container {
  max-width: 100%;
  overflow: hidden;
}
.right-margin {
  width: calc(100vw - 350px);
}
.horizontal-line {
  width: 23px;
  height: 2px;
  background: var(--v-gray300-base);
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
.position-line {
  position: relative;
  margin-top: -22px;
}
.zoom-style {
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.change-btn {
  animation: changeAnimation 3s ease 0s infinite normal none;
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
