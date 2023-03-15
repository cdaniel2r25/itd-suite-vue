<template>
  <div>
    <div class="pa-4 d-flex justify-space-between align-center">
      <div class="caption">Color de fondo</div>
      <div class="pa-1" style="width: 154px">
        <v-text-field
          v-model="rowSelection.style.backgroundColor"
          dense
          hide-details
          class="ma-0 pa-0 caption"
          outlined
        >
          <template v-slot:append>
            <v-menu
              v-model="menuColorBack"
              top
              nudge-bottom="105"
              nudge-left="16"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <div
                  v-if="rowSelection"
                  :style="swatchStyle(rowSelection.style.backgroundColor)"
                  v-on="on"
                ></div>
              </template>
              <v-card>
                <v-card-text class="pa-0">
                  <v-color-picker
                    v-model="rowSelection.style.backgroundColor"
                    flat
                  />
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="pl-4 pt-4 caption font-weight-medium">
      borde del área de contenido
    </div>
    <div class="px-4 pt-1">
      <div class="caption">Tope</div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="rowSelection.style.borderTopStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-if="rowSelection"
            v-model="rowSelection.style.borderTopWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="rowSelection.style.borderTopColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuColorTop"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    v-if="rowSelection"
                    :style="swatchStyle(rowSelection.style.borderTopColor)"
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-if="rowSelection"
                      v-model="rowSelection.style.borderTopColor"
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
    <div class="px-4 pt-1">
      <div class="caption">Derecho</div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="rowSelection.style.borderRightStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="rowSelection.style.borderRightWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="rowSelection.style.borderRightColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuColorRight"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    :style="swatchStyle(rowSelection.style.borderRightColor)"
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-model="rowSelection.style.borderRightColor"
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
    <div class="px-4 pt-1">
      <div class="caption">Izquierdo</div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="rowSelection.style.borderLeftStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="rowSelection.style.borderLeftWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="rowSelection.style.borderLeftColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuColorLeft"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    :style="swatchStyle(rowSelection.style.borderLeftColor)"
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-model="rowSelection.style.borderLeftColor"
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
    <div class="px-4 pt-1">
      <div class="caption">Abajo</div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="rowSelection.style.borderBottomStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="rowSelection.style.borderBottomWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="rowSelection.style.borderBottomColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuColorBottom"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    :style="swatchStyle(rowSelection.style.borderBottomColor)"
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-model="rowSelection.style.borderBottomColor"
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
    <v-divider class="mt-4"></v-divider>
    <div class="pa-4 pt-4 d-flex justify-space-between">
      <div class="caption font-weight-medium">Personalizar columnas</div>
      <div>
        <v-btn text color="primary" x-small @click="$emit('add-column')">
          <v-icon left>mdi-plus</v-icon>
          añadir nuevo
        </v-btn>
      </div>
    </div>
    <div class="px-1 pt-2 d-flex">
      <v-row no-gutters>
        <v-col
          v-for="(col, index) in rowSelection.stageColumns"
          :key="index"
          :cols="col.col"
        >
          <v-card
            class="border-card"
            height="60"
            elevation="0"
            @click="selectColumn(col)"
          >
            <div
              class="d-flex justify-space-between align-center"
              :class="colSelection && col.activeColumn ? 'active-column' : ''"
              style="height: 100%"
            >
              <div>
                <v-icon
                  v-if="index !== 0"
                  :x-small="col.col === 1 ? true : false"
                  :small="col.col !== 1 ? true : false"
                  color="primary"
                  @click="$emit('add-width-l', col)"
                >
                  mdi-arrow-left-bold-circle-outline
                </v-icon>
              </div>
              <div class="caption">{{ col.col }}</div>
              <div>
                <v-icon
                  v-if="index !== totalColumns - 1"
                  :x-small="col.col === 1 ? true : false"
                  :small="col.col !== 1 ? true : false"
                  color="primary"
                  @click="$emit('add-width-r', col)"
                >
                  mdi-arrow-right-bold-circle-outline
                </v-icon>
              </div>
            </div>
          </v-card>
          <div class="d-flex justify-center">
            <v-icon
              v-if="colSelection && col.activeColumn"
              large
              color="gray100"
              >mdi-menu-up</v-icon
            >
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-if="!colSelection" style="height: 50px"></div>
    <div
      v-if="colSelection"
      style="background-color: var(--v-gray100-base); margin-top: -14px"
    >
      <div class="pa-4 text-right">
        <v-btn
          text
          color="primary"
          x-small
          class="pr-0"
          @click="$emit('delete-column', colSelection)"
        >
          <v-icon left>mdi-delete</v-icon>
          eliminar
        </v-btn>
      </div>
      <div class="px-4 d-flex justify-space-between align-center">
        <div class="caption">Color de fondo de la columna</div>
        <div class="pa-1" style="width: 154px">
          <v-text-field
            v-model="colSelection.style.backgroundColor"
            dense
            hide-details
            class="ma-0 pa-0 caption color-back"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuColorBackCol"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    v-if="colSelection"
                    :style="swatchStyle(colSelection.style.backgroundColor)"
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-model="colSelection.style.backgroundColor"
                      flat
                    />
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-text-field>
        </div>
      </div>
      <div class="pl-4 pb-4 caption font-weight-medium">Padding</div>
      <div class="px-4 pb-6">
        <v-row>
          <v-col cols="6" class="py-0">
            <div class="caption">Superior</div>
            <v-btn-toggle dense>
              <v-btn @click="changePadding('top', 'menos')">
                <v-icon small>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <div class="caption input-padding">
                {{ colSelection.style.paddingTop }}
              </div>
              <v-btn @click="changePadding('top', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="6" class="py-0">
            <div class="caption">Derecha</div>
            <v-btn-toggle dense>
              <v-btn @click="changePadding('right', 'menos')">
                <v-icon small>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <div class="caption input-padding">
                {{ colSelection.style.paddingRight }}
              </div>
              <v-btn @click="changePadding('right', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="6" class="pt-1 pb-0">
            <div class="caption">Inferior</div>
            <v-btn-toggle dense>
              <v-btn @click="changePadding('bottom', 'menos')">
                <v-icon small>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <div class="caption input-padding">
                {{ colSelection.style.paddingBottom }}
              </div>
              <v-btn @click="changePadding('bottom', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="6" class="pt-1 pb-0">
            <div class="caption">Izquierda</div>
            <v-btn-toggle dense>
              <v-btn @click="changePadding('left', 'menos')">
                <v-icon small>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <div class="caption input-padding">
                {{ colSelection.style.paddingLeft }}
              </div>
              <v-btn @click="changePadding('left', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </div>
      <div class="pl-4 caption font-weight-medium">Borde</div>
      <div class="px-4 pt-1">
        <div class="caption">Tope</div>
        <Borde
          :borde-selection="bordeTopSelection"
          @borde-change="bordeTopChange"
        />
      </div>
      <div class="px-4 pt-1 pb-4">
        <div class="caption">Derecho</div>
        <Borde
          :borde-selection="bordeRightSelection"
          @borde-change="bordeRightChange"
        />
        <div class="caption">Izquierdo</div>
        <Borde
          :borde-selection="bordeLeftSelection"
          @borde-change="bordeLeftChange"
        />
        <div class="caption">Abajo</div>
        <Borde
          :borde-selection="bordeBottomSelection"
          @borde-change="bordeBottomChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Borde from '@/components/modules/draggable/Borde.vue'

export default {
  name: 'RowSetting',
  components: { Borde },
  props: {
    rowSelection: {
      type: Object,
      default: () => ({}),
    },
    colSelection: {
      type: Object,
      default: () => ({}),
    },
    totalColumns: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      menuColorBack: false,
      menuColorBackCol: false,
      menuColorTop: false,
      menuColorLeft: false,
      menuColorRight: false,
      menuColorBottom: false,
      menuColColorBack: false,
      menuColColorTop: false,
      menuColColorLeft: false,
      menuColColorRight: false,
      menuColColorBottom: false,
      borderItems: [
        { text: 'Sólido', value: 'solid' },
        { text: 'Discontinua', value: 'dashed' },
        { text: 'Punteado', value: 'dotted' },
      ],
      bordeBottomSelection: {
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      },
      bordeLeftSelection: {
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      },
      bordeRightSelection: {
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      },
      bordeTopSelection: {
        borderStyle: '',
        borderWidth: '',
        borderColor: '',
      },
    }
  },
  watch: {
    'rowSelection.style.borderTopWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.rowSelection.style.borderTopWidth = `${value}px`
        } else {
          this.rowSelection.style.borderTopWidth = value
        }
      },
    },
    'rowSelection.style.borderLeftWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.rowSelection.style.borderLeftWidth = `${value}px`
        } else {
          this.rowSelection.style.borderLeftWidth = value
        }
      },
    },
    'rowSelection.style.borderRightWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.rowSelection.style.borderRightWidth = `${value}px`
        } else {
          this.rowSelection.style.borderRightWidth = value
        }
      },
    },
    'rowSelection.style.borderBottomWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.rowSelection.style.borderBottomWidth = `${value}px`
        } else {
          this.rowSelection.style.borderBottomWidth = value
        }
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
    disableColumns() {
      this.rowSelection.stageColumns.forEach((col) => {
        col.activeColumn = false
      })
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.colSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.colSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.colSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.colSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.colSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.colSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.colSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.colSelection.style.paddingLeft = `${valor.toString()}px`
      }
    },
    async selectColumn(column) {
      this.disableColumns()
      column.activeColumn = true
      await this.$emit('select-column', column)
      this.selectColumns()
    },
    selectColumns() {
      let newBorde = {
        borderStyle: this.colSelection.style.borderBottomStyle,
        borderWidth: this.colSelection.style.borderBottomWidth,
        borderColor: this.colSelection.style.borderBottomColor,
      }
      this.bordeBottomSelection = newBorde
      newBorde = {
        borderStyle: this.colSelection.style.borderLeftStyle,
        borderWidth: this.colSelection.style.borderLeftWidth,
        borderColor: this.colSelection.style.borderLeftColor,
      }
      this.bordeLeftSelection = newBorde
      newBorde = {
        borderStyle: this.colSelection.style.borderRightStyle,
        borderWidth: this.colSelection.style.borderRightWidth,
        borderColor: this.colSelection.style.borderRightColor,
      }
      this.bordeRightSelection = newBorde
      newBorde = {
        borderStyle: this.colSelection.style.borderTopStyle,
        borderWidth: this.colSelection.style.borderTopWidth,
        borderColor: this.colSelection.style.borderTopColor,
      }
      this.bordeTopSelection = newBorde
    },
    bordeBottomChange(itemBorde) {
      this.colSelection.style.borderBottomStyle = itemBorde.borderStyle
      this.colSelection.style.borderBottomWidth = itemBorde.borderWidth
      this.colSelection.style.borderBottomColor = itemBorde.borderColor
    },
    bordeLeftChange(itemBorde) {
      this.colSelection.style.borderLeftStyle = itemBorde.borderStyle
      this.colSelection.style.borderLeftWidth = itemBorde.borderWidth
      this.colSelection.style.borderLeftColor = itemBorde.borderColor
    },
    bordeRightChange(itemBorde) {
      this.colSelection.style.borderRightStyle = itemBorde.borderStyle
      this.colSelection.style.borderRightWidth = itemBorde.borderWidth
      this.colSelection.style.borderRightColor = itemBorde.borderColor
    },
    bordeTopChange(itemBorde) {
      this.colSelection.style.borderToptStyle = itemBorde.borderStyle
      this.colSelection.style.borderTopWidth = itemBorde.borderWidth
      this.colSelection.style.borderTopColor = itemBorde.borderColor
    },
  },
}
</script>
<style scoped>
.border-card {
  border: 2px solid var(--v-primary-base);
  border-radius: 5px;
}
.active-column {
  background-color: rgb(230, 224, 233);
}
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
  min-width: 50px;
}
.color-back {
  background-color: white;
}
</style>
