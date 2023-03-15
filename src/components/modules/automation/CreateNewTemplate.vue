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
            <v-btn text color="primary" @click="$emit('change-model', false)">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              VOLVER
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-toolbar-title class="primary--text">
            PREVISUALIZAR
            <v-btn icon color="primary" @click="previsualizacion('cell')">
              <v-icon>mdi-cellphone</v-icon>
            </v-btn>
            <v-btn icon color="primary" @click="previsualizacion('pc')">
              <v-icon>mdi-laptop</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <v-btn color="primary" @click="$emit('save-template')">
              guardar y continuar
            </v-btn>
          </div>
        </v-toolbar>
        <div class="all-screen">
          <v-container class="pt-10">
            <v-row no-gutters justify="end" class="align-center">
              <div class="d-flex align-center">
                <v-switch
                  v-model="selectedActivity.config.template.generateTemplate"
                  class="mr-1"
                  @change="SaveAsTemplate()"
                />
                <div
                  class="primary--text"
                  style="font-size: 0.875rem; font-weight: 500"
                >
                  GUARDAR COMO PLANTILLA
                </div>
              </div>
              <v-btn text color="primary" @click="insertVariables()">
                AGREGAR VARIABLE
                <v-icon right>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-btn-toggle v-model="editorToShow">
                <v-btn value="html">
                  <v-icon left> mdi-code-tags </v-icon>
                  <span class="hidden-sm-and-down">HTML</span>
                </v-btn>
                <v-btn value="text">
                  <v-icon left> mdi-text-long </v-icon>
                  <span class="hidden-text-long">Texto</span>
                </v-btn>
              </v-btn-toggle>
            </v-row>
            <div v-if="editorToShow === 'html'" class="mt-6">
              <vue2-tinymce-editor
                v-model="selectedActivity.config.template.localContent"
                :options="options"
              />
            </div>
            <v-card v-else outlined class="mt-6 overflow-y-auto max-h">
              <v-card-text>
                <prism-editor
                  v-model="selectedActivity.config.template.localContent"
                  line-numbers
                  :highlight="highlighter"
                />
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="previewDialog" scrollable :width="widthDialog">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Previsualización
        </v-card-title>
        <v-card-text style="height: 500px">
          <span v-html="selectedActivity.config.template.localContent"></span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="previewDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="templateNameDialog" persistent max-width="500">
      <v-card>
        <header-dialog
          header-title="Guardar como plantilla"
          @btn-close-action="templateNameDialog = false"
        />
        <v-card-text>
          <v-text-field
            v-model="selectedActivity.config.template.name"
            label="Nombre"
            outlined
            dense
            class="mt-10"
          />
          <v-textarea
            v-model="selectedActivity.config.template.description"
            outlined
            label="Descripción"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <footer-dialog
            :valid="selectedActivity.config.template.name === '' ? false : true"
            button-label="Registrar"
            @btn-close-action="templateNameDialog = false"
            @btn-active-action="templateNameDialog = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Vue2TinymceEditor } from 'vue2-tinymce-editor'
import { PrismEditor } from 'vue-prism-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/prismeditor.min.css'
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import FooterDialog from '@/components/util/FooterDialog.vue'
import automationBffMixin from '@/mixins/services/automationBffMixin'

export default {
  name: 'CreateNewTemplate',
  components: { PrismEditor, Vue2TinymceEditor, HeaderDialog, FooterDialog },
  mixins: [automationBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: String,
      default: '',
    },
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editorToShow: 'text',
      templateNameDialog: false,
      templateNameDialogEnd: false,
      previewDialog: false,
      widthDialog: 1200,
      variableNumber: 0,
      options: {
        language: 'es',
        height: 'calc(100vh - 220px)',
      },
    }
  },
  created() {
    if (this.selectedActivity.config.template.localContent === '') {
      this.selectedActivity.config.template.localContent =
        '<h1>Comienza a editar aquí...</h1>'
    }
  },
  methods: {
    previsualizacion(type) {
      if (type === 'pc') {
        this.widthDialog = 1200
      } else {
        this.widthDialog = 390
      }
      this.previewDialog = true
    },
    highlighter(code) {
      return highlight(code, languages.html)
    },
    insertVariables() {
      this.variableNumber += 1
      const text = `<span>{{${this.variableNumber}}}</span>`
      this.localContentEditor += text
    },
    SaveAsTemplate() {
      if (this.selectedActivity.config.template.generateTemplate) {
        if (this.selectedActivity.config.template.name === '') {
          this.templateNameDialog = true
        }
      }
    },
  },
}
</script>

<style scoped>
.all-screen {
  width: 100%;
  height: calc(100vh - 64px) !important;
}
.tox-tinymce {
  height: calc(100vh - 64px) !important;
}
.max-h {
  height: calc(100vh - 220px) !important;
}
</style>
