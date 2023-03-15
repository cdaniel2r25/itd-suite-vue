<template>
  <div>
    <div class="pl-4 pt-4 caption font-weight-medium">Opciones de párrafo</div>
    <div class="pl-4 pt-2 caption">Contenido</div>
    <div class="px-4 mt-2">
      <vue2-tinymce-editor
        v-model="paragraphSelection.paragraph.content"
        :options="options"
      />
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="px-4 mt-2 d-flex justify-space-between align-center">
      <div class="caption">Familia de fuentes</div>
      <div class="pa-1" style="width: 200px">
        <v-select
          v-model="paragraphSelection.paragraph.style.fontFamily"
          dense
          :items="listfont"
          outlined
          hide-details
          class="caption"
        />
      </div>
    </div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Tamaño de fuente</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeFontSize('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ paragraphSelection.paragraph.style.fontSize }}
          </div>
          <v-btn @click="changeFontSize('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Altura de la línea</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeLineHeight('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ paragraphSelection.paragraph.style.lineHeight }}
          </div>
          <v-btn @click="changeLineHeight('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Espaciado de letras</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeLetterSpacing('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ paragraphSelection.paragraph.style.letterSpacing }}
          </div>
          <v-btn @click="changeLetterSpacing('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 caption pt-1 pb-3">Márgenes</div>
    <div class="px-4 pb-6">
      <div class="d-flex justify-space-between pr-2">
        <div class="py-0" style="width: 170px">
          <div class="caption">Superior</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('top', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ paragraphSelection.style.paddingTop }}
            </div>
            <v-btn @click="changePadding('top', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="py-0" style="width: 170px">
          <div class="caption">Derecha</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('right', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ paragraphSelection.style.paddingRight }}
            </div>
            <v-btn @click="changePadding('right', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div class="d-flex justify-space-between pr-2">
        <div class="py-0 pt-1" style="width: 170px">
          <div class="caption">Inferior</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('bottom', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ paragraphSelection.style.paddingBottom }}
            </div>
            <v-btn @click="changePadding('bottom', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="py-0 pt-1" style="width: 170px">
          <div class="caption">Izquierda</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('left', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ paragraphSelection.style.paddingLeft }}
            </div>
            <v-btn @click="changePadding('left', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue2TinymceEditor } from 'vue2-tinymce-editor'

export default {
  name: 'ParagraphSetting',
  components: { Vue2TinymceEditor },
  props: {
    paragraphSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      colorText: false,
      options: {
        menubar: false,
        plugins: [
          'link',
          'lists',
          'powerpaste',
          'autolink',
          'tinymcespellchecker',
          'code',
        ],
        toolbar: [
          'undo redo | bold italic underline | forecolor backcolor code',
          'superscript subscript | alignleft aligncenter alignright alignjustify alignfull outdent indent | link unlink numlist bullist',
        ],
        valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
        valid_styles: {
          '*': 'font-size,font-family,color,text-decoration,text-align',
        },
        content_style:
          'body { font-family:Arial,Helvetica,sans-serif; font-size:14px }',
      },
      listfont: [
        { text: 'Fuente global', value: 'inherit' },
        { text: 'Arial', value: "Arial,'Helvetica Neue',Helvetica,sans-serif" },
        {
          text: 'Courier New',
          value:
            "'Courier New',Courier,'Lucida Sans Typewriter','Lucida Typewriter',monospace",
        },
        { text: 'Georgia', value: "Georgia,Times,'Times New Roman',serif" },
        {
          text: 'Helvetica Neue',
          value: "'Helvetica Neue',Helvetica,Arial,sans-serif",
        },
        {
          text: 'Lucida Sans Unicode',
          value:
            "'Lucida Sans Unicode','Lucida Grande','Lucida Sans',Geneva,Verdana,sans-serif",
        },
        { text: 'Tahoma', value: 'Tahoma,Verdana,Segoe,sans-serif' },
        {
          text: 'Times New Roman',
          value:
            "TimesNewRoman,'Times New Roman',Times,Beskerville,Georgia,serif",
        },
        {
          text: 'Trebuchet MS',
          value:
            "'Trebuchet MS','Lucida Grande','Lucida Sans Unicode','Lucida Sans',Tahoma,sans-serif",
        },
      ],
    }
  },
  methods: {
    swatchStyle(color) {
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        borderRadius: '4px',
        border: '2px solid gray',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
    changeFontSize(type) {
      let valor = parseInt(
        this.paragraphSelection.paragraph.style.fontSize.replace('px', ''),
        10
      )
      if (type === 'mas') {
        valor += 1
      } else if (valor !== 10) {
        valor -= 1
      }
      this.paragraphSelection.paragraph.style.fontSize = `${valor.toString()}px`
    },
    changeLineHeight(type) {
      let valor = parseFloat(this.paragraphSelection.paragraph.style.lineHeight)
      if (type === 'mas') {
        if (valor !== 3) {
          valor += 0.5
        }
      } else if (valor !== 1) {
        valor -= 0.5
      }
      this.paragraphSelection.paragraph.style.lineHeight = valor.toString()
    },
    changeLetterSpacing(type) {
      let valor = parseInt(
        this.paragraphSelection.paragraph.style.letterSpacing.replace('px', ''),
        10
      )
      if (type === 'mas') {
        valor += 1
      } else if (valor !== 0) {
        valor -= 1
      }
      this.paragraphSelection.paragraph.style.letterSpacing = `${valor.toString()}px`
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.paragraphSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.paragraphSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.paragraphSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.paragraphSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.paragraphSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.paragraphSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.paragraphSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.paragraphSelection.style.paddingLeft = `${valor.toString()}px`
      }
    },
  },
}
</script>
<style scoped>
.input-padding {
  border-top-style: solid;
  border-top-width: thin;
  border-top-color: rgba(0, 0, 0, 0.12);
  border-bottom-style: solid;
  border-bottom-width: thin;
  border-bottom-color: rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
