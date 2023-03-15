<template>
  <div>
    <div class="px-4 mt-2 d-flex justify-space-between align-center">
      <div class="caption">Colección de iconos</div>
      <div class="pa-1" style="width: 200px">
        <v-menu bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              style="border: 1px solid #9e9e9Ee; background-color: #e5e5e5"
              v-bind="attrs"
              v-on="on"
            >
              <v-img :src="selectImageSrc"></v-img>
            </v-btn>
          </template>
          <v-list max-height="300" class="overflow-y-auto">
            <v-list-item
              v-for="(menuItem, index) in listIconSocial"
              :key="index"
              @click="menuActions(menuItem)"
            >
              <div
                style="background-color: #e5e5e5; border-radius: 3px"
                class="pa-1"
              >
                <v-img :src="menuItem.src" />
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="pl-4 pt-1 caption font-weight-medium">
      Configurar la colección de iconos
    </div>
    <div class="px-4 mt-2">
      <div v-for="itemSocial in socialSelection.social" :key="itemSocial.label">
        <drop
          class="drop-col"
          :class="itemSocial.over ? 'over' : ''"
          @drop="dropChange(itemSocial, ...arguments)"
          @dragover="itemSocial.over = true"
          @dragleave="itemSocial.over = false"
        >
          <div>Arrástralo aquí</div>
        </drop>
        <v-card outlined color="#e5e5e57a" style="border: 1px solid #9e9e9e">
          <v-card-text class="d-flex align-center justify-space-between pb-1">
            <div class="d-flex align-center">
              <drag :transfer-data="itemSocial" class="mr-2">
                <v-icon
                  large
                  color="primary"
                  style="cursor: -webkit-grab; cursor: grab"
                >
                  mdi-swap-vertical-bold
                </v-icon>
              </drag>
              <v-img :src="itemSocial.src" max-width="32" max-height="32" />
              <div class="ml-2">{{ itemSocial.label }}</div>
            </div>
            <div class="d-flex align-center">
              <div class="caption mr-1">Mas opciones</div>
              <v-switch
                v-model="itemSocial.more"
                hide-details
                color="primary"
                class="mt-0 pt-0"
              />
            </div>
          </v-card-text>
          <v-card-text class="pt-1 pb-0">
            <v-text-field
              v-model="itemSocial.url"
              label="Url"
              placeholder="Escriba URL"
              outlined
              dense
              hide-details
              class="caption mb-3"
            />
            <div v-if="itemSocial.more">
              <v-text-field
                v-model="itemSocial.title"
                label="Título"
                placeholder="Escriba título"
                outlined
                dense
                hide-details
                class="caption mb-3"
              />
              <v-text-field
                v-model="itemSocial.alt"
                label="Texto alternativo"
                placeholder="Escribot texto alternativo"
                outlined
                dense
                hide-details
                class="caption"
              />
            </div>
            <div class="text-right">
              <v-btn
                text
                color="warning"
                class="caption pa-0"
                style="height: 0"
                @click="deleteSocial(itemSocial)"
              >
                Eliminar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Alinear</div>
      <div class="pa-1 d-flex justify-end" style="width: 200px">
        <v-btn
          icon
          :color="
            socialSelection.style.textAlign === 'left' ? 'primary' : 'grey'
          "
          @click="socialSelection.style.textAlign = 'left'"
        >
          <v-icon>mdi-align-horizontal-left</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            socialSelection.style.textAlign === 'center' ? 'primary' : 'grey'
          "
          @click="socialSelection.style.textAlign = 'center'"
        >
          <v-icon>mdi-align-horizontal-distribute</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="
            socialSelection.style.textAlign === 'right' ? 'primary' : 'grey'
          "
          @click="socialSelection.style.textAlign = 'right'"
        >
          <v-icon>mdi-align-horizontal-right</v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="px-4 d-flex justify-space-between align-center">
      <div class="caption pt-1">Espaciado de iconos</div>
      <div class="pa-1" style="width: 200px">
        <v-select
          v-model="spaceIcon"
          dense
          :items="listSpaceIcon"
          outlined
          hide-details
          class="caption"
        />
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
              {{ socialSelection.style.paddingTop }}
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
              {{ socialSelection.style.paddingRight }}
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
              {{ socialSelection.style.paddingBottom }}
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
              {{ socialSelection.style.paddingLeft }}
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
import { Drag, Drop } from 'vue-drag-drop'
import draggableMixin from '@/mixins/services/draggableBffMixin'

export default {
  name: 'SocialSetting',
  components: {
    drag: Drag,
    drop: Drop,
  },
  mixins: [draggableMixin],
  props: {
    socialSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectImageSrc: '',
      spaceIcon: 3,
      listSpaceIcon: [3, 5, 10, 15, 20],
      listIconSocial: [],
      socialDetail: [],
    }
  },
  watch: {
    'socialSelection.socialId': {
      handler(value) {
        this.createImageSrc(value)
      },
    },
    spaceIcon(newValue) {
      const valor = newValue / 2
      this.socialSelection.social.forEach((item) => {
        item.style.paddingRight = `${valor.toString()}px`
        item.style.paddingLeft = `${valor.toString()}px`
      })
    },
  },
  created() {
    this.getListIcons()
  },
  methods: {
    createImageSrc(id) {
      this.selectImageSrc = this.listIconSocial.find(
        (element) => element.value === id
      ).src
    },
    async getListIcons() {
      this.listIconSocial = await this.getIconSocialList()
      this.socialDetail = await this.getsocialDetailList()
      this.createImageSrc(this.socialSelection.socialId)
    },
    menuActions(item) {
      const itemImage = this.socialDetail.find(
        (element) => element.value === item.value
      )
      this.socialSelection.socialId = item.value
      this.socialSelection.social.forEach((itemSocial) => {
        const itemSelect = itemImage.social.find(
          (element1) => element1.label === itemSocial.label
        )
        itemSocial.src = itemSelect.src
      })
    },
    deleteSocial(itemSocial) {
      const index = this.socialSelection.social.findIndex(
        (element) => element === itemSocial
      )
      this.socialSelection.social.splice(index, 1)
    },
    dropChange(itemSocial, data) {
      if (itemSocial.label !== data.label) {
        const newListSocial = []
        this.socialSelection.social.forEach((item) => {
          if (item.label !== data.label) {
            if (item.label !== itemSocial.label) {
              newListSocial.push(item)
            } else {
              newListSocial.push(data)
              newListSocial.push(item)
            }
          }
        })
        this.socialSelection.social = newListSocial
      }
      itemSocial.over = false
    },
    changePadding(place, type) {
      let valor = 0
      if (place === 'top') {
        valor = parseInt(
          this.socialSelection.style.paddingTop.replace('px', ''),
          10
        )
      }
      if (place === 'bottom') {
        valor = parseInt(
          this.socialSelection.style.paddingBottom.replace('px', ''),
          10
        )
      }
      if (place === 'right') {
        valor = parseInt(
          this.socialSelection.style.paddingRight.replace('px', ''),
          10
        )
      }
      if (place === 'left') {
        valor = parseInt(
          this.socialSelection.style.paddingLeft.replace('px', ''),
          10
        )
      }
      if (type === 'mas') {
        valor += 5
      } else if (valor !== 0) {
        valor -= 5
      }
      if (place === 'top') {
        this.socialSelection.style.paddingTop = `${valor.toString()}px`
      }
      if (place === 'bottom') {
        this.socialSelection.style.paddingBottom = `${valor.toString()}px`
      }
      if (place === 'right') {
        this.socialSelection.style.paddingRight = `${valor.toString()}px`
      }
      if (place === 'left') {
        this.socialSelection.style.paddingLeft = `${valor.toString()}px`
      }
    },
  },
}
</script>

<style scoped>
.drop-col {
  height: 8px;
  position: relative;
  z-index: 100;
}
.drop-col div {
  background-color: var(--v-primary-base);
  color: white;
  border-radius: 15px;
  padding: 2px 5px;
  margin-left: auto;
  margin-right: auto;
  display: none;
  width: 100px;
  position: absolute;
  top: -8px;
  left: calc(50% - 50px);
  font-size: 0.7rem !important;
  font-weight: 400;
  text-align: center;
}
.drop-col.over {
  background-color: var(--v-primary-base);
  height: 6px;
  margin-bottom: 1px;
  margin-top: 1px;
}
.drop-col.over div {
  display: block;
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
}
</style>
