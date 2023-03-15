<template>
  <div>
    <v-card outlined class="mt-6 mx-2 overflow-y-auto max-h">
      <v-card-text>
        <prism-editor
          v-model="htmlSelection.code"
          line-numbers
          :highlight="highlighter"
          class="my-editor"
        />
      </v-card-text>
    </v-card>
    <div class="text-right">
      <v-btn icon color="primary" @click="editDialog = !editDialog">
        <v-icon>mdi-arrow-expand-all</v-icon>
      </v-btn>
    </div>
    <v-divider class="mt-2"></v-divider>
    <div class="pl-4 pt-4 font-weight-medium gray300--text">
      HTML solo experto
    </div>
    <div class="px-4 mt-2 caption darkgray--text">
      El uso de su propio código puede afectar la forma en que se representa el
      mensaje. Asegúrese de usar HTML correcto y receptivo.
    </div>
    <v-dialog v-model="editDialog" persistent width="800">
      <v-card max-height="700">
        <v-card-title class="text-h5 grey lighten-2"> Edite HTML </v-card-title>
        <div>
          <v-card-text class="mt-2">
            <prism-editor
              v-model="htmlSelection.code"
              line-numbers
              :highlight="highlighter"
              style="max-height: 392px"
              class="overflow-y-auto"
            />
          </v-card-text>
        </div>
        <v-divider class="mt-2"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="editDialog = !editDialog">
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-prism-editor/dist/prismeditor.min.css'

export default {
  name: 'HtmlSetting',
  components: { PrismEditor },
  props: {
    htmlSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editDialog: false,
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.html)
    },
  },
}
</script>
<style scoped>
.my-editor {
  font-size: 12px;
  line-height: 1;
  max-height: 250px;
  overflow-y: auto;
}
</style>
