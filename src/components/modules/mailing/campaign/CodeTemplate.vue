<template>
  <div class="mt-8">
    <div class="mb-4">
      Codifica, copia y pega o importa un archivo html con nuestro editor.
    </div>
    <v-btn @click="openEditor('html')">
      Codificar o importar HTML
      <v-icon class="ml-2">mdi-code-tags</v-icon>
    </v-btn>
    <v-btn @click="openEditor('dragAndDrop')">
      Editor Drag And Drop
      <v-icon class="ml-2">mdi-drag-variant</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
          <v-btn text color="primary" @click="closeEditor()">
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            Volver a creación de campaña
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">
            Previsualizar
            <v-icon class="mx-2">mdi-cellphone-link</v-icon>
          </v-btn>
          <v-btn outlined color="primary" class="mx-4" @click="dialog = false">
            Enviar prueba
            <v-icon class="ml-2">mdi-send</v-icon>
          </v-btn>
          <v-btn
            v-if="editorToShow === 'html'"
            text
            color="primary"
            @click="openHtmlImporter()"
          >
            Importar HTML
            <v-icon class="ml-2">mdi-file-code</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" class="mr-6" @click="saveTemplate()">
            <v-icon>mdi-content-save</v-icon> Guardar
          </v-btn>
          <v-btn color="primary" @click="closeEditor()"> Continuar </v-btn>
        </v-toolbar>
        <v-container fluid mt-0 pa-0>
          <v-container mt-0>
            <v-row class="mb-4" align="center" justify="space-between">
              <v-col cols="12" class="pa-0">
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    v-model="campaignSubjectEdit"
                    class="text-subtitle-1"
                    :label="campaignSubjectEdit === '' ? 'Ingresar asunto' : ''"
                  >
                    <span slot="prepend" class="font-weight-bold pt-2">
                      Asunto:
                    </span>
                    <v-menu
                      slot="prepend-inner"
                      bottom
                      left
                      offset-y
                      offset-x
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="primary" v-bind="attrs" v-on="on">
                          <v-icon>mdi-emoticon-happy-outline</v-icon>
                        </v-btn>
                      </template>
                      <VEmojiPicker @select="selectEmoji" />
                    </v-menu>
                    <add-variable-button
                      slot="append"
                      v-model="campaignSubjectEdit"
                      :headers="selectedHeaders"
                      :disabled="selectedHeaders.length < 1"
                    />
                  </v-text-field>
                </v-col>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    v-model="campaignDescentEdit"
                    class="text-subtitle-2"
                    :label="campaignDescentEdit === '' ? 'Ingresar bajada' : ''"
                  >
                    <span slot="prepend" class="font-weight-light pt-2">
                      Bajada:
                    </span>
                    <add-variable-button
                      slot="append"
                      v-model="campaignDescentEdit"
                      :headers="selectedHeaders"
                      :disabled="selectedHeaders.length < 1"
                    />
                  </v-text-field>
                </v-col>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row class="mb-4" align="center" justify="space-between">
              <v-col cols="4">
                <v-text-field
                  v-model="campaignNameEdit"
                  class="text-h5"
                  label="Nombre plantilla"
                />
              </v-col>
              <v-col cols="auto">
                <v-select
                  outlined
                  hide-details
                  style="max-width: 250px"
                  :items="items"
                />
              </v-col>
            </v-row>
            <v-row justify="end" class="mb-12">
              <div v-if="editorToShow === 'html'" class="mb-4">
                <v-btn
                  color="accent"
                  class="rounded-r-0"
                  style="border: 1px solid"
                  :outlined="!showHtml"
                  :disabled="showHtml"
                  @click="showHtml = true"
                >
                  <v-icon class="mr-1"> mdi-code-tags </v-icon>
                  HTML
                </v-btn>
                <v-btn
                  color="accent"
                  class="rounded-l-0"
                  style="border: 1px solid"
                  :outlined="showHtml"
                  :disabled="!showHtml"
                  @click="showHtml = false"
                >
                  <v-icon class="mr-1"> mdi-format-textbox </v-icon>
                  Texto
                </v-btn>
              </div>
              <div v-else-if="editorToShow === 'dragAndDrop'" class="mb-4">
                <v-btn text color="primary" @click="exportHtml()">
                  Exportar HTML
                  <v-icon class="ml-2">mdi-file-export</v-icon>
                </v-btn>
              </div>
              <html-editor
                v-if="editorToShow === 'html'"
                v-model="content"
                :show-html="showHtml"
                style="width: 100%"
              />
              <drag-and-drop-editor
                v-else-if="editorToShow === 'dragAndDrop'"
                ref="dragAndDropEditor"
                style="width: 100%"
                @get-html="getHtml"
              />
            </v-row>
          </v-container>
        </v-container>
      </v-card>
    </v-dialog>
    <v-file-input
      id="htmlImporter"
      v-model="htmlImported"
      class="d-none"
      accept=".html"
      @change="importHtml()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HtmlEditor from '@/components/util/HtmlEditor.vue'
import DragAndDropEditor from '@/components/util/DragAndDropEditor.vue'
import { VEmojiPicker } from 'v-emoji-picker'
import AddVariableButton from '@/components/util/AddVariableButton.vue'
import mailingBffMixin from '@/mixins/services/mailingBffMixin'

export default {
  name: 'CodeTemplate',
  components: {
    HtmlEditor,
    DragAndDropEditor,
    VEmojiPicker,
    AddVariableButton,
  },
  mixins: [mailingBffMixin],
  props: {
    campaignName: {
      type: String,
      default: '',
    },
    campaignSubject: {
      type: String,
      default: '',
    },
    campaignDescent: {
      type: String,
      default: '',
    },
    selectedHeaders: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      campaignNameEdit: this.campaignName,
      campaignSubjectEdit: this.campaignSubject,
      campaignDescentEdit: this.campaignDescent,
      dialog: false,
      showHtml: true,
      htmlImported: null,
      editorToShow: 'html',
      dragAndDropAction: 'export',
      content: '<h1>Comienza a editar aquí...</h1>',
      items: ['Versión 1', 'Versión 2', 'Versión 3'],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {
    selectEmoji(emoji) {
      this.campaignSubjectEdit += emoji.data
    },
    openEditor(editorToShow) {
      this.editorToShow = editorToShow
      this.dialog = true
    },
    closeEditor() {
      this.editorToShow = 'html'
      this.dialog = false
      this.content = '<h1>Comienza a editar aquí...</h1>'
    },
    openHtmlImporter() {
      document.getElementById('htmlImporter').click()
    },
    importHtml() {
      if (this.htmlImported) {
        const reader = new FileReader()
        reader.readAsText(this.htmlImported)
        reader.onload = (res) => {
          this.content = res.target.result
        }
        reader.onerror = (err) => {
          console.log(err)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al importar archivo HTML, por favor revise que el archivo sea el correcto y vuelva a intentarlo.',
          })
        }
      }
      this.htmlImported = null
      document.getElementById('htmlImporter').value = null
    },
    getHtml(content) {
      this.content = content
      if (this.dragAndDropAction === 'export') {
        this.downloadFile('plantilla.html', content)
      } else if (this.dragAndDropAction === 'save') {
        this.createTemplate()
      }
    },
    exportHtml() {
      this.dragAndDropAction = 'export'
      this.$refs.dragAndDropEditor.getHtml()
    },
    saveTemplate() {
      if (this.editorToShow === 'dragAndDrop') {
        this.dragAndDropAction = 'save'
        this.$refs.dragAndDropEditor.getHtml()
      } else {
        this.createTemplate()
      }
    },
    createTemplate() {
      const templateToCreate = {
        name: 'Plantilla test',
        subject: 'Asunto test',
        content: this.content,
        version: 'Version 1',
        text_preview: 'previsualizacion test',
        base_template: '',
        client_id: this.clientId,
      }
      this.createMailingTemplate(templateToCreate)
    },
    downloadFile(filename, text) {
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
      )
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
  },
}
</script>
