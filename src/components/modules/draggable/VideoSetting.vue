<template>
  <div>
    <div class="px-4 mt-6">
      <v-text-field
        v-model="videoSelection.href"
        label="Url"
        placeholder="Escriba URL"
        outlined
        dense
        hide-details
        class="caption"
        @change="createImage()"
      />
    </div>
    <div class="px-4 caption darkgray--text">
      Agregar URL de YouTube genera automáticamente una imagen de vista previa.
      La imagen se vinculará a la URL proporcionada.
    </div>
    <div class="px-4 mt-6">
      <v-text-field
        v-model="videoSelection.title"
        label="Título"
        placeholder="Escriba título"
        outlined
        dense
        hide-details
        class="caption"
      />
    </div>
    <div v-if="videoSelection">
      <v-divider class="mt-2"></v-divider>
      <div class="px-4 mt-2">
        <v-card outlined width="94" color="lightcyan">
          <v-card-text>
            <v-img width="60" height="60" :src="videoSelection.icon.src" />
          </v-card-text>
        </v-card>
      </div>
      <div class="px-4 mt-2 d-flex justify-space-between align-center">
        <div class="caption">Tipo icono de reproducción</div>
        <div class="pa-1" style="width: 200px">
          <v-select
            v-model="videoSelection.icon.type"
            dense
            :items="listImageCenter"
            item-text="type"
            item-value="type"
            outlined
            hide-details
            class="caption"
          />
        </div>
      </div>
      <div class="px-4 mt-2 d-flex justify-space-between align-center">
        <div class="caption">Color icono de reproducción</div>
        <div class="pa-1" style="width: 200px">
          <v-select
            v-model="videoSelection.icon.color"
            dense
            :items="listImageCenter"
            item-text="color"
            item-value="color"
            outlined
            hide-details
            class="caption"
          />
        </div>
      </div>
      <v-divider class="mt-2"></v-divider>
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
                {{ videoSelection.style.paddingTop }}
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
                {{ videoSelection.style.paddingRight }}
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
                {{ videoSelection.style.paddingBottom }}
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
                {{ videoSelection.style.paddingLeft }}
              </div>
              <v-btn @click="changePadding('left', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoSetting',
  props: {
    videoSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      listImageCenter: [
        {
          type: 'Redondo sólido',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-01.png',
        },
        {
          type: 'Redondo contorno',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-02.png',
        },
        {
          type: 'Rectángulo solido',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-03.png',
        },
        {
          type: 'Rectángulo contorno',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-04.png',
        },
        {
          type: 'Cuadrado solido',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-06.png',
        },
        {
          type: 'Cuadrado contorno',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-07.png',
        },
        {
          type: 'Redondo sólido',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-01.png',
        },
        {
          type: 'Redondo contorno',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-02.png',
        },
        {
          type: 'Rectángulo solido',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-03.png',
        },
        {
          type: 'Rectángulo contorno',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-04.png',
        },
        {
          type: 'Cuadrado solido',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-06.png',
        },
        {
          type: 'Cuadrado contorno',
          color: 'Negro',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/dark/type-07.png',
        },
      ],
    }
  },
  watch: {
    'videoSelection.icon.type': {
      handler() {
        this.changeIcon()
      },
    },
    'videoSelection.icon.color': {
      handler() {
        this.changeIcon()
      },
    },
    'videoSelection.title': {
      handler(value) {
        this.videoSelection.alt = value
      },
    },
  },
  methods: {
    createImage() {
      const listUrl = this.videoSelection.href.split('/')
      if (listUrl.length !== 0) {
        const url = `https://img.youtube.com/vi/${
          listUrl[listUrl.length - 1]
        }/maxresdefault.jpg`
        this.videoSelection.src = url
      }
    },
    changeIcon() {
      const item = this.listImageCenter.find(
        (f) =>
          f.type === this.videoSelection.icon.type &&
          f.color === this.videoSelection.icon.color
      )
      this.videoSelection.icon.src = item.src
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.videoSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.videoSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.videoSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.videoSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.videoSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.videoSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.videoSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.videoSelection.style.paddingLeft = `${valor.toString()}px`
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
