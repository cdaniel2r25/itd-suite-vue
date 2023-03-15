<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <div
        class="over-active"
        :class="itemContent.active ? 'content-active' : ''"
        style="z-index: 100; background-color: transparent"
      >
        <v-fade-transition>
          <v-overlay
            v-if="hover"
            absolute
            color="#E6E0E9"
            style="display: block; border: 2px solid var(--v-primary-base)"
          >
            <div class="content-label">{{ itemContent.label }}</div>
            <div class="btn-setting">
              <v-icon @click="$emit('content-active', itemContent)">
                mdi-cog-outline
              </v-icon>
            </div>
            <div class="icon-move" transfer-data="itemContent">
              <v-icon
                small
                color="white"
                class="arrow-up"
                @click="$emit('up-move', itemContent, indexCol, indexContent)"
              >
                mdi-arrow-up-bold
              </v-icon>
              <v-icon
                small
                color="white"
                class="arrow-down"
                @click="$emit('down-move', itemContent, indexCol, indexContent)"
              >
                mdi-arrow-down-bold
              </v-icon>
            </div>
          </v-overlay>
        </v-fade-transition>
        <div style="background-color: transparent">
          <div v-if="itemContent.type === 'itemSpacer'">
            <div :style="itemContent.style">
              <div :style="itemContent.spacer.style">&nbsp;</div>
            </div>
          </div>
          <div
            v-if="itemContent.type === 'itemParagraph'"
            :style="itemContent.style"
          >
            <div
              :style="itemContent.paragraph.style"
              v-html="itemContent.paragraph.content"
            ></div>
          </div>
          <div
            v-if="itemContent.type === 'itemButton'"
            :id="itemContent.id"
            :style="itemContent.style"
          >
            <div :style="itemContent.button.style">
              {{ itemContent.button.text }}
            </div>
          </div>
          <div
            v-if="itemContent.type === 'itemDivider'"
            :style="itemContent.style"
          >
            <div :style="itemContent.divider.style"></div>
          </div>
          <div
            v-if="itemContent.type === 'itemImage'"
            style="line-height: 0"
            :style="itemContent.style"
          >
            <img
              v-if="itemContent.src !== ''"
              :style="itemContent.image.style"
              :src="itemContent.src"
            />
            <div
              v-else
              class="mt-4 d-flex flex-column justify-center"
              style="
                border: 1px dashed var(--v-primary-base);
                background: rgba(222, 242, 250, 0.85);
              "
            >
              <v-icon x-large color="primary"> mdi-file-image-plus </v-icon>
              <div class="py-4 h6 primary--text">SELECCIONE IMAGEN</div>
            </div>
          </div>
          <div
            v-if="itemContent.type === 'itemVideo'"
            :style="itemContent.style"
          >
            <div v-if="itemContent.src !== ''" style="line-height: 0">
              <img :style="itemContent.video.style" :src="itemContent.src" />
              <div class="StageModuleVideo">
                <div class="StageModuleVideo-1sfIa"></div>
                <img alt="" :src="itemContent.icon.src" width="65" />
              </div>
            </div>
            <div
              v-else
              class="mt-4 d-flex flex-column justify-center"
              style="
                border: 1px dashed var(--v-primary-base);
                background: rgba(222, 242, 250, 0.85);
              "
            >
              <v-icon x-large color="primary"> mdi-file-image-plus </v-icon>
              <div class="py-4 h6 primary--text">SELECCIONE VIDEO</div>
            </div>
          </div>
          <div
            v-if="itemContent.type === 'itemSocial'"
            :style="itemContent.style"
          >
            <span
              v-for="(item, index) in itemContent.social"
              :key="index"
              :style="item.style"
            >
              <img
                :src="item.src"
                :title="item.label"
                width="32px"
                height="32px"
                :href="item.url"
              />
            </span>
          </div>
          <div v-if="itemContent.type === 'itemHTML'">
            <div v-html="itemContent.code"></div>
          </div>
        </div>
      </div>
    </template>
  </v-hover>
</template>

<script>
export default {
  props: {
    itemContent: {
      type: Object,
      default: () => ({}),
    },
    indexCol: {
      type: Number,
      default: 0,
    },
    indexContent: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
.content-active {
  border: 2px solid var(--v-primary-base);
  background-color: #e6e0e9 !important;
}
.content-label {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
  -ms-flex-align: center;
  justify-content: center;
  -ms-flex-pack: center;
  position: absolute;
  top: -22px;
  right: 0;
  padding: 3px 5px;
  width: 75px;
  color: #fff;
  font-size: 10px;
  text-align: center;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 1px 1px 0 0;
  background-color: var(--v-primary-base);
  pointer-events: none;
  z-index: 8;
}
.icon-move {
  display: flex;
  flex-direction: column;
  align-content: space-around;
  position: absolute;
  left: 0;
  top: 0;
  cursor: -webkit-grab;
  cursor: grab;
  z-index: 3;
}
.icon-move .arrow-down {
  padding: 0 2px;
  border-top: 1px solid white;
  border-bottom-right-radius: 10px;
  background: var(--v-primary-base);
}
.icon-move .arrow-up {
  padding: 0 4px;
  background: var(--v-primary-base);
}
.icon-move .arrow-up:hover {
  background-color: rgba(95, 196, 236, 0.62);
}
.icon-move .arrow-down:hover {
  background-color: rgba(95, 196, 236, 0.62);
}
.btn-setting {
  display: inline-block;
  position: absolute;
  background: var(--v-primary-base);
  top: 0;
  right: 0;
  padding: 0 8px;
  z-index: 4;
  line-height: 30px;
}
.btn-setting:hover {
  background-color: #5db7ca;
}
.StageModuleVideo {
  position: absolute;
  white-space: nowrap;
  vertical-align: middle;
  text-align: left;
  line-height: 100% !important;
  left: 50%;
  top: 0;
  bottom: 0;
}
.StageModuleVideo-1sfIa {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.StageModuleVideo > img {
  margin-left: -50%;
  display: inline-block;
  vertical-align: middle;
}
.over-active:hover {
  min-height: 50px;
}
</style>
