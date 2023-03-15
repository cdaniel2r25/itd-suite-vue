<template>
  <v-container fluid>
    <v-col v-if="skeletonLoader">
      <v-skeleton-loader
        type="card-heading, list-item-three-line, list-item-three-line, text, text, text, actions"
      />
    </v-col>
    <v-col v-if="!skeletonLoader && !isSent" class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            text
            color="primary"
            class="px-0"
            @click="$router.push({ name: 'TemplatesSettings' })"
          >
            <v-icon color="primary"> mdi-arrow-left </v-icon>
            VOLVER A LISTADO
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters class="my-4">
        <v-col cols="12">
          <h1>Crear plantilla</h1>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <P class="mt-2 mb-4"> Datos contenido </P>
        </v-col>
      </v-row>
      <v-form ref="formTemplate" v-model="templateValidation">
        <v-row no-gutters>
          <v-col sm="12" md="4" class="d-flex align-start">
            <v-text-field
              id="textarea"
              v-model="newTemplate.name"
              :rules="nameRules"
              label="Nombre"
              placeholder="Ingresar nombre de plantilla"
              type="text"
              outlined
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  Aqui texto de ayuda
                </div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col sm="12" md="4" class="d-flex align-start">
            <v-text-field
              v-model="newTemplate.description"
              :rules="descriptionRules"
              label="Descripción"
              placeholder="Ingresar descripción de plantilla"
              type="text"
              outlined
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  Aqui texto de ayuda
                </div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col sm="12" md="4" class="d-flex align-start">
            <v-select
              v-model="newTemplate.senderId"
              :items="senders"
              :item-text="(item) => item.name + ' <+' + item.phone + '> '"
              item-value="id"
              label="Remitente"
              :rules="senderRules"
              outlined
              required
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  Aqui texto de ayuda
                </div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col sm="12" md="4" class="d-flex align-start">
            <v-select
              v-model="newTemplate.categoryId"
              :items="categoriesItems"
              :rules="categoriesRules"
              item-text="name"
              item-value="id"
              label="Categoría"
              placeholder="Ingresar categoría"
              outlined
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  Aqui texto de ayuda
                </div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col sm="12" md="4" class="d-flex align-start">
            <v-select
              v-model="newTemplate.languageId"
              :items="languages"
              :item-text="(item) => item.name + ' (' + item.abrev + ') '"
              item-value="id"
              label="Idioma"
              :rules="languageRules"
              outlined
              required
            />
            <v-tooltip right color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  Aqui texto de ayuda
                </div>
              </div>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="mt-2"> Tipo plantilla </P>
            <v-radio-group
              v-model="newTemplate.templateType"
              row
              @change="changeTemplateType()"
            >
              <v-radio label="Solo texto" value="1" />
              <v-radio label="Texto y media" value="2" />
            </v-radio-group>
          </v-col>
        </v-row>
        <div v-if="newTemplate.templateType === '2'">
          <message-sections
            v-model="valueSelection"
            @btn-section-change="changeTemplateType()"
          />
        </div>
        <v-expand-transition>
          <div v-if="activateHeader">
            <P class="mt-2 mb-0 font-weight-bold"> Header </P>
            <P class="mt-2 mb-0"> Selecciona categoría </P>
            <v-radio-group v-model="selectCategory" row>
              <v-radio label="Texto" value="text" />
              <v-radio label="Imágen" value="image" />
              <v-radio label="Pdf" value="pdf" />
              <v-radio label="Video" value="video" />
            </v-radio-group>
            <v-expand-transition>
              <div v-if="selectCategory === 'text'">
                <v-row no-gutters>
                  <v-col sm="12" md="6">
                    <rich-text-area
                      v-model="headerTextOnly"
                      class="mb-0"
                      @add-var="addVariableToHeader()"
                      @action-blur="deleteExtraVars()"
                    />
                    <div class="position-relative">
                      <div class="text-caption position-absolute">
                        Máximo 60 caracteres
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div v-if="selectCategory === 'image'">
                <v-col cols="4">
                  <v-file-input
                    v-model="fileInput"
                    accept="image/*"
                    label="Seleccionar imagen..."
                  />
                </v-col>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div v-if="selectCategory === 'pdf'">
                <v-col cols="4">
                  <v-file-input
                    v-model="fileInput"
                    accept=".pdf"
                    label="Seleccionar pdf..."
                  />
                </v-col>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div v-if="selectCategory === 'video'">
                <v-col cols="4">
                  <v-file-input
                    v-model="fileInput"
                    accept="video/*"
                    label="Seleccionar video..."
                  />
                </v-col>
              </div>
            </v-expand-transition>
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="activateBody">
            <P
              v-if="newTemplate.templateType === '2'"
              class="my-4 font-weight-bold"
            >
              Body
            </P>
            <v-row no-gutters>
              <v-col sm="12" md="6">
                <rich-text-area
                  v-model="bodyTextOnly"
                  class="mb-0"
                  @add-var="addVariableToBody()"
                />
                <div class="position-relative">
                  <div class="text-caption position-absolute">
                    Máximo 1024 caracteres
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="activateFooter">
            <P class="mt-2 font-weight-bold"> Footer </P>
            <v-row no-gutters>
              <v-col sm="12" md="6">
                <rich-text-area v-model="footerTextOnly" class="mb-0" />
                <div class="position-relative">
                  <div class="text-caption position-absolute">
                    Máximo 60 caracteres
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        <v-expand-transition>
          <div v-if="activateBotones">
            <P class="mt-2 mb-0 font-weight-bold"> Botones </P>
            <v-btn
              color="primary"
              text
              class="pl-0"
              @click="addButtonDialog = true"
            >
              <v-icon color="primary" class="mr-2">
                mdi-plus-circle-outline
              </v-icon>
              CREAR BOTÓN
            </v-btn>
            <div
              v-if="newTemplate.button.length !== 0"
              class="d-flex flex-lg-wrap"
            >
              <v-chip
                v-for="item in newTemplate.button"
                :key="item.id"
                class="ma-2"
                close
                color="green"
                outlined
                @click:close="deleteButton(item)"
              >
                <v-text-field
                  v-if="item.edit"
                  v-model="item.parameters.text"
                  maxlength="20"
                  @change="editButton(item)"
                />
                <div v-else>{{ item.parameters.text }}</div>
                <v-tooltip right bottom color="green">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      left
                      class="ml-6"
                      v-bind="attrs"
                      v-on="on"
                      @click="editButton(item)"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <div>
                    <div class="white--text font-weight-bold">Editar botón</div>
                  </div>
                </v-tooltip>
              </v-chip>
            </div>
            <div v-if="newTemplate.button.length !== 0" class="text-caption">
              Máximo 20 caracteres por cada botón.
            </div>
          </div>
        </v-expand-transition>
        <div class="d-flex align-start mt-6">
          <v-btn
            color="primary"
            outlined
            @click="$router.push({ name: 'TemplatesSettings' })"
          >
            CANCELAR
          </v-btn>
          <v-btn
            :disabled="!templateValidation"
            class="ml-4"
            color="primary"
            @click="AddCreateTemplate()"
          >
            GUARDAR
          </v-btn>
        </div>
      </v-form>
    </v-col>
    <v-col v-if="!skeletonLoader && isSent">
      <v-row class="text-left">
        <v-col cols="5">
          <v-card
            class="d-flex justify-start align-center"
            outlined
            flat
            height="5vh"
          >
            <v-card-text>
              <v-icon
                class="pb-1 pr-4"
                :color="responseStatus ? 'success' : 'error'"
              >
                mdi-check-bold
              </v-icon>
              <span class="text-h6 accent--text">
                {{
                  newTemplate.id
                    ? `Se ha modificado con éxito la plantilla "${newTemplate.name}".`
                    : 'Se ha creado con éxito la plantilla. Puedes revisar cuando esté validada en listado de plantillas.'
                }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="text-h6 accent--text" cols="12">
          Resumen de plantilla
        </v-col>
        <v-col cols="2">
          {{ newTemplate.id ? 'Fecha modificación:' : 'Fecha creación:' }}
        </v-col>
        <v-col class="accent--text" cols="10">
          {{
            newTemplate.id
              ? `${responseObject.dateUpdated}`
              : `${responseObject.createdAt}`
          }}
        </v-col>
        <!--  -->
        <v-col cols="2"> Nombre campaña: </v-col>
        <v-col class="accent--text" cols="10">
          {{ newTemplate.name }}
        </v-col>
        <v-col class="accent--text" cols="2"> Remitente: </v-col>
        <v-col class="accent--text" cols="10">
          <span>
            {{ `${senderAux.name}` + ' &lt;' + '+' + senderAux.phone + '>' }}
          </span>
        </v-col>
        <v-col class="accent--text" cols="2"> Categoría: </v-col>
        <v-col class="accent--text" cols="10">
          {{ categoryAux.name }}
        </v-col>
        <v-col cols="2" class="accent--text"> Idioma: </v-col>
        <v-col cols="10" class="accent--text">
          {{ `${languageAux.name} (${languageAux.abrev})` }}
        </v-col>
      </v-row>
      <v-row class="mt-15">
        <v-card width="50%" flat outlined>
          <preview-official-template
            :template="newTemplate"
            selection-preview
          />
        </v-card>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="2">
          <v-btn
            outlined
            color="primary"
            @click="$router.push({ name: 'TemplatesSettings' })"
          >
            IR A LISTADO
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="addButtonDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="buttonAux.subType"
                :items="buttonSubtypesItems"
                item-text="label"
                item-value="value"
                label="Tipo"
              >
                <template v-slot:append-outer>
                  <v-tooltip right color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="pl-2"
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <div>
                      <div
                        class="pb-2 justify-center white--text font-weight-bold"
                      >
                        Llamada a la acción: crea hasta dos botones para que tus
                        clientes puedan realizar una acción. Las dos opciones
                        son Llamar al número de teléfono e Ir al sitio web. Esto
                        te permite agregar números de teléfono o URL de sitios
                        web al mensaje. Si eliges la opción Ir al sitio web,
                        puedes elegir una URL estática (fija) o dinámica, la
                        cual incluye una variable al final que permite crear un
                        enlace personalizado para que el cliente acceda a
                        contenido específico dentro de tu sitio web. Respuesta
                        rápida: crea hasta tres botones que tus clientes pueden
                        usar para responder a tu mensaje.
                      </div>
                    </div>
                  </v-tooltip>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="buttonAux.subType === 'quick_reply'">
            <v-col cols="12">
              <v-text-field
                v-model="buttonAux.parameters.payload"
                label="Payload"
              />
            </v-col>
          </v-row>
          <v-row v-if="buttonAux.subType === 'url'">
            <v-col cols="12">
              <v-text-field v-model="buttonAux.parameters.text" label="Text" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="addButtonDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="addButton()">
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewTemplateDialog" width="800">
      <v-card>
        <div>
          <preview-official-template
            v-if="viewTemplateDialog"
            :template="newTemplate"
          />
        </div>
        <v-card-actions class="d-flex justify-center py-6">
          <v-btn
            class="px-6"
            color="primary"
            @click="viewTemplateDialog = !viewTemplateDialog"
          >
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import filesMixin from '@/mixins/util/filesMixin'
import stringsMixin from '@/mixins/util/stringsMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import MessageSections from '@/components/modules/whatsapp/settings/MessageSections.vue'
import RichTextArea from '@/components/util/RickTextArea.vue'
import PreviewOfficialTemplate from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplate.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateTemplates',
  components: { MessageSections, RichTextArea, PreviewOfficialTemplate },
  mixins: [
    validationMixin,
    whatsappBffMixin,
    filesMixin,
    stringsMixin,
    templateBffMixin,
  ],
  data() {
    return {
      headerVarsCount: 1,
      viewTemplateDialog: false,
      skeletonLoader: true,
      bodyVarsCount: 1,
      senders: [],
      fileInput: null,
      templateValidation: false,
      selectCategory: 'text',
      responseObject: null,
      responseStatus: false,
      isSent: false,
      idButton: 1,
      templateId: '',
      languages: [],
      buttonAux: {
        subType: '',
        parameters: {},
      },
      buttonSubtypesItems: [
        {
          label: 'Respuesta rápida',
          value: 'quick_reply',
        },
        {
          label: 'Llamada a la acción',
          value: 'url',
        },
      ],
      addButtonDialog: false,
      newTemplate: {
        id: null,
        templateType: '1',
        description: '',
        categoryId: '',
        senderId: '',
        languageId: '',
        name: '',
        header: {
          content: '',
          category_type: '',
          file: {
            fileBase64: null,
            contentType: '',
            fileName: '',
            extension: '',
          },
        },
        body: '',
        footer: '',
        button: [],
      },
      valueSelection: {
        mediumTextSelection: [1],
      },
      subjectEmo: {
        label: 'Asunto',
        placeholder: 'Ingresar body',
        textValue: '',
        rows: '4',
        autoGrow: true,
      },
      categoriesItems: [],
      templateType: '1',
      headerTextOnly: {
        id: 'headerTextArea',
        label: 'Ingresar header',
        placeholder: 'Ingresar header',
        textValue: '',
        rows: '2',
        autoGrow: true,
        addVars: true,
      },
      bodyTextOnly: {
        id: 'bodyTextArea',
        label: 'Ingresar body',
        placeholder: 'Ingresar body',
        textValue: '',
        rows: '4',
        autoGrow: true,
        addVars: true,
      },
      footerTextOnly: {
        id: 'footerTextArea',
        label: 'Ingresar footer',
        placeholder: 'Ingresar footer',
        textValue: '',
        rows: '2',
        autoGrow: true,
        addVars: false,
      },
      senderAux: {},
      categoryAux: {},
      languageAux: {},
      activateBody: true,
      activateHeader: false,
      activateFooter: false,
      activateBotones: false,
    }
  },

  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
    categoriesRules() {
      return [(v) => this.isRequired(v, 'Categoría')]
    },
    senderRules() {
      return [(v) => this.isRequired(v, 'Remitente')]
    },
    descriptionRules() {
      return [(v) => this.isRequired(v, 'Descripción')]
    },
    languageRules() {
      return [(v) => this.isRequired(v, 'Idioma')]
    },
  },
  watch: {
    'bodyTextOnly.textValue': {
      handler(value) {
        this.newTemplate.body = value
      },
    },
    'footerTextOnly.textValue': {
      handler(value) {
        this.newTemplate.footer = value
      },
    },
    'headerTextOnly.textValue': {
      handler(value) {
        this.newTemplate.header.content = value
      },
    },
  },
  async created() {
    this.templateId = await this.$route.params.id
    await this.getSenders()
    await this.getCategories()
    await this.getLanguages()
    this.skeletonLoader = false
    if (this.templateId && this.templateId !== '') {
      const tempAux = await this.getTemplate(this.templateId)
      this.newTemplate.id = tempAux.id
      this.newTemplate.templateType = tempAux.templateType
      this.newTemplate.description = tempAux.description
      this.newTemplate.categoryId = tempAux.category.id
      this.newTemplate.senderId = tempAux.sender.id
      this.newTemplate.languageId = tempAux.languages.id
      this.newTemplate.name = tempAux.name
      this.newTemplate.header = tempAux.header
      this.newTemplate.body = tempAux.body
      this.newTemplate.footer = tempAux.footer
      this.newTemplate.button = tempAux.button
      this.selectCategory = tempAux.header.category_type
      this.senderAux = tempAux.sender
      this.categoryAux = tempAux.category
      this.languageAux = tempAux.languages
      if (tempAux.header.category_type === 'text') {
        this.newTemplate.templateType = '2'
        this.changeTemplateType()
        this.activateHeader = true
        this.headerTextOnly.textValue = tempAux.header.content
        this.valueSelection.mediumTextSelection.push(0)
      } else if (tempAux.header.category_type === 'image') {
        this.newTemplate.templateType = '2'
        this.activateHeader = true
        this.valueSelection.mediumTextSelection.push(0)
        this.selectCategory = tempAux.header.category_type
      } else if (tempAux.header.category_type === 'pdf') {
        this.newTemplate.templateType = '2'
        this.activateHeader = true
        this.valueSelection.mediumTextSelection.push(0)
        this.selectCategory = tempAux.header.category_type
      } else if (tempAux.header.category_type === 'video') {
        this.newTemplate.templateType = '2'
        this.activateHeader = true
        this.valueSelection.mediumTextSelection.push(0)
        this.selectCategory = tempAux.header.category_type
      }
      if (tempAux.footer !== '') {
        this.newTemplate.templateType = '2'
        this.activateFooter = true
        this.footerTextOnly.textValue = tempAux.footer
        this.valueSelection.mediumTextSelection.push(2)
      }
      this.bodyTextOnly.textValue = tempAux.body
    }
  },
  methods: {
    async getSenders() {
      const filterService = {
        clientId: this.clientId,
        statusList: [1, 2],
        page: -1,
      }

      const senderObject = await this.getSendersByClient(filterService)
      this.senders = await senderObject.dataList
    },
    async getCategories() {
      this.categoriesItems = await this.getTemplateCategories()
    },
    async getLanguages() {
      this.languages = await this.getTemplateLanguages()
    },
    addVariableToBody() {
      const varList = this.getVariablesBetweenBrackets(
        this.bodyTextOnly.textValue
      )
      if (varList.length > 0)
        this.bodyVarsCount = parseInt(varList[varList.length - 1], 10) + 1
      else this.bodyVarsCount = 1
      this.bodyTextOnly.textValue += `{{${this.bodyVarsCount}}}`
    },
    deleteExtraVars() {
      const varList = this.getVariablesBetweenBrackets(
        this.headerTextOnly.textValue
      )
      if (varList.length > 1) {
        this.headerTextOnly.textValue = this.deleteVariablesFromString(
          this.headerTextOnly.textValue
        )
        this.headerVarsCount = 1
        this.headerTextOnly.textValue += `{{${this.headerVarsCount}}}`
      }
    },
    addVariableToHeader() {
      const varList = this.getVariablesBetweenBrackets(
        this.headerTextOnly.textValue
      )
      if (varList.length === 0 && this.headerVarsCount === 1)
        this.headerTextOnly.textValue += `{{${this.headerVarsCount}}}`
      else if (varList.length === 0 && this.headerVarsCount !== 1) {
        this.headerVarsCount = 1
        this.headerTextOnly.textValue += `{{${this.headerVarsCount}}}`
      }
    },
    addButton() {
      if (this.idButton < 4) {
        if (this.buttonAux.subType === 'quick_reply') {
          const item = {
            index: this.idButton,
            type: 'button',
            subtype: this.buttonAux.subType,
            parameters: {
              type: 'payload',
              payload: this.buttonAux.parameters.payload,
              text: `Botón ${this.idButton}`,
            },
            edit: false,
          }
          this.newTemplate.button.push(item)
        } else if (this.buttonAux.subType === 'url') {
          const item = {
            index: this.idButton,
            type: 'button',
            subtype: this.buttonAux.subType,
            parameters: {
              type: 'text',
              payload: this.buttonAux.parameters.text,
              text: `Botón ${this.idButton}`,
            },
            edit: false,
          }
          this.newTemplate.button.push(item)
        }
        this.idButton += 1
        this.addButtonDialog = false
      }
    },
    deleteButton(item) {
      this.newTemplate.button = this.newTemplate.button.filter(
        (e) => e.id !== item.id
      )
    },
    editButton(item) {
      if (item.edit) {
        item.edit = false
      } else {
        item.edit = true
      }
    },
    async AddCreateTemplate() {
      if (this.fileInput) {
        const fileBase64 = await this.fileToBase64(this.fileInput)
        this.newTemplate.header.file.fileBase64 = fileBase64
        this.newTemplate.header.file.fileName = this.fileInput.name
        this.newTemplate.header.file.contentType = this.fileInput.type
        this.newTemplate.header.file.extension = this.getFileExtension(
          this.fileInput
        )
      } else {
        this.newTemplate.header.file = null
      }
      if (this.newTemplate.templateType === '1') {
        this.newTemplate.header = null
      } else {
        this.newTemplate.header.category_type = this.selectCategory
      }
      this.responseObject = await this.createTemplate(this.newTemplate)
      await this.getSenderAux()
      await this.getCategoryAux()
      await this.getLanguageAux()
      if (this.responseObject) this.responseStatus = true
      this.isSent = true
    },
    changeTemplateType() {
      this.activateBody = false
      this.activateHeader = false
      this.activateFooter = false
      this.activateBotones = false
      if (this.newTemplate.templateType === '2') {
        this.valueSelection.mediumTextSelection.forEach((item) => {
          if (item === 1) {
            this.activateBody = true
          } else if (item === 0) {
            this.activateHeader = true
          } else if (item === 2) {
            this.activateFooter = true
          } else if (item === 3) {
            this.activateBotones = true
          }
        })
      } else {
        this.mediumTextSelection = [1]
        this.activateBody = true
      }
    },
    async getSenderAux() {
      const result = await this.senders.filter(
        (sender) => sender.id === this.newTemplate.senderId
      )
      // eslint-disable-next-line prefer-destructuring
      this.senderAux = result[0]
    },
    async getCategoryAux() {
      const result = await this.categoriesItems.filter(
        (category) => category.id === this.newTemplate.categoryId
      )
      // eslint-disable-next-line prefer-destructuring
      this.categoryAux = result[0]
    },
    async getLanguageAux() {
      const result = await this.languages.filter(
        (language) => language.id === this.newTemplate.languageId
      )
      // eslint-disable-next-line prefer-destructuring
      this.languageAux = result[0]
    },
  },
}
</script>
<style scoped>
.active {
  background-color: var(--v-greencheck-base);
  color: white;
}
.position-relative {
  position: relative;
}
.position-relative .position-absolute {
  position: absolute;
  bottom: 0;
  right: 0;
}
.sin-linea {
  border: none;
}
</style>
