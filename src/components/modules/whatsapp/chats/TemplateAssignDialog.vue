<template>
  <v-dialog v-model="templateDialog" persistent max-width="600">
    <v-card class="pa-5">
      <v-card-title class="text-h5 justify-center">
        Enviar plantilla
      </v-card-title>
      <v-card-text class="d-flex flex-column justify-center">
        <div class="d-flex justify-center my-2 mb-10">
          Para iniciar una nueva sesión de 24hrs. requieres
          <div style="font-weight: 400">enviar una plantilla</div>
        </div>
        <div>
          <v-combobox
            v-model="selectedTemplate"
            :items="templates"
            item-text="name"
            return-object
            label="Plantilla para enviar"
            placeholder="Seleccionar plantilla"
            outlined
            @change="cleanSelection"
          />
        </div>
        <!-- var assign -->
        <v-row
          v-if="selectedTemplate !== null"
          justify="center"
          class="flex-column"
        >
          <!-- asignacion vars -->
          <v-row
            v-for="(varhead, index) in headVars2"
            :key="index"
            no-gutters
            justify="center"
            class="px-3"
            dense
          >
            <v-col
              v-if="index === 0"
              cols="12"
              class="d-flex justify-start mt-2 mb-n4 accent--text"
            >
              Header
            </v-col>
            <v-col cols="12" class="d-flex justify-end my-2 accent--text">
              <div>
                <v-menu bottom close-on-click>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-0 pr-0 pl-0"
                      color="primary"
                      small
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      INSERTAR DATO
                      <v-icon class="pl-2"> mdi-plus-circle-outline </v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, headlistIndex) in insertVarsItems"
                      :key="headlistIndex"
                      @click="menuHeader(item.id, varhead)"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <v-col cols="2" class="gray rounded text-center">
                {{ varhead.varText }}
              </v-col>
              <v-col cols="2" class="text-center dense-field">
                <v-icon>mdi-arrow-right</v-icon>
              </v-col>
              <v-col cols="4" class="pa-0 dense-field">
                <v-text-field
                  v-model="varhead.varValue"
                  class="dense-field"
                  label="Corresponde a:"
                  placeholder="Ingresar"
                  hide-details
                  outlined
                  @input="assignHeadVar(varhead)"
                />
              </v-col>
            </v-col>
          </v-row>
          <!-- asignacion vars -->
          <!-- asignacion vars BODY-->
          <v-row
            v-for="(varbody, index) in bodyVars2"
            :key="varbody.text"
            no-gutters
            justify="center"
            class="px-3"
            :class="{ 'mt-2': index > 0 }"
            dense
          >
            <v-col
              v-if="index === 0"
              cols="12"
              class="d-flex justify-start mt-2 mb-n4 accent--text"
            >
              Body
            </v-col>
            <v-col cols="12" class="d-flex justify-end my-2 accent--text">
              <div>
                <v-menu bottom close-on-click>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-0 pr-0 pl-0"
                      color="primary"
                      small
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      INSERTAR DATO
                      <v-icon class="pl-2"> mdi-plus-circle-outline </v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, listIndex) in insertVarsItems"
                      :key="listIndex"
                      @click="menuBody(item.id, varbody)"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <v-col cols="2" class="gray rounded text-center">
                {{ varbody.varText }}
              </v-col>
              <v-col cols="2" class="text-center dense-field">
                <v-icon>mdi-arrow-right</v-icon>
              </v-col>
              <v-col cols="4" class="pa-0">
                <v-text-field
                  v-model="varbody.varValue"
                  class="dense-field"
                  label="Corresponde a:"
                  placeholder="Ingresar"
                  hide-details
                  outlined
                  style="height: 26px"
                  @input="assignBodyVar(varbody)"
                />
              </v-col>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-10" style="height: fit-content">
            <v-card
              class="dialog-template pa-4"
              style="
                min-width: calc(100% - 48px);
                max-width: calc(100% - 48px);
                height: fit-content;
              "
              :style="{
                'background-image':
                  'url(' + require('@/assets/background_whatsapp.png') + ')',
              }"
            >
              <div
                v-if="selectedTemplate !== null"
                class="template-message-card template-message-card-wrap px-5 py-2"
              >
                <v-row
                  no-gutters
                  justify="start"
                  class="template-message-number"
                >
                  +{{ selectedChat.phone }}
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" class="">
                    <span
                      v-for="(item, hIndex) in transformedHeaderText"
                      :key="hIndex"
                    >
                      <span :class="{ 'bold-text': item.bold }">
                        <span :class="{ 'italic-text': item.italic }">
                          <span
                            v-if="item.isVar"
                            ref="headvar"
                            :class="{ 'sub-text': item.sub }"
                          >
                            {{ item.text }}
                          </span>
                          <span v-else :class="{ 'sub-text': item.sub }">
                            {{ item.text }}
                          </span>
                        </span>
                      </span>
                    </span>
                  </v-col>
                </v-row>
                <v-row class="justify-end">
                  <v-col cols="12" class="">
                    <span
                      v-for="(item, bIndex) in transformedBodyText"
                      :key="bIndex"
                    >
                      <span :class="{ 'bold-text': item.bold }">
                        <span :class="{ 'italic-text': item.italic }">
                          <span
                            v-if="item.isVar"
                            ref="bodyvar"
                            :class="{ 'sub-text': item.sub }"
                          >
                            {{ item.text }}
                          </span>
                          <span v-else :class="{ 'sub-text': item.sub }">
                            {{ item.text }}
                          </span>
                        </span>
                      </span>
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters class="template-message-footer">
                  {{ selectedTemplate.footer }}
                </v-row>
                <v-row
                  no-gutters
                  justify="end"
                  class="template-message-time mb-n2 mr-n3"
                >
                  {{ getCurrentTimeHHMM() }}
                </v-row>
              </div>
              <div v-else class="template-message-card px-5 py-2">
                <v-row
                  no-gutters
                  justify="start"
                  class="template-message-number"
                >
                  +56934212359
                </v-row>
                <v-row no-gutters class="template-message-header">
                  Bienvenido/a al canal Whatsapp de ITD
                </v-row>
                <v-row no-gutters>
                  Hola 1, has sido seleccionada para probar WhatsApp como nuevo
                  canal interactivo de ITD 💻. Cuéntanos, ¿consideras que esta
                  sería una buena herramienta para recibir información? Responde
                  Si o No. Gracias 😀
                </v-row>
                <v-row no-gutters class="template-message-footer">
                  Somos Tu Comunicación Multicanal
                </v-row>
                <v-row
                  no-gutters
                  justify="end"
                  class="template-message-time mb-n2 mr-n3"
                >
                  15:54
                </v-row>
              </div>
            </v-card>
          </v-row>
        </v-row>
        <!-- var assign -->
      </v-card-text>
      <v-card-actions class="mb-5 pt-10">
        <v-spacer />
        <v-btn color="primary" outlined @click="cleanTemplate()">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="sendTemplate()"> Enviar </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'
import stringsMixin from '@/mixins/util/stringsMixin'
import dateMixin from '@/mixins/util/dateMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateAssignDialog',
  mixins: [templateBffMixin, stringsMixin, dateMixin],
  model: {
    prop: 'templateDialog',
    event: 'change-model',
  },
  props: {
    templateDialog: {
      type: Boolean,
      default: false,
    },
    selectedChat: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      templates: [],
      selectedTemplate: null,
      refreshKey: 0,
      headVars2: [],
      bodyVars2: [],
      insertVarsItems: [
        {
          id: 0,
          text: 'Teléfono de contacto',
        },
        {
          id: 1,
          text: 'Nombre',
        },
        {
          id: 2,
          text: 'Nombre completo del agente',
        },
        {
          id: 3,
          text: 'Teléfono de la cuenta',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId', 'userName']),

    transformedHeaderText() {
      if (this.selectedTemplate.id !== null)
        return this.bodyTextRich(this.selectedTemplate.headView.content)
      return []
    },
    transformedBodyText() {
      if (this.selectedTemplate.id !== null)
        return this.bodyTextRich(this.selectedTemplate.body)
      return []
    },
  },

  mounted() {
    this.populateTemplates()
  },

  methods: {
    getHeadVars() {
      // eslint-disable-next-line no-unused-expressions
      this.refreshKey
      if (
        this.selectedTemplate &&
        this.selectedTemplate.headView.content !== ''
      ) {
        this.headVars2 = this.getVariablesBetweenBracketsToAssign(
          this.selectedTemplate.headView.content
        )
      } else this.headVars2 = []
    },
    getBodyVars() {
      if (this.selectedTemplate && this.selectedTemplate.body !== '') {
        this.bodyVars2 = this.getVariablesBetweenBracketsToAssign(
          this.selectedTemplate.body
        )
      } else this.bodyVars2 = []
    },
    async populateTemplates() {
      const filterService = {
        clientId: this.clientId,
        page: -1,
        statusList: [1],
      }

      const templatesListTMP = await this.getTemplates(filterService)

      this.templates = templatesListTMP.dataList
      this.templates = this.templates.map(({ header: headView, ...rest }) => ({
        headView,
        ...rest,
      }))
    },
    assignBodyVar(item) {
      item.varValue = item.varValue.trim()
      item.varValue = item.varValue.replace(/ +(?= )/g, '')
      if (item.varValue.length) {
        this.$refs.bodyvar[item.text - 1].innerText = item.varValue
      } else this.$refs.bodyvar[item.text - 1].innerText = item.varText
    },
    assignHeadVar(item) {
      item.varValue = item.varValue.trim()
      item.varValue = item.varValue.replace(/ +(?= )/g, '')
      if (item.varValue.length) {
        this.$refs.headvar[item.text - 1].innerText = item.varValue
      } else this.$refs.headvar[item.text - 1].innerText = item.varText
    },
    cleanSelection(evt) {
      const temp = evt
      this.selectedTemplate = null
      this.selectedTemplate = temp
      // eslint-disable-next-line no-plusplus
      this.refreshKey++
      this.headVars2 = []
      this.bodyVars2 = []
      this.getHeadVars()
      this.getBodyVars()
    },
    cleanTemplate() {
      this.headVars2 = []
      this.bodyVars2 = []
      this.selectedTemplate = null
      this.$emit('change-model', false)
    },
    menuHeader(item, variable) {
      if (item === 0) {
        variable.varValue = this.selectedChat.phone
      } else if (item === 1) {
        variable.varValue = this.selectedChat.name
      } else if (item === 2) {
        variable.varValue = this.userName
      } else if (item === 3) {
        variable.varValue = this.selectedChat.sender.name
      }
      this.assignHeadVar(variable)
    },
    menuBody(item, variable) {
      if (item === 0) {
        variable.varValue = `+${this.selectedChat.phone}`
      } else if (item === 1) {
        variable.varValue = this.selectedChat.name
      } else if (item === 2) {
        variable.varValue = this.userName
      } else if (item === 3) {
        variable.varValue = `+${this.selectedChat.sender.phone}`
      }
      this.assignBodyVar(variable)
    },
    sendTemplate() {
      const msg = {
        id: this.selectedTemplate.id,
        headVars: [],
        bodyVars: [],
      }
      this.headVars2.forEach((element) => {
        msg.headVars.push({ position: element.text, value: element.varValue })
      })
      this.bodyVars2.forEach((element) => {
        msg.bodyVars.push({ position: element.text, value: element.varValue })
      })
      this.cleanTemplate()
      this.$emit('btn-active-action', msg)
    },
  },
}
</script>

<style scoped>
.template-message-card {
  background-color: var(--v-whatsappgreen-base);
  word-wrap: break-word;
}
.template-message-card-wrap {
  white-space: initial;
  /* text-overflow: clip; */
  word-wrap: break-word;
}
.template-message-time {
  color: var(--v-accent-base);
  font-weight: 400;
}
.template-message-number {
  color: var(--v-whatsappblue-base);
  font-weight: 600;
}
.template-message-header {
  font-weight: 600;
  color: var(--v-accent-base);
}
.template-message-footer {
  margin-top: 5px;
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--v-accent-base);
}
.dialog-template {
  background-size: 550px;
}
.bold-text {
  font-weight: bold;
}
.italic-text {
  font-style: italic;
}
.sub-text {
  text-decoration: line-through;
}
.dense-field {
  height: 46px !important;
}
</style>
