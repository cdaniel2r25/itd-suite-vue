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
        <v-toolbar dense elevation="4">
          <div class="d-flex align-center">
            <div>
              <v-btn text color="primary" @click="exitModelDatabase()">
                <v-icon class="mr-2">mdi-arrow-left</v-icon>
                VOLVER
              </v-btn>
            </div>
            <div class="ml-10" style="min-width: 177px">
              <div v-show="activateSaving">
                <v-icon left color="gray300" class="rotate">mdi-reload</v-icon>
                <span class="gray300--text">Guardando...</span>
              </div>
              <div v-show="activateSave">
                <v-icon left color="gray300">mdi-check-circle-outline</v-icon>
                <span class="gray300--text">Cambios guardados</span>
              </div>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            <v-tabs v-model="selectTab">
              <v-tab>Preguntas</v-tab>
              <v-tab>Configuración</v-tab>
              <v-tab>Resultados</v-tab>
            </v-tabs>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" icon class="mx-2" @click="sendEyeChanges()">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            text
            class="max2"
            @click="activeSendTest = !activeSendTest"
          >
            enviar prueba
          </v-btn>
          <v-btn
            color="primary"
            class="mx-2 white--text"
            @click="activeSendSurvey = !activeSendSurvey"
          >
            enviar
          </v-btn>
        </v-toolbar>
        <v-container fluid class="px-0 py-0">
          <div v-if="selectTab === 0 && selectedItem" class="all-screen">
            <v-card color="white" width="700" class="mt-6 mb-2 px-6 pb-6">
              <v-text-field
                v-model="selectedItem.name"
                hide-details
                placeholder="Título encuesta"
                @change="applySaving()"
              />
              <v-text-field
                v-model="selectedItem.description"
                hide-details
                placeholder="Descripción..."
                class="caption"
                @change="applySaving()"
              />
            </v-card>
            <div v-if="!activeMenuList && activeStart">
              <v-hover v-slot="{ hover }">
                <v-card
                  width="200"
                  class="mt-1"
                  color="white"
                  :class="{ 'on-hover': hover }"
                  @click="activeMenuList = !activeMenuList"
                >
                  <v-card-text class="d-flex align-center">
                    <v-icon color="secondary" class="mr-4">
                      mdi-plus-circle
                    </v-icon>
                    <div class="text-center">
                      <div>Crea una pregunta</div>
                      <div class="caption">Inicia tu encuesta</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </div>
            <div v-if="!activeStart">
              <div v-for="(contentItem, i) in selectedItem.contents" :key="i">
                <v-card color="white" width="700" class="mt-2">
                  <v-card-title class="card-head d-flex justify-end">
                    <span class="mr-6 gray300--text">Tipo de respuesta:</span>
                    <v-menu offset-y>
                      <template v-slot:activator="{ attrs, on }">
                        <div class="gray300--text" v-bind="attrs" v-on="on">
                          {{ menuListString[contentItem.type] }}
                          <v-icon>mdi-chevron-down</v-icon>
                        </div>
                      </template>
                      <v-list>
                        <v-list-item-group v-model="contentItem.typeIndex">
                          <v-list-item
                            v-for="(item, index) in menuList"
                            :key="index"
                            dense
                            @click="
                              changeSelectMenuType(contentItem, item, index)
                            "
                          >
                            {{ item.text }}
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </v-card-title>
                  <v-card-text class="px-6">
                    <unique-selection-setting
                      v-if="contentItem.type === 'uniqueSelection'"
                      :key="keyUniqueSelection"
                      :selected-item="contentItem"
                      @add-option="addOption(contentItem)"
                      @add-another="addAnother(contentItem)"
                      @delete-item-option="deleteItemOption"
                      @apply-saving="applySaving('keyUniqueSelection')"
                    />
                    <multiple-selection-setting
                      v-if="contentItem.type === 'multipleSelection'"
                      :key="keyMultipleSelection"
                      :selected-item="contentItem"
                      @add-option="addOption(contentItem)"
                      @add-another="addAnother(contentItem)"
                      @delete-item-option="deleteItemOption"
                      @apply-saving="applySaving('keyMultipleSelection')"
                    />
                    <star-rating-setting
                      v-if="contentItem.type === 'starRating'"
                      :key="keyStarRating"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyStarRating')"
                    />
                    <text-response-setting
                      v-if="contentItem.type === 'textResponse'"
                      :key="keyTextResponse"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyTextResponse')"
                    />
                    <linear-scale-setting
                      v-if="contentItem.type === 'linearScale'"
                      :key="keyLinearScale"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyLinearScale')"
                    />
                    <date-setting
                      v-if="contentItem.type === 'date'"
                      :key="keyDateSetting"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyDateSetting')"
                    />
                    <time-setting
                      v-if="contentItem.type === 'time'"
                      :key="keyTimeSetting"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyTimeSetting')"
                    />
                    <multiple-selections-setting
                      v-if="contentItem.type === 'multipleSelections'"
                      :key="keyMultipleSelections"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyMultipleSelections')"
                      @delete-col-option="deleteColOption"
                      @delete-row-option="deleteRowOption"
                      @add-row="
                        addRowmultipleSelections(
                          contentItem,
                          keyMultipleSelections
                        )
                      "
                      @add-col="
                        addColmultipleSelections(
                          contentItem,
                          keyMultipleSelections
                        )
                      "
                    />
                    <simple-selections-setting
                      v-if="contentItem.type === 'simpleSelections'"
                      :key="keySimpleSelections"
                      :selected-item="contentItem"
                      @apply-saving="applySaving('keyMultipleSelections')"
                      @delete-col-option="deleteColOption"
                      @delete-row-option="deleteRowOption"
                      @add-row="
                        addRowmultipleSelections(
                          contentItem,
                          keySimpleSelections
                        )
                      "
                      @add-col="
                        addColmultipleSelections(
                          contentItem,
                          keySimpleSelections
                        )
                      "
                    />
                  </v-card-text>
                  <v-card-actions>
                    <div
                      class="d-flex justify-end align-center"
                      style="width: 100%"
                    >
                      <v-checkbox
                        v-model="contentItem.required"
                        hide-details
                        color="gray300"
                        class="mt-0"
                        @change="applySaving()"
                      >
                        <template v-slot:label>
                          <div class="caption gray300--text">Obligatorio</div>
                        </template>
                      </v-checkbox>
                      <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        @click="cloneContentItem(contentItem, i)"
                      >
                        <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        @click="deleteContentItem(i)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-card-actions>
                </v-card>
              </div>
              <div class="position-line">
                <div class="pb-6 line" style="height: 48px"></div>
              </div>
              <v-card
                v-if="!activeMenuList"
                class="py-1 text-center ml-auto mr-auto"
                width="40"
                color="secondary"
                @click="activeMenuList = !activeMenuList"
              >
                <v-icon color="white">mdi-plus-circle</v-icon>
              </v-card>
            </div>
            <v-card v-if="activeMenuList" width="300" class="pb-4">
              <div class="cancel-btn">
                <v-btn
                  icon
                  color="gray300"
                  @click="activeMenuList = !activeMenuList"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-card-title class="accent--text">
                Elige tipo de respuesta
              </v-card-title>
              <div class="overflow-y-auto" style="height: 400px">
                <v-list class="mx-4">
                  <v-list-item
                    v-for="(item, index) in menuList"
                    :key="index"
                    dense
                    class="style-list"
                    @click="selectMenuType(item, index)"
                  >
                    <v-list-item-action class="mr-1">
                      <v-icon color="primary" small>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ item.text }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </div>
          <div v-if="selectTab === 1" class="all-screen background-tab-white">
            <configuration-setting
              :selected-item="selectedItem"
              @apply-saving="applySaving()"
            />
          </div>
          <div v-if="selectTab === 2" class="all-screen background-tab-white">
            <see-results :selected-item="selectedItem" />
          </div>
        </v-container>
      </v-card>
    </v-dialog>
    <send-survey-dialog
      v-model="activeSendSurvey"
      @go-create-campaign="goCreateCampaign()"
    />
    <html-view-dialog v-model="activeHtmlView" :selected-item="selectedItem" />
    <send-test-dialog v-model="activeSendTest" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import surveysBffMixin from '@/mixins/services/surveysBffMixin'
import UniqueSelectionSetting from '@/components/modules/surveys/UniqueSelectionSetting.vue'
import MultipleSelectionSetting from '@/components/modules/surveys/MultipleSelectionSetting.vue'
import ConfigurationSetting from '@/components/modules/surveys/ConfigurationSetting.vue'
import SendSurveyDialog from '@/components/modules/surveys/SendSurveyDialog.vue'
import StarRatingSetting from '@/components/modules/surveys/StarRatingSetting.vue'
import TextResponseSetting from '@/components/modules/surveys/TextResponseSetting.vue'
import LinearScaleSetting from '@/components/modules/surveys/LinearScaleSetting.vue'
import DateSetting from '@/components/modules/surveys/DateSetting.vue'
import TimeSetting from '@/components/modules/surveys/TimeSetting.vue'
import MultipleSelectionsSetting from '@/components/modules/surveys/MultipleSelectionsSetting.vue'
import SimpleSelectionsSetting from '@/components/modules/surveys/SimpleSelectionsSetting.vue'
import HtmlViewDialog from '@/components/modules/surveys/HtmlViewDialog.vue'
import SeeResults from '@/components/modules/surveys/SeeResults.vue'
import SendTestDialog from '@/components/modules/surveys/SendTestDialog.vue'

export default {
  name: 'EditNewSurveysDialog',
  components: {
    UniqueSelectionSetting,
    MultipleSelectionSetting,
    ConfigurationSetting,
    SendSurveyDialog,
    StarRatingSetting,
    TextResponseSetting,
    LinearScaleSetting,
    DateSetting,
    TimeSetting,
    MultipleSelectionsSetting,
    SimpleSelectionsSetting,
    HtmlViewDialog,
    SeeResults,
    SendTestDialog,
  },
  mixins: [surveysBffMixin],
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
      keyUniqueSelection: 0,
      keyMultipleSelection: 0,
      keyMultipleSelections: 0,
      keySimpleSelections: 0,
      keyTimeSetting: 0,
      keyDateSetting: 0,
      keyLinearScale: 0,
      keyTextResponse: 0,
      keyStarRating: 0,
      loading: false,
      activateSaving: false,
      activateSave: false,
      activeStart: true,
      activeSendSurvey: false,
      activeHtmlView: false,
      activeSendTest: false,
      selectTab: 0,
      activeMenuList: false,
      menuListString: {
        uniqueSelection: 'Selección única',
        multipleSelection: 'Selección múltiple',
        starRating: 'Puntuación con estrellas',
        textResponse: 'Respuesta de texto',
        linearScale: 'Escala lineal',
        simpleSelections: 'Selecciones simples',
        multipleSelections: 'Selecciones múltiples',
        date: 'Fecha',
        time: 'Hora',
      },
      menuList: [
        {
          text: 'Selección única',
          value: 'uniqueSelection',
          icon: 'mdi-radiobox-marked',
        },
        {
          text: 'Selección multiple',
          value: 'multipleSelection',
          icon: 'mdi-checkbox-marked',
        },
        {
          text: 'Puntuación con estrellas',
          value: 'starRating',
          icon: 'mdi-star',
        },
        {
          text: 'Respuesta de texto',
          value: 'textResponse',
          icon: 'mdi-card-text',
        },
        {
          text: 'Escala lineal',
          value: 'linearScale',
          icon: 'mdi-dots-horizontal',
        },
        {
          text: 'Selecciones simples',
          value: 'simpleSelections',
          icon: 'mdi-format-list-bulleted',
        },
        {
          text: 'Selecciones múltiples',
          value: 'multipleSelections',
          icon: 'mdi-dots-grid',
        },
        {
          text: 'Fecha',
          value: 'date',
          icon: 'mdi-calendar-range',
        },
        {
          text: 'Hora',
          value: 'time',
          icon: 'mdi-clock-time-four-outline',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    selectTab: {
      handler(value) {
        console.log('tabs: ', value)
      },
    },
  },
  mounted() {
    this.checkNewSurveys()
  },
  methods: {
    checkNewSurveys() {
      if (this.selectedItem.contents.length !== 0) {
        this.activeStart = false
      }
    },
    exitModelDatabase() {
      this.$emit('change-model', false)
    },
    sendEyeChanges() {
      this.activeHtmlView = true
    },
    async applySaving(type = '') {
      if (type !== '') {
        if (type === 'keyUniqueSelection') this.keyUniqueSelection += 1
        if (type === 'keyMultipleSelection') this.keyMultipleSelection += 1
        if (type === 'keyMultipleSelections') this.keyMultipleSelections += 1
        if (type === 'keySimpleSelections') this.keySimpleSelections += 1
        if (type === 'keyTimeSetting') this.keyTimeSetting += 1
        if (type === 'keyDateSetting') this.keyDateSetting += 1
        if (type === 'keyLinearScale') this.keyLinearScale += 1
        if (type === 'keyTextResponse') this.keyTextResponse += 1
        if (type === 'keyStarRating') this.keyStarRating += 1
      }
      this.activateSaving = true
      this.activateSave = false
      if (this.selectedItem.surveyId === '') this.selectedItem.surveyId = -1
      const changeItem = {
        clientId: this.clientId,
        surveyModel: this.selectedItem,
      }
      const result = await this.registerSurveyByClientIdAndSurveyId(changeItem)
      this.selectedItem.surveyId = result
      this.activateSaving = false
      this.activateSave = true
    },
    selectMenuType(itemMenu, index) {
      console.log('menu: ', itemMenu)
      this.activeStart = false
      this.activeMenuList = false
      let newItem = {}
      if (index < 2) {
        newItem = {
          type: itemMenu.value,
          typeIndex: index,
          question: '',
          response: '',
          options: [
            {
              option: 'Opción 1',
            },
          ],
          required: false,
        }
      } else if (index === 2) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: 0,
          option: {
            length: 10,
          },
        }
      } else if (index === 3) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: '',
          option: {
            maximumCharacters: 500,
          },
        }
      } else if (index === 4) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: '',
          option: {
            from: 1,
            to: 5,
          },
        }
      } else if (index === 5) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: [
            { value: 'Fila 1', answer: '' },
            { value: 'Fila 2', answer: '' },
            { value: 'Fila 3', answer: '' },
          ],
          options: {
            rows: [
              {
                row: 'Fila 1',
              },
              {
                row: 'Fila 2',
              },
              {
                row: 'Fila 3',
              },
            ],
            columns: [
              {
                col: 'Columna 1',
              },
              {
                col: 'Columna 2',
              },
              {
                col: 'Columna 3',
              },
            ],
          },
        }
      } else if (index === 6) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: [
            { value: 'Fila 1', answer: '' },
            { value: 'Fila 2', answer: '' },
            { value: 'Fila 3', answer: '' },
          ],
          options: {
            rows: [
              {
                row: 'Fila 1',
              },
              {
                row: 'Fila 2',
              },
              {
                row: 'Fila 3',
              },
            ],
            columns: [
              {
                col: 'Columna 1',
              },
              {
                col: 'Columna 2',
              },
              {
                col: 'Columna 3',
              },
            ],
          },
        }
      } else if (index === 7) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: '',
          option: {
            date: '',
          },
        }
      } else if (index === 8) {
        newItem = {
          question: '',
          type: itemMenu.value,
          typeIndex: index,
          required: false,
          response: '',
          option: {
            time: '',
          },
        }
      }
      this.selectedItem.contents.push(newItem)
    },
    changeSelectMenuType(contentItem, item, index) {
      const itemIndex = contentItem.typeIndex
      if (
        (itemIndex === 0 && index === 1) ||
        (itemIndex === 1 && index === 0)
      ) {
        contentItem.typeIndex = index
        contentItem.type = item.value
      } else if (index === 0 || index === 1) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        contentItem.response = ''
        contentItem.options = [
          {
            option: 'Opción 1',
          },
        ]
      } else if (index === 2) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = ''
        contentItem.option = {
          length: 10,
          response: 0,
        }
      } else if (index === 3) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = ''
        contentItem.option = {
          maximumCharacters: 500,
          response: '',
        }
      } else if (index === 4) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = ''
        contentItem.option = {
          from: 1,
          to: 5,
          response: '',
        }
      } else if (index === 5) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = [
          { value: 'Fila 1', answer: '' },
          { value: 'Fila 2', answer: '' },
          { value: 'Fila 3', answer: '' },
        ]
        contentItem.options = {
          rows: [
            {
              row: 'Fila 1',
            },
            {
              row: 'Fila 2',
            },
            {
              row: 'Fila 3',
            },
          ],
          columns: [
            {
              col: 'Columna 1',
            },
            {
              col: 'Columna 2',
            },
            {
              col: 'Columna 3',
            },
          ],
        }
      } else if (index === 6) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = [
          { value: 'Fila 1', answer: '' },
          { value: 'Fila 2', answer: '' },
          { value: 'Fila 3', answer: '' },
        ]
        contentItem.options = {
          rows: [
            {
              row: 'Fila 1',
            },
            {
              row: 'Fila 2',
            },
            {
              row: 'Fila 3',
            },
          ],
          columns: [
            {
              col: 'Columna 1',
            },
            {
              col: 'Columna 2',
            },
            {
              col: 'Columna 3',
            },
          ],
        }
      } else if (index === 7) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = ''
        contentItem.option = {
          date: '',
        }
      } else if (index === 8) {
        contentItem.typeIndex = index
        contentItem.type = item.value
        delete contentItem.response
        contentItem.response = ''
        contentItem.option = {
          time: '',
        }
      }
    },
    addOption(contentItem) {
      const optionId = contentItem.options.length + 1
      const newOption = {
        option: `Opción ${optionId}`,
      }
      contentItem.options.push(newOption)
      if (contentItem.typeIndex === 0) this.applySaving('keyUniqueSelection')
      if (contentItem.typeIndex === 1) this.applySaving('keyMultipleSelection')
      this.applySaving()
    },
    addAnother(contentItem) {
      const newOption = {
        option: `Otro`,
      }
      contentItem.options.push(newOption)
      this.applySaving()
    },
    addRowmultipleSelections(contentItem, key) {
      const rowId = contentItem.options.rows.length + 1
      const newRow = {
        row: `Fila ${rowId}`,
      }
      contentItem.options.rows.push(newRow)
      contentItem.response.push({ answer: '' })
      this.$forceUpdate()
      this.applySaving(key)
    },
    addColmultipleSelections(contentItem, key) {
      const colId = contentItem.options.columns.length + 1
      const newCol = {
        col: `Columna ${colId}`,
      }
      contentItem.options.columns.push(newCol)
      this.applySaving(key)
    },
    deleteItemOption(contentItem, index) {
      contentItem.options.splice(index, 1)
      if (contentItem.typeIndex === 0) this.applySaving('keyUniqueSelection')
      if (contentItem.typeIndex === 1) this.applySaving('keyMultipleSelection')
    },
    deleteColOption(contentItem, index) {
      contentItem.options.columns.splice(index, 1)
      if (contentItem.typeIndex === 5) this.applySaving('keySimpleSelections')
      if (contentItem.typeIndex === 6) this.applySaving('keyMultipleSelections')
    },
    deleteRowOption(contentItem, index) {
      contentItem.options.rows.splice(index, 1)
      contentItem.response.splice(index, 1)
      if (contentItem.typeIndex === 5) this.applySaving('keySimpleSelections')
      if (contentItem.typeIndex === 6) this.applySaving('keyMultipleSelections')
    },
    cloneContentItem(contentItem, index) {
      const newContent = JSON.parse(JSON.stringify(contentItem))
      const newContentsItems = []
      this.selectedItem.contents.forEach((item, indexI) => {
        newContentsItems.push(item)
        if (indexI === index) {
          newContentsItems.push(newContent)
        }
      })
      this.selectedItem.contents = newContentsItems
      this.applySaving()
    },
    deleteContentItem(index) {
      this.selectedItem.contents.splice(index, 1)
      this.applySaving()
    },
    goCreateCampaign() {
      this.activeSendSurvey = false
    },
  },
}
</script>
<style scoped>
.all-screen {
  margin-top: 4px;
  width: 100%;
  height: calc(100vh - 52px) !important;
  position: relative;
  background-color: var(--v-gray100-base);
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}
.background-tab-white {
  background-color: white !important;
}
.on-hover {
  border: 2px solid var(--v-secondary-base) !important;
}
.cancel-btn {
  position: absolute;
  top: 0;
  right: 0;
}
.style-list {
  border-bottom: 1px solid var(--v-gray-base);
}
.card-head {
  background-color: var(--v-lightcyan-base);
  font-size: 0.875rem;
}
:deep(.v-card--link:before) {
  background-color: white !important;
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
</style>
