<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <div
        :class="row.active ? 'row-active' : ''"
        :style="`background-color: ${stageContainer.style.backgroundColor}`"
      >
        <v-fade-transition>
          <v-overlay
            v-if="hover"
            absolute
            color="#E6E0E9"
            style="
              margin-left: 16px;
              margin-right: 16px;
              display: block;
              border: 2px solid var(--v-primary-base);
            "
          >
            <div class="row-label">Fila</div>
            <div class="btn-setting">
              <v-icon @click="$emit('row-active', row)">
                mdi-cog-outline
              </v-icon>
            </div>
            <div class="icon-move">
              <v-icon
                small
                color="white"
                class="arrow-up"
                @click="$emit('up-move', row)"
              >
                mdi-arrow-up-bold
              </v-icon>
              <v-icon
                small
                color="white"
                class="arrow-down"
                @click="$emit('down-move', row)"
              >
                mdi-arrow-down-bold
              </v-icon>
            </div>
          </v-overlay>
        </v-fade-transition>
        <div
          class="row-content"
          :style="`background-color:${row.style.backgroundColor}`"
        >
          <div :style="row.style">
            <div
              v-for="(col, indexC) in row.stageColumns"
              :key="indexC"
              :style="col.style"
              :class="activaRowClass ? 'activa-row' : ''"
            >
              <div
                v-if="col.presentation"
                class="presentation"
                style="max-height: 99.77px"
              >
                <div style="height: 100%">
                  <div class="module-empty d-flex flex-column">
                    <v-icon color="primary">mdi-arrow-up-bold-circle</v-icon>
                    Coloque bloques de contenido aquí
                  </div>
                </div>
              </div>
              <div
                v-for="(item, indexCc) in col.content"
                :key="indexCc"
                style="position: relative; z-index: 100"
              >
                <col-content
                  :item-content="item"
                  :index-col="indexC"
                  :index-content="indexCc"
                  @content-active="contentSelect"
                  @up-move="upMove"
                  @down-move="downMove"
                />
              </div>
              <drop
                v-show="activoCol"
                class="drop-col"
                :class="col.over ? 'over' : ''"
                @drop="$emit('handle-col-drop', row, col, ...arguments)"
                @dragover="col.over = true"
                @dragleave="col.over = false"
                @dragend="$emit('col-drag-end')"
              >
                <div>Arrástralo aquí</div>
              </drop>
            </div>
          </div>
        </div>
        <ul
          class="stageRow-actions pl-0"
          :style="row.active ? 'display:inline-block' : ''"
        >
          <li>
            <v-icon
              color="white"
              style="vertical-align: middle"
              @click="$emit('delete-row', row)"
            >
              mdi-trash-can-outline
            </v-icon>
          </li>
          <li>
            <v-icon
              color="white"
              style="vertical-align: middle"
              @click="$emit('clone-active', row)"
            >
              mdi-text-box-multiple-outline
            </v-icon>
          </li>
        </ul>
      </div>
    </template>
  </v-hover>
</template>

<script>
import { Drop } from 'vue-drag-drop'
import ColContent from '@/components/modules/draggable/ColContent.vue'

export default {
  components: {
    drop: Drop,
    ColContent,
  },
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    stageContainer: {
      type: Object,
      default: () => ({}),
    },
    activoCol: {
      type: Boolean,
      default: false,
    },
    activaRowClass: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      overlay: false,
    }
  },
  methods: {
    changeCapital(text) {
      let txtReturn = ''
      for (let i = 0; i < text.length; i += 1) {
        const letra = text.charAt(i)
        txtReturn +=
          letra.toUpperCase() === letra ? `-${letra.toLowerCase()}` : letra
      }
      return txtReturn
    },
    contentSelect(item) {
      this.$emit('content-active', item)
    },
    upMove(itemContent, indexCol, indexContent) {
      if (indexContent !== 0) {
        const newContent = []
        const selectCol = this.row.stageColumns[indexCol]
        selectCol.content.forEach((item, index) => {
          if (index !== indexContent) {
            if (index !== indexContent - 1) {
              newContent.push(item)
            } else {
              newContent.push(itemContent)
              newContent.push(item)
            }
          }
        })
        selectCol.content = newContent
      }
    },
    downMove(itemContent, indexCol, indexContent) {
      const selectCol = this.row.stageColumns[indexCol]
      if (indexContent !== selectCol.content.length - 1) {
        const newContent = []
        selectCol.content.forEach((item, index) => {
          if (index !== indexContent) {
            if (index !== indexContent + 1) {
              newContent.push(item)
            } else {
              newContent.push(item)
              newContent.push(itemContent)
            }
          }
        })
        selectCol.content = newContent
      }
    },
  },
}
</script>
<style scoped>
.row-label {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
  -ms-flex-align: center;
  justify-content: center;
  -ms-flex-pack: center;
  position: absolute;
  top: -22px;
  right: 15px;
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
.row-active {
  border: 2px solid var(--v-primary-base);
  background-color: #e6e0e9 !important;
}
.row-content {
  position: relative;
}
.presentation {
  height: 100%;
  position: relative;
  outline: none;
  z-index: 2;
}
.module-empty {
  text-align: center;
  background: var(--v-lightcyan-base);
  outline: 1px dashed var(--v-primary-base);
  outline-offset: -1px;
  min-height: 75px;
  word-break: break-word;
  padding: 20px 20px 15px 20px;
  position: relative;
  height: 100%;
  font-size: 13px;
  color: var(--v-primary-base);
  overflow: hidden;
  text-overflow: ellipsis;
}
.stageRow-actions {
  display: none;
  position: absolute;
  list-style: none;
  height: 30px;
  margin: 0;
  padding: 0;
  -webkit-box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
  box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
  background-color: var(--v-primary-base);
  right: 59px;
  top: 2px;
  z-index: 7;
}
.stageRow-actions li {
  display: inline-block;
  cursor: pointer;
  border-right: 1px solid #e8eaf6;
  background-color: var(--v-primary-base);
  padding: 0 8px;
  line-height: 30px;
}
.stageRow-actions li:hover {
  background-color: #5db7ca;
}
.stageRow-actions li:last-child {
  border: none !important;
}
.drop-col {
  height: 8px;
  z-index: 100;
  position: relative;
  width: 100%;
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
}
.over {
  height: 8px;
}
.drop-col.over {
  background-color: var(--v-primary-base);
}
.drop-col.over div {
  display: block;
}
.activa-row {
  border: 1px dashed var(--v-gray300-base) !important;
  margin-top: 8px;
}
</style>
