<template>
  <div>
    <div class="px-4 mt-2">
      <div class="caption">Línea</div>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="dividerSelection.divider.style.borderTopStyle"
            :items="borderItems"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-if="dividerSelection"
            v-model="dividerSelection.divider.style.borderTopWidth"
            outlined
            dense
            hide-details
            class="caption"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="dividerSelection.divider.style.borderTopColor"
            dense
            hide-details
            class="ma-0 pa-0 caption"
            outlined
          >
            <template v-slot:append>
              <v-menu
                v-model="menuBorder"
                top
                nudge-bottom="105"
                nudge-left="16"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div
                    v-if="dividerSelection"
                    :style="
                      swatchStyle(dividerSelection.divider.style.borderTopColor)
                    "
                    v-on="on"
                  ></div>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                      v-if="dividerSelection"
                      v-model="dividerSelection.divider.style.borderTopColor"
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
    <v-divider class="mt-3 mb-1"></v-divider>
    <div class="px-4 mt-2">
      <div class="caption">Ancho</div>
      <v-row>
        <v-col cols="10">
          <v-slider
            v-model="sliderWidth"
            color="primary"
            track-color="grey"
            always-dirty
            min="5"
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
          dividerSelection.style.width
        }}</v-col>
      </v-row>
    </div>
    <v-divider class="mt-3 mb-1"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Alinear</div>
      <div class="pa-1 d-flex justify-end" style="width: 200px">
        <v-btn
          icon
          :color="
            dividerSelection.style.margin === '0 auto 0 0' ? 'primary' : 'grey'
          "
          @click="dividerSelect('left')"
        >
          <v-icon>mdi-align-horizontal-left</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            dividerSelection.style.margin === '0 auto 0 auto'
              ? 'primary'
              : 'grey'
          "
          @click="dividerSelect('center')"
        >
          <v-icon>mdi-align-horizontal-distribute</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            dividerSelection.style.margin === '0 0 0 auto' ? 'primary' : 'grey'
          "
          @click="dividerSelect('right')"
        >
          <v-icon>mdi-align-horizontal-right</v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider class="my-1"></v-divider>
    <div class="px-4 caption pt-1 pb-3">Padding</div>
    <div class="px-4 pb-6">
      <div class="d-flex justify-space-between pr-2">
        <div class="py-0" style="width: 170px">
          <div class="caption">Superior</div>
          <v-btn-toggle dense>
            <v-btn @click="changePadding('top', 'menos')">
              <v-icon small>mdi-minus-circle-outline</v-icon>
            </v-btn>
            <div class="caption input-padding" style="min-width: 67px">
              {{ dividerSelection.style.paddingTop }}
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
              {{ dividerSelection.style.paddingRight }}
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
              {{ dividerSelection.style.paddingBottom }}
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
              {{ dividerSelection.style.paddingLeft }}
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
  name: 'DividerSetting',
  props: {
    dividerSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      borderItems: [
        { text: 'Sólido', value: 'solid' },
        { text: 'Discontinua', value: 'dashed' },
        { text: 'Punteado', value: 'dotted' },
      ],
      menuBorder: false,
      sliderWidth: 100,
    }
  },
  watch: {
    'dividerSelection.divider.style.borderTopWidth': {
      handler(value) {
        if (value.indexOf('px') === -1) {
          this.dividerSelection.divider.style.borderTopWidth = `${value}px`
        } else {
          this.dividerSelection.divider.style.borderTopWidth = value
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
    changeWidth(itemValue) {
      this.dividerSelection.style.width = `${itemValue.toString()}%`
    },
    dividerSelect(type) {
      if (type === 'center') {
        this.dividerSelection.style.margin = '0 auto 0 auto'
      } else if (type === 'right') {
        this.dividerSelection.style.margin = '0 0 0 auto'
      } else {
        this.dividerSelection.style.margin = '0 auto 0 0'
      }
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.dividerSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.dividerSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.dividerSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.dividerSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.dividerSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.dividerSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.dividerSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.dividerSelection.style.paddingLeft = `${valor.toString()}px`
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
