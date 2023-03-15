<template>
  <div>
    <div class="px-4 mt-2">
      <v-btn
        color="primary"
        class="caption"
        @click="dialogChangeImage = !dialogChangeImage"
      >
        cambiar imagen
      </v-btn>
      <v-text-field
        v-model="imageSelection.src"
        label="Url"
        placeholder="Escriba URL"
        outlined
        dense
        hide-details
        class="caption mt-4"
      />
      <v-text-field
        v-model="imageSelection.title"
        label="Texto alternativo"
        placeholder="Escriba texto alternativo"
        outlined
        dense
        hide-details
        class="caption mt-4"
      />
    </div>
    <v-divider class="mt-2"></v-divider>
    <div v-if="imageSelection.src !== ''">
      <div class="px-4 d-flex justify-space-between align-center">
        <div class="caption pt-3">Ancho automático</div>
        <div>
          <v-switch
            v-model="imageSelection.image.style.width"
            value="auto"
            color="primary"
            hide-details
            @change="changeAuto"
          />
        </div>
      </div>
      <div v-if="imageSelection.image.style.width !== 'auto'" class="px-4 mt-2">
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
          <v-col cols="2" class="caption pt-4">{{ sliderWidth }}%</v-col>
        </v-row>
      </div>
      <v-divider class="mt-2"></v-divider>
      <div class="pl-4 pt-4 caption font-weight-medium">Acción</div>
      <div class="px-4 mt-2 d-flex justify-space-between align-center">
        <div class="caption">Tipo de vínculo</div>
        <div class="pa-1" style="width: 200px">
          <v-select
            v-model="imageSelection.link.type"
            dense
            :items="listLinkType"
            outlined
            hide-details
            class="caption"
          />
        </div>
      </div>
      <div v-if="imageSelection.link.type === 'web'" class="pl-4 pr-5">
        <v-text-field
          v-model="imageSelection.link.href"
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
      <div v-if="imageSelection.link.type === 'email'" class="pl-4 pr-5">
        <v-text-field
          v-model="imageSelection.link.mailTo"
          label="enviar por correo a"
          placeholder="Escriba correo"
          outlined
          dense
          hide-details
          class="caption"
        />
        <v-text-field
          v-model="imageSelection.link.subject"
          label="Tema"
          placeholder="Escriba tema"
          outlined
          dense
          hide-details
          class="caption mt-2"
        />
        <v-text-field
          v-model="imageSelection.link.body"
          label="Cuerpo"
          placeholder="Escriba cuerpo"
          outlined
          dense
          hide-details
          class="caption mt-2"
        />
      </div>
      <div v-if="imageSelection.link.type === 'call'" class="pl-4 pr-5">
        <v-text-field
          v-model="imageSelection.link.mailTo"
          label="Teléfono"
          placeholder="Escriba teléfono"
          outlined
          dense
          hide-details
          class="caption"
        />
      </div>
      <div v-if="imageSelection.link.type === 'sms'" class="pl-4 pr-5">
        <v-text-field
          v-model="imageSelection.link.mailTo"
          label="Teléfono"
          placeholder="Escriba teléfono"
          outlined
          dense
          hide-details
          class="caption"
        />
        <v-text-field
          v-model="imageSelection.link.body"
          label="Mensaje"
          placeholder="Escriba mensaje"
          outlined
          dense
          hide-details
          class="caption mt-2"
        />
      </div>
      <v-divider class="mt-2"></v-divider>
      <div class="px-4 d-flex justify-space-between align-center">
        <div class="caption pt-1">Alinear</div>
        <div class="pa-1 d-flex justify-end" style="width: 200px">
          <v-btn
            icon
            :color="
              imageSelection.style.textAlign === 'left' ? 'primary' : 'grey'
            "
            @click="imageSelection.style.textAlign = 'left'"
          >
            <v-icon>mdi-align-horizontal-left</v-icon>
          </v-btn>
          <v-btn
            icon
            :color="
              imageSelection.style.textAlign === 'center' ? 'primary' : 'grey'
            "
            @click="imageSelection.style.textAlign = 'center'"
          >
            <v-icon>mdi-align-horizontal-distribute</v-icon>
          </v-btn>
          <v-btn
            icon
            :color="
              imageSelection.style.textAlign === 'right' ? 'primary' : 'grey'
            "
            @click="imageSelection.style.textAlign = 'right'"
          >
            <v-icon>mdi-align-horizontal-right</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
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
                {{ imageSelection.style.paddingTop }}
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
                {{ imageSelection.style.paddingRight }}
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
                {{ imageSelection.style.paddingBottom }}
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
                {{ imageSelection.style.paddingLeft }}
              </div>
              <v-btn @click="changePadding('left', 'mas')">
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </div>
    </div>
    <change-image
      v-if="dialogChangeImage"
      v-model="dialogChangeImage"
      :image-selection="imageSelection"
    />
  </div>
</template>

<script>
import ChangeImage from '@/components/modules/draggable/ChangeImage.vue'

export default {
  name: 'ImageSetting',
  components: { ChangeImage },
  props: {
    imageSelection: {
      type: Object,
      default: () => ({}),
    },
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogChangeImage: false,
      sliderWidth: 20,
      listLinkType: [
        { text: 'Abrir página web', value: 'web' },
        { text: 'Enviar correo electrónico', value: 'email' },
        { text: 'hacer una llamada', value: 'call' },
      ],
    }
  },
  watch: {
    sliderWidth(newSlider) {
      this.imageSelection.image.style.width = `${newSlider.toString()}%`
    },
  },
  methods: {
    changeAuto(item) {
      if (item !== 'auto') {
        this.imageSelection.image.style.width = `${this.sliderWidth.toString()}%`
      }
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.imageSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.imageSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.imageSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.imageSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.imageSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.imageSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.imageSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.imageSelection.style.paddingLeft = `${valor.toString()}px`
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
