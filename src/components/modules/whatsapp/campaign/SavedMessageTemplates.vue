<template>
  <v-form>
    <v-tabs-items v-model="tabScreen">
      <v-tab-item>
        <v-row>
          <v-col v-for="item in savedTemplatesEdit()" :key="item.id" cols="3">
            <hover-card-animation
              :card="item"
              @action="eventsHoverCardAnimation"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <v-col>
            <v-btn
              text
              class="primary--text"
              @click="
                tabScreen = 0
                clearTemplate()
              "
            >
              <v-icon>mdi-chevron-left</v-icon> Volver a opciones de plantilla
            </v-btn>
          </v-col>
        </v-row>
        <div class="d-flex flex-column">
          <v-row>
            <v-col>
              <v-card width="50%" flat>
                <preview-official-template
                  :template="viewingTemplate"
                  selection-preview
                />
              </v-card>
            </v-col>
          </v-row>
          <v-row
            v-if="
              campaign.template.headVars.length ||
              campaign.template.bodyVars.length
            "
            class="mt-5"
          >
            <v-col class="text-h6 accent--text" cols="12">
              Configura las variables de la plantilla seleccionada.
            </v-col>
          </v-row>
          <v-row v-if="campaign.template.headVars.length" class="mb-n5">
            <v-col class="text-h6 accent--text" cols="12">
              Variables Head
            </v-col>
          </v-row>
          <v-row v-if="campaign.template.headVars.length">
            <template-variables-assignment
              :template="viewingTemplate"
              :selected-database-array="campaign.database.headerConfigList"
              :campaign="campaign"
              :form-validation="validation"
            />
          </v-row>
          <v-row v-if="campaign.template.bodyVars.length" class="mb-n5">
            <v-col class="text-h6 accent--text" cols="12">
              Variables Body
            </v-col>
          </v-row>
          <v-row v-if="campaign.template.bodyVars.length">
            <template-variables-assignment
              :template="viewingTemplate"
              is-body
              :selected-database-array="campaign.database.headerConfigList"
              :campaign="campaign"
              :form-validation="validation"
            />
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog
      v-model="dialogs.previewOfficialTemplate"
      overlay-color="white"
      overlay-opacity=".8"
      width="30vw"
    >
      <v-card>
        <preview-official-template
          v-if="dialogs.previewOfficialTemplate"
          :template="viewingTemplate"
        />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            class="mb-4"
            @click="dialogs.previewOfficialTemplate = false"
          >
            Cerrar
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>
<script>
import dateMixin from '@/mixins/util/dateMixin'
import stringsMixin from '@/mixins/util/stringsMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import HoverCardAnimation from '@/components/util/HoverCardAnimation.vue'
import TemplateVariablesAssignment from '@/components/modules/whatsapp/TemplateVariablesAssignment.vue'
import PreviewOfficialTemplate from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplate.vue'

export default {
  components: {
    PreviewOfficialTemplate,
    HoverCardAnimation,
    TemplateVariablesAssignment,
  },
  mixins: [validationMixin, whatsappBffMixin, dateMixin, stringsMixin],
  props: {
    campaign: {
      type: Object,
      default: () => ({}),
    },
    savedTemplates: {
      type: Array,
      default: () => ({}),
    },
    selectedTemplate: {
      type: Object,
      default: () => ({}),
    },
    template: {
      type: Object,
      default: () => ({}),
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    viewingTemplate: null,
    dialogs: {
      previewOfficialTemplate: false,
    },
    tabScreen: 0,
    templateSelectedArray: [],
  }),
  mounted() {
    if (this.campaign.template.id && this.savedTemplates.length > 0) {
      this.activeTemplateByEdition(this.campaign.template.id)
    }
  },
  methods: {
    createdAtFormat(createdAt) {
      if (this.isValidDate(createdAt)) {
        const date = new Date(createdAt)
        return this.beutyDateFromTimestamp(date.getTime())
      }
      const date = this.DDMMYYYYtoMMDDYYY(createdAt)
      return this.beutyDateFromTimestamp(date.getTime())
    },
    contentTypeFormat(contentTypeId) {
      contentTypeId = parseInt(contentTypeId, 10)
      if (contentTypeId > 4) return 'Desconocido'
      const contentType = ['Texto', 'Imagen', 'Link', 'Documento', 'Audio']
      return contentType[contentTypeId]
    },
    contentTypeColor: (contentTypeId) => {
      contentTypeId = parseInt(contentTypeId, 10)
      if (contentTypeId > 4) return 'Desconocido'
      const contentType = [
        'primary',
        'error',
        'primary',
        'secondary',
        'primary',
      ]
      return contentType[contentTypeId]
    },
    activeTemplate(templateId) {
      if (!this.campaign.sendType) {
        this.templateSelectedArray = [templateId]
        const templateSelection = this.savedTemplates.find(
          (template) => template.id === templateId
        )
        this.viewingTemplate = templateSelection
        this.clearTemplate()
        this.assignVarsToTemplate()
        this.tabScreen = 1
        this.$emit('template-to-edit', templateSelection)
      } else {
        const template = this.templateSelectedArray.find(
          (t) => t === templateId
        )
        if (template === undefined) {
          this.templateSelectedArray.push(templateId)
        } else {
          const index = this.templateSelectedArray.findIndex(
            (t) => t === templateId
          )
          this.templateSelectedArray.splice(index, 1)
        }
      }
    },
    activeTemplateByEdition(templateId) {
      if (!this.campaign.sendType) {
        this.templateSelectedArray = [templateId]
        const templateSelection = this.savedTemplates.find(
          (template) => template.id === templateId
        )
        this.viewingTemplate = templateSelection
        this.tabScreen = 1
        this.$emit('template-to-edit', templateSelection)
      } else {
        const template = this.templateSelectedArray.find(
          (t) => t === templateId
        )
        if (template === undefined) {
          this.templateSelectedArray.push(templateId)
        } else {
          const index = this.templateSelectedArray.findIndex(
            (t) => t === templateId
          )
          this.templateSelectedArray.splice(index, 1)
        }
      }
    },
    viewTemplate(templateId) {
      this.dialogs.previewOfficialTemplate = true
      const templateSelection = this.savedTemplates.find(
        (template) => template.id === templateId
      )
      this.viewingTemplate = templateSelection
    },
    cutText(text, size) {
      return text.length <= size ? text : `${text.slice(0, size)}...`
    },
    savedTemplatesEdit() {
      const rtn = []
      this.savedTemplates.forEach((template) => {
        const selectFunct = () => {
          if (this.campaign.sendType) {
            const found = this.templateSelectedArray.find(
              (t) => t === template.id
            )
            if (found !== undefined) {
              return {
                label: 'DESELECCIONAR',
                attributes: { outlined: '', color: 'primary' },
                selected: true,
              }
            }
            return {
              label: 'SELECCIONAR',
              classes: 'primary white--text',
              selected: false,
            }
          }
          return {
            label: 'SELECCIONAR',
            classes: 'primary white--text',
            selected: false,
          }
        }
        const selectButton = selectFunct()
        const bodyCont =
          template.description != null
            ? this.cutText(template.description, 30)
            : ''
        const body = { type: 'text', content: bodyCont }
        rtn.push({
          id: template.id,
          isSelected: selectButton.selected,
          title: this.cutText(template.name, 18),
          pill: {
            label: this.contentTypeFormat(template.contentType),
            class: this.contentTypeColor(template.contentType),
          },
          body,
          footer: this.createdAtFormat(template.createdAt),
          hover: {
            header: [
              {
                id: 0,
                icon: 'mdi-dots-vertical',
                event: null,
                menu: [
                  { label: 'Duplicar', event: null },
                  { label: 'Eliminar', event: null },
                ],
              },
            ],
            body: [
              {
                id: 0,
                label: { text: selectButton.label },
                classes: selectButton.classes,
                attributes: selectButton.attributes,
                event: { name: 'activeTemplate', params: [template.id] },
              },
              {
                id: 1,
                label: { text: 'Ver', icon: 'mdi-eye' },
                attributes: { text: 'text', color: 'primary' },
                event: { name: 'viewTemplate', params: [template.id] },
              },
            ],
          },
        })
      })
      return rtn
    },
    eventsHoverCardAnimation(evt) {
      if (evt.name === 'activeTemplate') {
        this.activeTemplate(...evt.params)
      } else if (evt.name === 'viewTemplate') {
        this.viewTemplate(...evt.params)
      }
    },
    clearTemplate() {
      this.campaign.template.id = null
      this.campaign.template.headVars = []
      this.campaign.template.bodyVars = []
    },
    fillTemplateToSendObject(str) {
      const result = this.getVariablesBetweenBrackets(str)
      const resultArray = []
      result.forEach((index) => {
        const objAux = { position: index, value: null }
        resultArray.push(objAux)
      })
      return resultArray
    },
    assignVarsToTemplate() {
      this.campaign.template.id = this.viewingTemplate.id
      const headerVarsArray = this.fillTemplateToSendObject(
        this.viewingTemplate.header.content
      )
      this.campaign.template.headVars = []
      this.campaign.template.bodyVars = []
      headerVarsArray.forEach((temp) => {
        this.campaign.template.headVars.push(temp)
      })
      const varsArray = this.fillTemplateToSendObject(this.viewingTemplate.body)
      varsArray.forEach((temp) => {
        this.campaign.template.bodyVars.push(temp)
      })
    },
  },
}
</script>
