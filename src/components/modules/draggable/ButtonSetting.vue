<template>
  <div>
    <div class="pl-4 pt-4 caption font-weight-medium">Acción</div>
    <div class="px-4 mt-2 d-flex justify-space-between align-center">
      <div class="caption">tipo de vínculo</div>
      <div class="pa-1" style="width: 200px">
        <v-select
          v-model="buttonSelection.link.type"
          dense
          :items="listLinkType"
          outlined
          hide-details
          class="caption"
        />
      </div>
    </div>
    <div v-if="buttonSelection.link.type === 'web'" class="pl-4 pr-5">
      <v-text-field
        v-model="buttonSelection.link.href"
        label="Url"
        placeholder="Escriba URL"
        outlined
        dense
        hide-details
        class="caption"
      />
      <v-btn text color="primary" class="caption pl-0">
        archivo de enlace
      </v-btn>
    </div>
    <div v-if="buttonSelection.link.type === 'email'" class="pl-4 pr-5">
      <v-text-field
        v-model="buttonSelection.link.mailTo"
        label="enviar por correo a"
        placeholder="Escriba correo"
        outlined
        dense
        hide-details
        class="caption"
      />
      <v-text-field
        v-model="buttonSelection.link.subject"
        label="Tema"
        placeholder="Escriba tema"
        outlined
        dense
        hide-details
        class="caption mt-2"
      />
      <v-text-field
        v-model="buttonSelection.link.body"
        label="Cuerpo"
        placeholder="Escriba cuerpo"
        outlined
        dense
        hide-details
        class="caption mt-2"
      />
    </div>
    <div v-if="buttonSelection.link.type === 'call'" class="pl-4 pr-5">
      <v-text-field
        v-model="buttonSelection.link.mailTo"
        label="Teléfono"
        placeholder="Escriba teléfono"
        outlined
        dense
        hide-details
        class="caption"
      />
    </div>
    <div v-if="buttonSelection.link.type === 'sms'" class="pl-4 pr-5">
      <v-text-field
        v-model="buttonSelection.link.mailTo"
        label="Teléfono"
        placeholder="Escriba teléfono"
        outlined
        dense
        hide-details
        class="caption"
      />
      <v-text-field
        v-model="buttonSelection.link.body"
        label="Mensaje"
        placeholder="Escriba mensaje"
        outlined
        dense
        hide-details
        class="caption mt-2"
      />
    </div>
    <div class="pl-4 pt-4 caption font-weight-medium">Opciones de botón</div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption">Contenido</div>
      <div style="width: 200px">
        <v-text-field
          v-model="buttonSelection.button.text"
          outlined
          dense
          hide-details
          class="caption"
          @change="changeWidthHeight()"
        />
      </div>
    </div>
    <v-divider class="mt-2"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-3">Ancho automático</div>
      <div>
        <v-switch
          v-model="buttonSelection.button.style.width"
          value="auto"
          color="primary"
          hide-details
          @change="changeAuto"
        />
      </div>
    </div>
    <div v-if="buttonSelection.button.style.width !== 'auto'" class="px-4 mt-2">
      <v-row>
        <v-col cols="10">
          <v-slider
            v-model="sliderWidth"
            color="primary"
            track-color="grey"
            always-dirty
            min="20"
            max="100"
            hide-details
            thumb-label
          >
            <template v-slot:prepend>
              <v-icon small color="primary"> mdi-minus </v-icon>
            </template>
            <template v-slot:append>
              <v-icon small color="primary"> mdi-plus </v-icon>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="2" class="caption">{{
          buttonSelection.button.style.width
        }}</v-col>
      </v-row>
    </div>
    <v-divider class="mt-2"></v-divider>
    <div class="px-4 mt-2 d-flex justify-space-between align-center">
      <div class="caption">Familia de fuentes</div>
      <div class="pa-1" style="width: 200px">
        <v-select
          v-model="buttonSelection.button.style.fontFamily"
          dense
          :items="listfont"
          outlined
          hide-details
          class="caption"
          @change="changeWidthHeight()"
        />
      </div>
    </div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-3">Fuente</div>
      <div class="pa-1" style="width: 200px">
        <v-select
          v-model="buttonSelection.button.style.fontWeight"
          dense
          :items="listFontWeight"
          outlined
          hide-details
          class="caption"
          @change="changeWidthHeight()"
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
            {{ buttonSelection.button.style.fontSize }}
          </div>
          <v-btn @click="changeFontSize('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Color de botón</div>
      <div class="pa-1" style="width: 200px">
        <v-text-field
          v-model="buttonSelection.button.style.backgroundColor"
          dense
          hide-details
          class="ma-0 pa-0 caption color-back"
          outlined
        >
          <template v-slot:append>
            <v-menu
              v-model="colorBack"
              top
              nudge-bottom="105"
              nudge-left="16"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <div
                  v-if="buttonSelection"
                  :style="
                    swatchStyle(buttonSelection.button.style.backgroundColor)
                  "
                  v-on="on"
                />
              </template>
              <v-card>
                <v-card-text class="pa-0">
                  <v-color-picker
                    v-model="buttonSelection.button.style.backgroundColor"
                    flat
                  />
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Color de texto</div>
      <div class="pa-1" style="width: 200px">
        <v-text-field
          v-model="buttonSelection.button.style.color"
          dense
          hide-details
          class="ma-0 pa-0 caption color-back"
          outlined
        >
          <template v-slot:append>
            <v-menu
              v-model="colorText"
              top
              nudge-bottom="105"
              nudge-left="16"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <div
                  v-if="buttonSelection"
                  :style="swatchStyle(buttonSelection.button.style.color)"
                  v-on="on"
                ></div>
              </template>
              <v-card>
                <v-card-text class="pa-0">
                  <v-color-picker
                    v-model="buttonSelection.button.style.color"
                    flat
                  />
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Alinear</div>
      <div class="pa-1 d-flex justify-end" style="width: 200px">
        <v-btn
          icon
          :color="
            buttonSelection.style.textAlign === 'left' ? 'primary' : 'grey'
          "
          @click="buttonSelection.style.textAlign = 'left'"
        >
          <v-icon>mdi-align-horizontal-left</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            buttonSelection.style.textAlign === 'center' ? 'primary' : 'grey'
          "
          @click="buttonSelection.style.textAlign = 'center'"
        >
          <v-icon>mdi-align-horizontal-distribute</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            buttonSelection.style.textAlign === 'right' ? 'primary' : 'grey'
          "
          @click="buttonSelection.style.textAlign = 'right'"
        >
          <v-icon>mdi-align-horizontal-right</v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Altura de la línea</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeLineHeight('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ buttonSelection.button.style.lineHeight }}
          </div>
          <v-btn @click="changeLineHeight('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Espaciado de letras</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeLetterSpacing('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ buttonSelection.button.style.letterSpacing }}
          </div>
          <v-btn @click="changeLetterSpacing('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="pl-4 caption font-weight-medium">Borde</div>
    <div class="px-4 pt-1">
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="buttonSelection.button.style.borderStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="buttonSelection.button.style.borderWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="buttonSelection.button.style.borderColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuBorde"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    :style="
                      swatchStyle(buttonSelection.button.style.borderColor)
                    "
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-model="buttonSelection.button.style.borderColor"
                      flat
                    />
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </div>
    <div class="px-4 pt-2 d-flex justify-space-between align-center">
      <div class="caption pt-1">Radio del borde</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeBorderRadius('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ buttonSelection.button.style.borderRadius }}
          </div>
          <v-btn @click="changeBorderRadius('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 caption pt-1 pb-3">Relleno</div>
    <div class="px-4 pb-2">
      <div class="d-flex justify-space-between pr-2">
        <div class="py-0" style="width: 170px">
          <div class="caption">Vertical</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('vertical', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ buttonSelection.button.style.paddingTop }}
            </div>
            <v-btn @click="changePadding('vertical', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="py-0" style="width: 170px">
          <div class="caption">Lateral</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('lateral', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ buttonSelection.button.style.paddingRight }}
            </div>
            <v-btn @click="changePadding('lateral', 'mas')">
              <v-icon small>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
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
              {{ buttonSelection.style.paddingTop }}
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
              {{ buttonSelection.style.paddingRight }}
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
              {{ buttonSelection.style.paddingBottom }}
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
              {{ buttonSelection.style.paddingLeft }}
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
export default {
  name: 'ButtonSetting',
  props: {
    buttonSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menuBorde: false,
      borderItems: [
        { text: 'Sólido', value: 'solid' },
        { text: 'Discontinua', value: 'dashed' },
        { text: 'Punteado', value: 'dotted' },
      ],
      listLinkType: [
        { text: 'Abrir página web', value: 'web' },
        { text: 'Enviar correo electrónico', value: 'email' },
        { text: 'hacer una llamada', value: 'call' },
      ],
      listfont: [
        {
          text: 'Arial',
          value: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        },
        {
          text: 'Courier New',
          value:
            "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace",
        },
        { text: 'Georgia', value: "Georgia, Times, 'Times New Roman', serif" },
        {
          text: 'Helvetica Neue',
          value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          text: 'Lucida Sans Unicode',
          value:
            "'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif",
        },
        { text: 'Tahoma', value: 'Tahoma, Verdana, Segoe, sans-serif' },
        {
          text: 'Times New Roman',
          value:
            "TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif",
        },
        {
          text: 'Trebuchet MS',
          value:
            "'Trebuchet MS','Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
        },
      ],
      listFontWeight: [
        { text: 'Regular', value: 400 },
        { text: 'Negrita', value: 700 },
      ],
      switchWidth: true,
      sliderWidth: 20,
      colorBack: false,
      colorText: false,
    }
  },
  watch: {
    'buttonSelection.button.style.borderWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.buttonSelection.button.style.borderWidth = `${value}px`
        } else {
          this.buttonSelection.button.style.borderWidth = value
        }
      },
    },
    sliderWidth: {
      handler(value) {
        this.changeWidth(value)
      },
    },
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
    changeAuto(item) {
      if (item !== 'auto') {
        this.buttonSelection.button.style.width = `${this.sliderWidth.toString()}%`
      }
      this.changeWidthHeight()
    },
    changeWidth(itemValue) {
      this.buttonSelection.button.style.width = `${itemValue.toString()}%`
      this.changeWidthHeight()
    },
    changeWidthHeight() {
      let sizeBtn = '20%'
      let itemWidth = document.getElementById(
        this.buttonSelection.id
      ).offsetWidth
      if (this.buttonSelection.button.style.width !== 'auto') {
        sizeBtn = this.buttonSelection.button.style.width
      }
      const itemHeight = document.getElementById(this.buttonSelection.id)
        .firstChild.offsetHeight
      this.buttonSelection.button.height = `${itemHeight.toString()}px`
      itemWidth = (itemWidth * parseFloat(sizeBtn.replace('%', ''))) / 100
      this.buttonSelection.button.width = `${itemWidth.toString()}px`
    },
    changeBorderRadius(type) {
      let valor = parseInt(
        this.buttonSelection.button.style.borderRadius.replace('px', ''),
        10
      )
      if (type === 'mas') {
        valor += 1
      } else if (valor !== 0) {
        valor -= 1
      }
      this.buttonSelection.button.style.borderRadius = `${valor.toString()}px`
    },
    changeLetterSpacing(type) {
      let valor = parseInt(
        this.buttonSelection.button.style.letterSpacing.replace('px', ''),
        10
      )
      if (type === 'mas') {
        valor += 1
      } else if (valor !== 0) {
        valor -= 1
      }
      this.buttonSelection.button.style.letterSpacing = `${valor.toString()}px`
      this.changeWidthHeight()
    },
    changeLineHeight(type) {
      let valor = parseFloat(this.buttonSelection.button.style.lineHeight)
      if (type === 'mas') {
        if (valor !== 2) {
          valor += 0.5
        }
      } else if (valor !== 1) {
        valor -= 0.5
      }
      this.buttonSelection.button.style.lineHeight = valor.toString()
      this.changeWidthHeight()
    },
    changeFontSize(type) {
      let valor = parseInt(
        this.buttonSelection.button.style.fontSize.replace('px', ''),
        10
      )
      if (type === 'mas') {
        valor += 1
      } else if (valor !== 10) {
        valor -= 1
      }
      this.buttonSelection.button.style.fontSize = `${valor.toString()}px`
      this.changeWidthHeight()
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.buttonSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.buttonSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.buttonSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.buttonSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (place === 'vertical') {
        valor = parseInt(
          this.buttonSelection.button.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'lateral') {
        valor = parseInt(
          this.buttonSelection.button.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.buttonSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.buttonSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.buttonSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.buttonSelection.style.paddingLeft = `${valor.toString()}px`
      }
      if (place === 'vertical') {
        this.buttonSelection.button.style.paddingTop = `${valor.toString()}px`
        this.buttonSelection.button.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'lateral') {
        this.buttonSelection.button.style.paddingLeft = `${valor.toString()}px`
        this.buttonSelection.button.style.paddingRight = `${valor.toString()}px`
      }
      this.changeWidthHeight()
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
