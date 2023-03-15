<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      fullscreen
      hide-overlay
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="container">
        <v-toolbar>
          <div>
            <v-btn text color="primary" @click="exitModelDatabase()">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              VOLVER
            </v-btn>
          </div>
          <v-divider vertical class="px-2"></v-divider>
          <v-btn icon color="primary" @click="viewHtml()">
            <v-icon>mdi-file-find</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-spacer></v-spacer>
          <v-toolbar-title>Diseño de emails</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="ma-2 white--text"
            :class="{ 'change-btn': changesMade }"
            @click="recordChanges()"
          >
            Guardar
            <v-icon right> mdi-cloud-upload </v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid class="px-0 py-0">
          <v-navigation-drawer
            v-model="rightDrawer"
            absolute
            right
            width="390"
            class="right-column-setting"
            style="z-index: 10; overflow-y: hidden"
          >
            <v-app-bar color="lightcyan accent-4" dense>
              <v-toolbar-title>{{ labelHead }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon color="primary">
                <v-icon @click="cloneActive('active')">
                  mdi-text-box-multiple-outline
                </v-icon>
              </v-btn>
              <v-btn icon color="secondary">
                <v-icon @click="deleteActive('active')">mdi-delete</v-icon>
              </v-btn>
              <v-btn icon color="gray300" @click="closeSetting()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <div class="contenido">
              <row-setting
                v-if="rowSelection"
                :row-selection="rowSelection"
                :col-selection="colSelection"
                :total-columns="totalColumns"
                @add-width-l="addWidthL"
                @add-width-r="addWidthR"
                @add-column="addColumn()"
                @delete-column="deleteColumn"
                @select-column="selectColumn"
              />
              <spacer-setting
                v-if="
                  contentSelection && contentSelection.type === 'itemSpacer'
                "
                :spacer-selection="contentSelection"
              />
              <paragraph-setting
                v-if="
                  contentSelection && contentSelection.type === 'itemParagraph'
                "
                :paragraph-selection="contentSelection"
              />
              <button-setting
                v-if="
                  contentSelection && contentSelection.type === 'itemButton'
                "
                :button-selection="contentSelection"
              />
              <divider-setting
                v-if="
                  contentSelection && contentSelection.type === 'itemDivider'
                "
                :divider-selection="contentSelection"
              />
              <image-setting
                v-if="contentSelection && contentSelection.type === 'itemImage'"
                :image-selection="contentSelection"
                :client-id="clientId"
              />
              <video-setting
                v-if="contentSelection && contentSelection.type === 'itemVideo'"
                :video-selection="contentSelection"
              />
              <social-setting
                v-if="
                  contentSelection && contentSelection.type === 'itemSocial'
                "
                :social-selection="contentSelection"
              />
              <code-setting
                v-if="contentSelection && contentSelection.type === 'itemHTML'"
                :html-selection="contentSelection"
              />
            </div>
          </v-navigation-drawer>
          <div class="d-flex">
            <div class="all-screen">
              <div style="position: relative; width: 100%; height: 100%">
                <div class="stageInner">
                  <div>
                    <div
                      v-for="(row, index) in stageContainer.rowContainer"
                      :key="index"
                      class="StageRow_row"
                      :class="activaRowClass ? 'activa-row' : ''"
                    >
                      <row-component
                        :row="row"
                        :stage-container="stageContainer"
                        :activo-col="activoCol"
                        :activa-row-class="activaRowClass"
                        @row-active="rowActive"
                        @content-active="contentActive"
                        @delete-row="deleteActive"
                        @handle-col-drop="handleColDrop"
                        @col-drag-end="colDragEnd()"
                        @up-move="upMove"
                        @down-move="downMove"
                        @clone-active="cloneActive"
                      />
                      <drop
                        v-show="activaRow"
                        class="drop"
                        :class="row.over ? 'over' : ''"
                        @drop="handleDrop(row, ...arguments)"
                        @dragover="row.over = true"
                        @dragleave="row.over = false"
                      >
                        <div>Arrástralo aquí</div>
                      </drop>
                    </div>
                  </div>
                </div>
                <div class="Draggable-Sidebar"></div>
              </div>
            </div>
            <div class="menu-screen">
              <v-tabs v-model="tab">
                <v-tab class="caption" @click="tabChange()">
                  <v-icon>mdi-ballot-outline</v-icon>
                  CONTENIDO
                </v-tab>
                <v-tab class="caption">
                  <v-icon>mdi-land-rows-horizontal</v-icon>
                  FILAS
                </v-tab>
                <v-tab class="caption">
                  <v-icon>mdi-cog-outline</v-icon>
                  CONFIGURE
                </v-tab>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <div class="px-4 pt-6">
                      <v-row>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemParagraph"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-text-long</v-icon
                              >
                              <div class="text-center">PÁRRAFO</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemSpacer"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-arrow-expand-vertical</v-icon
                              >
                              <div class="text-center">ESPACIO</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemButton"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-gesture-tap-button</v-icon
                              >
                              <div class="text-center">BOTÓN</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemDivider"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-border-horizontal</v-icon
                              >
                              <div class="text-center">DIVIDIR</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemImagen"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-file-image-plus</v-icon
                              >
                              <div class="text-center">IMAGEN</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemSocial"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-account-supervisor-circle</v-icon
                              >
                              <div class="text-center">SOCIAL</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemVideo"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-youtube-subscription</v-icon
                              >
                              <div class="text-center">VIDEO</div>
                            </v-card>
                          </drag>
                        </v-col>
                        <v-col cols="4 my-2">
                          <drag
                            transfer-data="itemHTML"
                            @dragstart="activo()"
                            @dragend="colDragEnd()"
                          >
                            <v-card
                              outlined
                              class="d-flex flex-column justify-center py-2 content-style"
                            >
                              <v-icon large color="primary"
                                >mdi-file-code-outline</v-icon
                              >
                              <div class="text-center">HTML</div>
                            </v-card>
                          </drag>
                        </v-col>
                      </v-row>
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <div class="px-4 pt-6 content-row">
                      <drag
                        v-for="(row, index) in newRow"
                        :key="index"
                        class="new_row"
                        :transfer-data="row"
                        @dragstart="activoRow()"
                        @dragend="colDragEnd()"
                      >
                        <div
                          v-for="(col, indexC) in row.stageColumns"
                          :key="indexC"
                          :style="col.style"
                        ></div>
                      </drag>
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <div class="px-4 pt-6">
                      <div class="font-weight-medium">Opciones generales</div>
                      <div class="caption mt-6">
                        Ancho del área de contenido
                      </div>
                      <v-slider
                        v-model="stageContainer.style.width"
                        hide-details
                        min="480"
                        max="900"
                        thumb-label
                      >
                        <template v-slot:append>
                          <span class="caption"
                            >{{ stageContainer.style.width }}px</span
                          >
                        </template>
                      </v-slider>
                    </div>
                    <v-divider></v-divider>
                    <div class="px-4 py-6 d-flex justify-space-between">
                      <div class="caption">
                        Alineación del área de contenido
                      </div>
                      <div>
                        <v-btn-toggle v-model="toggleContent">
                          <v-btn height="25" @click="changeAlignment(0)">
                            <v-icon small>mdi-format-align-left</v-icon>
                          </v-btn>
                          <v-btn height="25" @click="changeAlignment(1)">
                            <v-icon small>mdi-format-align-center</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="pa-4 d-flex justify-space-between align-center">
                      <div class="caption">Color de fondo</div>
                      <div class="pa-1" style="width: 154px">
                        <v-text-field
                          v-model="stageContainer.style.backgroundColor"
                          dense
                          hide-details
                          class="ma-0 pa-0 caption"
                          solo
                        >
                          <template v-slot:append>
                            <v-menu
                              v-model="menuColor"
                              top
                              nudge-bottom="105"
                              nudge-left="16"
                              :close-on-content-click="false"
                            >
                              <template v-slot:activator="{ on }">
                                <div
                                  :style="
                                    swatchStyle(
                                      stageContainer.style.backgroundColor
                                    )
                                  "
                                  v-on="on"
                                ></div>
                              </template>
                              <v-card>
                                <v-card-text class="pa-0">
                                  <v-color-picker
                                    v-model="
                                      stageContainer.style.backgroundColor
                                    "
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
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
    <view-html-dialog
      :show="showViewHtml"
      :html-content="htmlContent"
      @close-dialog="showViewHtml = !showViewHtml"
    />
    <base-dialog
      v-model="changesMadeDialog"
      text-alert="Tienes cambios sin guardar, ¿Estás seguro de salir? "
      primary-btn-text="Sí, Salir"
      @primary-btn-action="exitDraggble()"
    />
  </div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop'
import ViewHtmlDialog from '@/components/modules/draggable/ViewHtmlDialog.vue'
import RowComponent from '@/components/modules/draggable/RowComponent.vue'
import RowSetting from '@/components/modules/draggable/RowSetting.vue'
import SpacerSetting from '@/components/modules/draggable/SpacerSetting.vue'
import ParagraphSetting from '@/components/modules/draggable/ParagraphSetting.vue'
import ButtonSetting from '@/components/modules/draggable/ButtonSetting.vue'
import DividerSetting from '@/components/modules/draggable/DividerSetting.vue'
import ImageSetting from '@/components/modules/draggable/ImageSetting.vue'
import VideoSetting from '@/components/modules/draggable/VideoSetting.vue'
import SocialSetting from '@/components/modules/draggable/SocialSetting.vue'
import CodeSetting from '@/components/modules/draggable/CodeSetting.vue'
import draggableMixin from '@/mixins/services/draggableBffMixin'
import BaseDialog from '@/components/util/BaseDialog.vue'
import html2canvas from 'html2canvas'

export default {
  name: 'DraggableComponent',
  components: {
    drag: Drag,
    drop: Drop,
    ViewHtmlDialog,
    RowComponent,
    RowSetting,
    SpacerSetting,
    ParagraphSetting,
    ButtonSetting,
    DividerSetting,
    ImageSetting,
    VideoSetting,
    SocialSetting,
    CodeSetting,
    BaseDialog,
  },
  mixins: [draggableMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: String,
      default: '',
    },
    templateId: {
      type: Number,
      default: -1,
    },
    stageContainer: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      changesMadeDialog: false,
      changesMade: false,
      showViewHtml: false,
      contentId: 0,
      rowId: 1,
      activaRow: false,
      activaRowClass: false,
      activoCol: false,
      menuTab: true,
      menuColor: false,
      menuColorBack: false,
      menuColorTop: false,
      rightDrawer: false,
      labelHead: '',
      typeHead: '',
      tab: 0,
      toggleContent: 1,
      rowSelection: null,
      colSelection: null,
      contentSelection: null,
      typeSelection: '',
      totalColumns: 0,
      newRow: [
        {
          cols: 1,
          stageColumns: [
            {
              style: {
                width: '100%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '12',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 2,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '30%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '70%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '9',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 2,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '40%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '4',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '60%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '8',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 2,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '50%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '6',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '50%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '6',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 2,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '60%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '8',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '40%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '4',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 2,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '70%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '9',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '30%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 3,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '33.33%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '4',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '33.33%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '4',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '33.34%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '4',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 3,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '60%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '6',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 3,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '60%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '6',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 3,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '60%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '6',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '20%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 4,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '25%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '25%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '25%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 4,
              style: {
                width: '25%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '3',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
        {
          cols: 6,
          stageColumns: [
            {
              id: 1,
              style: {
                width: '16.66%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 2,
              style: {
                width: '16.66%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                paddingRight: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 3,
              style: {
                width: '16.66%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 4,
              style: {
                width: '16.66%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 5,
              style: {
                width: '16.66%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
            {
              id: 6,
              style: {
                width: '16.7%',
                backgroundColor: '#e7e7e7',
                paddingTop: '0px',
                paddingRight: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                borderTopStyle: 'solid',
                borderTopWidth: '0',
                borderTopColor: '#e7e7e7',
                borderLeftStyle: 'solid',
                borderLeftWidth: '0',
                borderLeftColor: '#e7e7e7',
                borderRightStyle: 'solid',
                borderRightWidth: '0',
                borderRightColor: '#e7e7e7',
                borderBottomStyle: 'solid',
                borderBottomWidth: '0',
                borderBottomColor: '#e7e7e7',
              },
              col: '2',
              presentation: true,
              activeColumn: false,
              over: false,
              content: [],
            },
          ],
        },
      ],
      htmlContent: '',
    }
  },
  watch: {
    'stageContainer.rowContainer': {
      handler() {
        this.changesMade = true
      },
    },
    'rowSelection.style': {
      handler() {
        this.changesMade = true
      },
    },
    'colSelection.style': {
      handler() {
        this.changesMade = true
      },
    },
    'contentSelection.style': {
      handler() {
        this.changesMade = true
      },
    },
    'stageContainer.style.width': {
      handler() {
        this.changesMade = true
      },
    },
    tab: {
      handler() {
        this.tabChange()
      },
    },
  },
  methods: {
    tabChange() {
      this.rightDrawer = false
      this.disableRows()
    },
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
    changeWidth(value) {
      this.stageContainer.rowContainer.forEach((item) => {
        item.style.width = `${value}px`
        item.style.maxWidth = `${value}px`
      })
    },
    async viewHtml() {
      await this.passHtml()
      this.showViewHtml = true
    },
    disableRows() {
      this.stageContainer.rowContainer.forEach((row) => {
        row.active = false
        if (row.stageColumns.length !== 0) {
          row.stageColumns.forEach((col) => {
            col.content.forEach((content) => {
              content.active = false
            })
          })
        }
      })
    },
    selectColumn(column) {
      this.colSelection = column
    },
    selectActiveCol(valor) {
      this.activoCol = valor
    },
    activo() {
      this.activaRow = false
      this.activoCol = true
      this.activaRowClass = true
    },
    activoRow() {
      this.activaRow = true
      this.activoCol = false
      this.activaRowClass = true
    },
    colDragEnd() {
      this.activoCol = false
      this.activaRow = false
      this.activaRowClass = false
    },
    changeAlignment(value) {
      this.stageContainer.rowContainer.forEach((item) => {
        item.style.margin = value === 1 ? 'auto' : ''
      })
    },
    cloneActive(item) {
      const newRow = []
      if (this.typeHead === 'row') {
        if (item === 'active') {
          item = this.rowSelection
        }
        const itemN = item.id
        this.rowId += 1
        const index = this.stageContainer.rowContainer.findIndex(
          (element) => element.id === itemN
        )
        this.stageContainer.rowContainer.forEach((itemRow, indexR) => {
          let oldItemRow = this.cloneObjet(itemRow)
          if (index !== indexR) {
            newRow.push(oldItemRow)
          } else {
            newRow.push(oldItemRow)
            oldItemRow = this.cloneObjet(itemRow)
            oldItemRow.id = this.rowId
            newRow.push(oldItemRow)
          }
        })
        this.stageContainer.rowContainer = []
        this.stageContainer.rowContainer = newRow
      } else {
        if (item === 'active') {
          item = this.contentSelection
        }
        const itemN = item.id
        this.contentId += 1
        this.stageContainer.rowContainer.forEach((itemRow) => {
          itemRow.stageColumns.forEach((itemCol) => {
            const index = itemCol.content.findIndex(
              (element) => element.id === itemN
            )
            if (index !== -1) {
              itemCol.content.forEach((itemCh, indexCh) => {
                let oldItem = this.cloneObjet(itemCh)
                if (index !== indexCh) {
                  newRow.push(oldItem)
                } else {
                  newRow.push(oldItem)
                  oldItem = this.cloneObjet(oldItem)
                  oldItem.id = this.contentId
                  newRow.push(oldItem)
                }
              })
              itemCol.content = []
              itemCol.content = newRow
            }
          })
        })
      }
      this.rightDrawer = false
      this.disableRows()
    },
    cloneObjet(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj
      }
      const temp = obj.constructor()
      Object.keys(obj).forEach((header) => {
        temp[header] = this.cloneObjet(obj[header])
      })
      return temp
    },
    handleDrop(row, data) {
      row.over = false
      const index = this.stageContainer.rowContainer.findIndex(
        (element) => element === row
      )
      const newRow = this.newItemRow(data)
      if (index + 1 === this.stageContainer.rowContainer.length) {
        this.stageContainer.rowContainer.push(newRow)
      } else {
        const newRows = []
        this.stageContainer.rowContainer.forEach((rowI, i) => {
          newRows.push(rowI)
          if (index === i) {
            newRows.push(newRow)
          }
        })
        this.stageContainer.rowContainer = newRows
      }
      this.stageContainer.rowContainer[index + 1] = newRow
      this.changesMade = true
    },
    deleteColumn(itemCol) {
      if (itemCol.col === '12') {
        this.typeHead = 'row'
        this.deleteActive('active')
      } else {
        const index = this.rowSelection.stageColumns.findIndex(
          (element) => element === itemCol
        )
        let indexItem = 1
        if (index !== 0) {
          indexItem = index - 1
        }
        const col = parseInt(itemCol.col, 10)
        this.rowSelection.stageColumns[indexItem].col = (
          parseInt(this.rowSelection.stageColumns[indexItem].col, 10) + col
        ).toString()
        const width =
          (parseInt(this.rowSelection.stageColumns[indexItem].col, 10) * 100) /
          12
        this.rowSelection.stageColumns[indexItem].style.width = `${width}%`
        this.rowSelection.stageColumns.splice(index, 1)
        this.rowActive(this.rowSelection)
      }
    },
    deleteActive(item) {
      if (this.typeHead === 'row') {
        if (item === 'active') {
          item = this.rowSelection
        }
        const index = this.stageContainer.rowContainer.findIndex(
          (element) => element === item
        )
        this.stageContainer.rowContainer.splice(index, 1)
        if (this.stageContainer.rowContainer.length === 0) {
          const newRow = this.newItemRow(this.newRow[0])
          this.stageContainer.rowContainer.push(newRow)
        }
      } else {
        if (item === 'active') {
          item = this.contentSelection
        }
        this.stageContainer.rowContainer.forEach((itemRow) => {
          itemRow.stageColumns.forEach((itemCol) => {
            if (itemCol.content.length !== 0) {
              const index = itemCol.content.findIndex(
                (element) => element.id === item.id
              )
              if (index !== -1) {
                itemCol.content.splice(index, 1)
                if (itemCol.content.length === 0) {
                  itemCol.presentation = true
                }
              }
            }
          })
        })
      }
      this.disableRows()
      this.rightDrawer = false
    },
    newItemRow(row) {
      const rowTMP = JSON.parse(JSON.stringify(row))
      this.rowId += 1
      const newRow = {
        id: this.rowId,
        style: {
          backgroundColor: this.stageContainer.style.backgroundColor,
          backgroundImage: 'none',
          backgroundPosition: 'left top',
          backgroundRepeat: 'no-repeat',
          color: 'rgb(0, 0, 0)',
          width: `${this.stageContainer.style.width}px`,
          maxWidth: `${this.stageContainer.style.width}px`,
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          borderTopStyle: 'solid',
          borderTopWidth: '0',
          borderTopColor: this.stageContainer.style.backgroundColor,
          borderLeftStyle: 'solid',
          borderLeftWidth: '0',
          borderLeftColor: this.stageContainer.style.backgroundColor,
          borderRightStyle: 'solid',
          borderRightWidth: '0',
          borderRightColor: this.stageContainer.style.backgroundColor,
          borderBottomStyle: 'solid',
          borderBottomWidth: '0',
          borderBottomColor: this.stageContainer.style.backgroundColor,
        },
        active: false,
        over: false,
        stageColumns: [],
      }
      rowTMP.stageColumns.forEach((col, index) => {
        const newCol = {
          id: index + 1,
          style: col.style,
          presentation: true,
          col: col.col,
          activeColumn: false,
          over: false,
          content: [],
        }
        newRow.stageColumns.push(newCol)
      })
      return newRow
    },
    closeSetting() {
      this.rightDrawer = !this.rightDrawer
      if (this.typeHead === 'row') {
        this.rowSelection.active = false
      } else {
        this.contentSelection.active = false
      }
    },
    async rowActive(row) {
      if (row.active) {
        row.active = false
        this.rightDrawer = false
      } else {
        await this.disableRows()
        this.rightDrawer = true
        this.labelHead = 'Propiedades de la fila'
        this.typeHead = 'row'
        this.rowSelection = this.stageContainer.rowContainer.find(
          (element) => element.id === row.id
        )
        this.rowSelection.active = true
        this.totalColumns = row.stageColumns.length
        this.colSelection = null
        this.contentSelection = null
      }
    },
    async contentActive(item) {
      if (item.active) {
        this.rightDrawer = false
      }
      this.rowSelection = null
      this.colSelection = null
      this.contentSelection = null
      await this.disableRows()
      item.active = !item.active
      this.rightDrawer = true
      if (item.label === 'HTML') {
        this.labelHead = `Código ${item.label}`
      } else {
        this.labelHead = `Propiedades de ${item.label}`
      }
      this.typeHead = 'content'
      this.contentSelection = item
    },
    newDivides() {
      this.contentId += 1
      const itemDivider = {
        id: this.contentId,
        type: 'itemDivider',
        label: 'Dividir',
        active: false,
        overMove: false,
        style: {
          width: '100%',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '0px',
          paddingRight: '0px',
          margin: '0 auto 0 auto',
        },
        divider: {
          style: {
            fontSize: '1px',
            lineHeight: '1px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: '#979797',
          },
        },
      }
      return itemDivider
    },
    handleColDrop(row, col, data) {
      col.over = false
      this.activaRow = false
      this.activoCol = false
      if (data === 'itemButton') {
        col.content.push(this.newBoton())
      }
      if (data === 'itemDivider') {
        col.content.push(this.newDivides())
      }
      if (data === 'itemImagen') {
        col.content.push(this.newImage())
      }
      if (data === 'itemSocial') {
        col.content.push(this.newSocial())
      }
      if (data === 'itemParagraph') {
        col.content.push(this.newParagraph())
      }
      if (data === 'itemSpacer') {
        col.content.push(this.newSpacer())
      }
      if (data === 'itemVideo') {
        col.content.push(this.newVideo())
      }
      if (data === 'itemHTML') {
        col.content.push(this.newHTML())
      }
      col.presentation = false
      this.changesMade = true
    },
    addWidthL(col) {
      const cols = parseInt(col.col, 10)
      let index = col.id
      const backColumn = this.rowSelection.stageColumns.find(
        (x) => x.id === col.id - 1
      )
      if (parseInt(backColumn.col, 10) !== 1) {
        col.col = cols + 1
        const widthC = (parseInt(col.col, 10) * 100) / 12
        col.style.width = `${widthC.toString()}%`
        // eslint-disable-next-line no-unused-vars
        index += 1
        backColumn.col -= 1
        backColumn.style.width = `${(
          (parseInt(backColumn.col, 10) * 100) /
          12
        ).toString()}%`
      }
    },
    addWidthR(col) {
      const cols = parseInt(col.col, 10)
      let index = col.id
      const backColumn = this.rowSelection.stageColumns.find(
        (x) => x.id === col.id + 1
      )
      if (parseInt(backColumn.col, 10) !== 1) {
        col.col = cols + 1
        const widthC = (parseInt(col.col, 10) * 100) / 12
        col.style.width = `${widthC.toString()}%`
        // eslint-disable-next-line no-unused-vars
        index += 1
        backColumn.col -= 1
        backColumn.style.width = `${(
          (parseInt(backColumn.col, 10) * 100) /
          12
        ).toString()}%`
      }
    },
    addColumn() {
      const totCol = this.rowSelection.stageColumns.length + 1
      if (totCol < 13) {
        let found = false
        for (
          let i = this.rowSelection.stageColumns.length - 1;
          i >= 0;
          i -= 1
        ) {
          if (!found) {
            found = this.subtraerColumn(i)
          }
        }
      }
      const newCol = {
        id: totCol,
        presentation: true,
        col: '1',
        activeColumn: false,
        style: {
          width: '8.333%',
          backgroundColor: '#e7e7e7',
          paddingTop: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          borderTopStyle: 'solid',
          borderTopWidth: '0',
          borderTopColor: '#e7e7e7',
          borderLeftStyle: 'solid',
          borderLeftWidth: '0',
          borderLeftColor: '#e7e7e7',
          borderRightStyle: 'solid',
          borderRightWidth: '0',
          borderRightColor: '#e7e7e7',
          borderBottomStyle: 'solid',
          borderBottomWidth: '0',
          borderBottomColor: '#e7e7e7',
        },
        content: [],
      }
      this.rowSelection.stageColumns.push(newCol)
      this.rowSelection.active = false
      this.rowActive(this.rowSelection)
    },
    newHTML() {
      this.contentId += 1
      const itemHTML = {
        id: this.contentId,
        type: 'itemHTML',
        label: 'HTML',
        active: false,
        overMove: false,
        code: '<div>Nuevo bloque HTML.</div>',
      }
      return itemHTML
    },
    newImage() {
      this.contentId += 1
      const itemImage = {
        id: this.contentId,
        type: 'itemImage',
        label: 'Imagen',
        active: false,
        overMove: false,
        src: '',
        alt: '',
        title: '',
        link: {
          type: 'web',
          href: '',
          mailTo: '',
          subject: '',
          body: '',
          message: '',
        },
        style: {
          width: '100%',
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingRight: '0px',
          paddingLeft: '0px',
          textAlign: 'center',
        },
        image: {
          style: {
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            border: 0,
          },
        },
      }
      return itemImage
    },
    newVideo() {
      this.contentId += 1
      const itemVideo = {
        id: this.contentId,
        type: 'itemVideo',
        label: 'Video',
        active: false,
        overMove: false,
        src: '',
        alt: '',
        title: '',
        href: '',
        style: {
          width: '100%',
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingRight: '0px',
          paddingLeft: '0px',
          textAlign: 'center',
        },
        video: {
          style: {
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            border: 0,
          },
        },
        icon: {
          type: 'Redondo sólido',
          color: 'Blanco',
          src: 'https://app-rsrc.getbee.io/public/resources/components/widgetBar/video-content-icon-sets/light/type-01.png',
        },
      }
      return itemVideo
    },
    newSocial() {
      this.contentId += 1
      const itemSocial = {
        id: this.contentId,
        type: 'itemSocial',
        label: 'Sociales',
        active: false,
        overMove: false,
        socialId: 1,
        style: {
          textAlign: 'center',
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingRight: '0px',
          paddingLeft: '0px',
        },
        social: [
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png',
            url: 'https://www.facebook.com/',
            label: 'Facebook',
            title: 'Facebook',
            alt: 'Facebook',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png',
            url: 'https://instagram.com/',
            label: 'Instagram',
            title: 'Instagram',
            alt: 'Instagram',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png',
            url: 'https://twitter.com/',
            label: 'Twitter',
            title: 'Twitter',
            alt: 'Twitter',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/youtube@2x.png',
            url: 'https://www.youtube.com/',
            label: 'YouTube',
            title: 'YouTube',
            alt: 'YouTube',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/tiktok@2x.png',
            url: 'https://www.tiktok.com',
            label: 'TikTok',
            title: 'TikTok',
            alt: 'TikTok',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
          {
            over: false,
            more: false,
            src: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png',
            url: 'https://www.linkedin.com/',
            label: 'Linkedin',
            title: 'TikTok',
            alt: 'Linkedin',
            style: {
              paddingTop: '0px',
              paddingBottom: '0px',
              paddingRight: '1.5px',
              paddingLeft: '1.5px',
            },
          },
        ],
      }
      return itemSocial
    },
    newParagraph() {
      this.contentId += 1
      const itemParagraph = {
        id: this.contentId,
        type: 'itemParagraph',
        label: 'Párrafo',
        active: false,
        overMove: false,
        style: {
          width: '100%',
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
        },
        paragraph: {
          content: '<p>Bloque de párrafo nuevo.</p>',
          style: {
            fontSize: '14px',
            fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif",
            lineHeight: '1',
            textAlign: 'left',
            letterSpacing: '0px',
          },
        },
      }
      return itemParagraph
    },
    newSpacer() {
      this.contentId += 1
      const itemSpacer = {
        id: this.contentId,
        type: 'itemSpacer',
        label: 'Espacio',
        active: false,
        overMove: false,
        style: {
          width: '100%',
          paddingTop: '55px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          backgroundColor: 'transparent',
        },
        height: 60,
        spacer: {
          style: {
            fontSize: '5px',
            lineHeight: '1',
          },
        },
      }
      return itemSpacer
    },
    newBoton() {
      this.contentId += 1
      const itemButton = {
        id: this.contentId,
        type: 'itemButton',
        label: 'Botón',
        active: false,
        overMove: false,
        link: {
          type: 'web',
          href: '',
          mailTo: '',
          subject: '',
          body: '',
          message: '',
        },
        style: {
          width: '100%',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '0px',
          paddingRight: '0px',
          textAlign: 'center',
        },
        button: {
          style: {
            fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            backgroundColor: '#0093b1',
            borderRadius: '4px',
            borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: '#e7e7e7',
            color: '#FFFFFF',
            lineHeight: 2,
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: '20px',
            paddingRight: '20px',
            width: 'auto',
            maxWidth: '100%',
            display: 'inline-block',
            textAlign: 'center',
            letterSpacing: '0px',
          },
          text: 'Botón',
          width: '76.86px',
          height: '38px',
        },
      }
      return itemButton
    },
    subtraerColumn(col) {
      if (this.rowSelection.stageColumns[col].col >= 2) {
        this.rowSelection.stageColumns[col].col -= 1
        this.rowSelection.stageColumns[col].style.width = `${(
          (col.col * 100) /
          12
        ).toString()}%`
        return true
      }
      return false
    },
    putBotton(content) {
      let txtContent = `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;width:100%;"><tr>`
      txtContent += `<td align="center" role="presentation" style="cursor:auto;mso-padding-alt:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};" valign="middle">`
      txtContent += `<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr>`
      txtContent += `<td align="center" bgcolor="${content.button.style.backgroundColor}" role="presentation" style="border:${content.button.style.borderWidth} ${content.button.style.borderStyle} ${content.button.style.borderColor};border-radius:${content.button.style.borderRadius};cursor:auto;mso-padding-alt:${content.button.style.paddingTop} ${content.button.style.paddingRight} ${content.button.style.paddingBottom} ${content.button.style.paddingLeft};background:${content.button.style.backgroundColor};padding:${content.button.style.paddingTop} ${content.button.style.paddingRight} ${content.button.style.paddingBottom} ${content.button.style.paddingLeft};" valign="middle">`
      let paso = false
      if (content.link.type === 'web') {
        if (content.link.href !== '') {
          paso = true
          txtContent += `<a href="${content.link.href}" target="_blank" style="`
        }
      } else if (content.link.type === 'call') {
        if (content.link.mailTo !== '') {
          paso = true
          txtContent += `<a href="tel:${content.link.mailTo}" target="_blank" style="`
        }
      } else if (content.link.type === 'email') {
        if (content.link.mailTo !== '') {
          paso = true
          const subjet = content.link.subject.replace(/\s/g, '%20')
          const body = content.link.body.replace(/\s/g, '%20')
          txtContent += `<a href="mailto:${content.link.mailTo}?subject=${subjet}&body=${body}" target="_blank" style="`
        }
      }
      if (!paso) {
        txtContent += `<div style="`
      }
      txtContent += `display:inline-block;background-color:${content.button.style.backgroundColor};font-family:${content.button.style.fontFamily};font-size:${content.button.style.fontSize};font-weight:${content.button.style.fontWeight};text-align:${content.button.style.textAlign};margin:0;text-decoration:none;text-transform:none;padding-top:${content.button.style.paddingTop};padding-bottom:${content.button.style.paddingBottom};mso-padding-alt:0px;color:${content.button.style.color};width:${content.button.width} !important;border-radius:${content.button.style.borderRadius};">`
      txtContent += `${content.button.text}`
      if (paso) {
        txtContent += `</a>`
      } else {
        txtContent += `</div>`
      }
      txtContent += `</td></tr></table></td></tr></table>`
      return txtContent
    },
    putSplit(content) {
      let txtContent = `<table align="center" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="vertical-align:middle;"><tbody><tr>`
      txtContent += `<td align="center" style="padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};">`
      txtContent += `<table align="center" width="${content.style.width}" border="0" cellpadding="10" cellspacing="0" role="presentation" style="vertical-align:middle;"><tbody><tr>`
      txtContent += `<td align="center" style="padding:0;font-size:0px;line-height:0px;word-break:break-word;">`
      txtContent += `<p style="border-top:${content.divider.style.borderTopWidth} ${content.divider.style.borderTopStyle} ${content.divider.style.borderTopColor};font-size:1px;margin:0px auto;width:100%;">`
      txtContent += `</p></td></tr></tbody></table></td></tr></tbody></table>`
      return txtContent
    },
    putImage(content) {
      let txtContent = `<table align="center" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="vertical-align:middle;"><tbody><tr>`
      txtContent += `<td align="${content.style.textAlign}" style="line-height:0;font-size:0px;padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};word-break:break-word;">`
      let paso = false
      if (content.link.type === 'web') {
        if (content.link.href !== '') {
          paso = true
          txtContent += `<a href="${content.link.href}" target="_blank" style="text-decoration:none;text-transform:none;`
        }
      } else if (content.link.type === 'call') {
        if (content.link.mailTo !== '') {
          paso = true
          txtContent += `<a href="tel:${content.link.mailTo}" target="_blank" style="text-decoration:none;text-transform:none;`
        }
      } else if (content.link.type === 'email') {
        if (content.link.mailTo !== '') {
          paso = true
          const subjet = content.link.subject.replace(/\s/g, '%20')
          const body = content.link.body.replace(/\s/g, '%20')
          txtContent += `<a href="mailto:${content.link.mailTo}?subject=${subjet}&body=${body}" target="_blank" style="text-decoration:none;text-transform:none;`
        }
      }
      if (!paso) {
        txtContent += `<div style="`
      }
      txtContent += `display:inline-block;">`
      txtContent += `<img src="${content.src}" style="display: block; height: auto; border: 0; width: ${content.image.style.width}; max-width: 100%;"  
      alt="${content.alt}" title="${content.title}">`
      if (paso) {
        txtContent += `</a>`
      } else {
        txtContent += `</div>`
      }
      txtContent += `</td></tr></tbody></table>`
      return txtContent
    },
    putVideo(content) {
      let txtContent = `<table align="center" width="${content.style.width}" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;width:${content.style.width};"><tr>`
      txtContent += `<td align="center" role="presentation" style="cursor:auto;mso-padding-alt:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};" valign="middle">`
      txtContent += `<table align="center" background="${content.src}" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:url(${content.src}) center top / cover no-repeat;background-position:center top;background-repeat:no-repeat;background-size:cover;width:100%;"><tbody><tr>`
      txtContent += `<td style="padding:0;">`
      txtContent += `<!--[if mso | IE]><v:rect style="mso-width-percent:1000;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0, -0.5" position="0, -0.5" src="${content.src}" type="frame" size="1,1" aspect="atleast" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:100%;" width="100%" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->`
      txtContent += `<div style="margin:0px auto;max-width:100%;">`
      txtContent += `<div style="line-height:0;font-size:0;">`
      txtContent += `<table width="100%" border="0" cellpadding="10" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody><tr style="box-sizing: content-box;">
      <td style="line-height:0;padding-top:${content.style.paddingTop};padding-right:${content.style.paddingRight};padding-bottom:${content.style.paddingBottom};
      padding-left:${content.style.paddingLeft};" width="${content.style.width}">
      <!--[if (mso)|(IE)]><table width="${this.stageContainer.style.width}" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="line-height:0"><![endif]-->
      <div align="center" style="box-sizing: content-box; max-width: ${this.stageContainer.style.width}px; min-width: 320px;">
      <!--[if !vml]><!-->
      <a href="${content.href}" target="_blank" title="${content.title}" style="box-sizing: content-box; background-color: #5b5f66; 
      background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;">
      <div style="box-sizing: content-box;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" background="${content.src}" role="presentation" 
      style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: content-box; background-image: url(${content.src}); 
      background-size: cover; min-height: 180px; min-width: 320px;">
      <tbody><tr style="box-sizing: content-box;">
      <td width="25%" style="box-sizing: content-box;">
      <img src="https://app-rsrc.getbee.io/public/resources/multiparser/video_block/video_ratio_16-9.gif" alt="ratio" width="100%" border="0" 
      style="display: block; box-sizing: content-box; height: auto; opacity: 0; visibility: hidden;"></td>
      <td width="50%" align="center" valign="middle" style="box-sizing: content-box; vertical-align: middle;">
      <img src="${content.icon.src}" width="65" height="65" style="display: block; height: auto; box-sizing: content-box;"></td>
      <td width="25%" style="box-sizing: content-box;">&nbsp;</td></tr></tbody></table></div></a>
      <!--<![endif]-->
      <!--[if vml]>
      <v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="${this.stageContainer.style.width},281" coordorigin="0,0" href="${content.href}" style="width:${this.stageContainer.style.width}px;height:281px;">
      <v:rect fill="t" stroked="f" style="position:absolute;width:${this.stageContainer.style.width};height:281;">
      <v:fill src="${content.icon.src}" type="frame"/>
      </v:rect>
      <v:oval fill="t" strokecolor="#ffffff" strokeweight="3px" style="position:absolute;left:218;top:108;width:65;height:65">
      <v:fill color="#ffffff" opacity="100%" />
      </v:oval>
      <v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:241;top:124;width:23;height:33;" />
      </v:group>
      <![endif]--></div><!--[if (mso)|(IE)]></td></tr></table><![endif]-->`
      txtContent += `</td></tr></tbody></table>`
      txtContent += `</div></div><!--[if mso | IE]></td></tr></table></v:textbox></v:rect><![endif]--></td></tr></tbody></table></td></tr></table>`
      return txtContent
    },
    putSpacer(content) {
      let txtContent = `<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;vertical-align:top;"><tbody><tr>`
      txtContent += `<td style="padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};font-size:${content.spacer.style.fontSize};line-height:${content.spacer.style.lineHeight};">&nbsp;`
      txtContent += `</td></tr></tbody></table>`
      return txtContent
    },
    putParagraph(content) {
      let txtContent = `<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;vertical-align:top;"><tbody><tr>`
      txtContent += `<td align="${content.paragraph.style.textAlign}" style="padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};">`
      txtContent += `<div style="font-family:${content.paragraph.style.fontFamily};font-size:${content.paragraph.style.fontSize};font-weight:${content.paragraph.style.fontWeight};line-height:${content.paragraph.style.lineHeight};letter-spacin:${content.paragraph.style.letterSpacin};color:${content.paragraph.style.color};text-align:${content.paragraph.style.textAlign};">${content.paragraph.content}</div>`
      txtContent += `</td></tr></tbody></table>`
      return txtContent
    },
    putSocial(content) {
      const totWidth =
        (32 +
          parseFloat(content.social[0].style.paddingLeft.replace('px', '')) +
          parseFloat(content.social[0].style.paddingRight.replace('px', ''))) *
        content.social.length
      let txtContent = `<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;vertical-align:top;"><tbody><tr>`
      txtContent += `<td align="${content.style.textAlign}" style="padding:${content.style.paddingTop} ${content.style.paddingRight} ${content.style.paddingBottom} ${content.style.paddingLeft};">`
      txtContent += `<table width="${totWidth}px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;display:inline-block;"><tbody><tr>`
      content.social.forEach((col) => {
        txtContent += `<td align="center" style="padding:0 ${col.style.paddingRight} 0 ${col.style.paddingLeft};"><a href="${col.url}" target="_blank">`
        txtContent += `<img src="${col.src}" width="32" height="32" alt="${col.alt}" title="${col.title}" style="display:block;height:auto;border:0;"></a></td>`
      })
      txtContent += `</tr></tbody></table></td></tr></tbody></table>`
      return txtContent
    },
    putContent(content) {
      let txtContent = ''
      if (content.type === 'itemButton') {
        txtContent += this.putBotton(content)
      } else if (content.type === 'itemDivider') {
        txtContent += this.putSplit(content)
      } else if (content.type === 'itemImage') {
        txtContent += this.putImage(content)
      } else if (content.type === 'itemVideo') {
        txtContent += this.putVideo(content)
      } else if (content.type === 'itemSpacer') {
        txtContent += this.putSpacer(content)
      } else if (content.type === 'itemParagraph') {
        txtContent += this.putParagraph(content)
      } else if (content.type === 'itemSocial') {
        txtContent += this.putSocial(content)
      } else if (content.type === 'itemHTML') {
        txtContent += this.putHTML(content)
      }
      return txtContent
    },
    putHTML(content) {
      const txtContent = `<div style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;" align="center">${content.code}</div>`
      return txtContent
    },
    passHtml() {
      this.htmlContent = `
      <!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }</style><!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]--><!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]--><style type="text/css">@media only screen and (min-width:480px) {
        .mj-column-per-12 { width:100% !important; max-width: 100%; }
.mj-column-per-11 { width:91.666% !important; max-width: 91.666%; }
.mj-column-per-10 { width:83.333% !important; max-width: 83.333%; }
.mj-column-per-9 { width:75% !important; max-width: 75%; }
.mj-column-per-8 { width:66.666% !important; max-width: 66.666%; }
.mj-column-per-7 { width:58.333% !important; max-width: 58.333%; }
.mj-column-per-6 { width:50% !important; max-width: 50%; }
.mj-column-per-5 { width:41.666% !important; max-width: 41.666%; }
.mj-column-per-4 { width:33.333% !important; max-width: 33.333%; }
.mj-column-per-3 { width:25% !important; max-width: 25%; }
.mj-column-per-2 { width:16.666% !important; max-width: 16.666%; }
.mj-column-per-1 { width:8.333% !important; max-width: 8.333%; }
      }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-12 { width:100% !important; max-width: 100%; }
.mj-column-per-11 { width:91.666% !important; max-width: 91.666%; }
.mj-column-per-10 { width:83.333% !important; max-width: 83.333%; }
.mj-column-per-9 { width:75% !important; max-width: 75%; }
.mj-column-per-8 { width:66.666% !important; max-width: 66.666%; }
.mj-column-per-7 { width:58.333% !important; max-width: 58.333%; }
.mj-column-per-6 { width:50% !important; max-width: 50%; }
.mj-column-per-5 { width:41.666% !important; max-width: 41.666%; }
.mj-column-per-4 { width:33.333% !important; max-width: 33.333%; }
.mj-column-per-3 { width:25% !important; max-width: 25%; }
.mj-column-per-2 { width:16.666% !important; max-width: 16.666%; }
.mj-column-per-1 { width:8.333% !important; max-width: 8.333%; }</style><style type="text/css">@media only screen and (max-width:480px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }</style></head><body style="word-spacing:normal;background-color:${this.stageContainer.style.backgroundColor};"><div style="background-color:${this.stageContainer.style.backgroundColor};">`
      this.stageContainer.rowContainer.forEach((row) => {
        this.htmlContent += `<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:100%;" bgcolor="${row.style.backgroundColor}" width="100%" ><tr><td style="padding:0;line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->`
        this.htmlContent += `<div style="background:${row.style.backgroundColor};background-color:${row.style.backgroundColor};margin:0px auto;max-width:100%;">`
        this.htmlContent += `<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="font-size:0;text-align:center;mso-table-lspace: 0pt; mso-table-rspace: 0pt;background-color:${row.style.backgroundColor};width:100%;max-width:${row.style.maxWidth};color:${row.style.color};margin:${row.style.margin};border-top-style:${row.style.borderTopStyle};border-top-width:${row.style.borderTopWidth};border-top-color:${row.style.borderTopColor};border-left-style:${row.style.borderLeftStyle};border-left-width:${row.style.borderLeftWidth};border-left-color:${row.style.borderLeftColor};border-right-style:${row.style.borderRightStyle};border-right-width:${row.style.borderRightWidth};border-right-color:${row.style.borderRightColor};border-bottom-style:${row.style.borderBottomStyle};border-bottom-width:${row.style.borderBottomWidth};border-bottom-color:${row.style.borderBottomColor};"><tbody><tr><td style="padding:0;direction:ltr;font-size:0px;text-align:center;">`
        this.htmlContent += `<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><![endif]-->`
        row.stageColumns.forEach((col) => {
          const widthCol =
            (parseInt(this.stageContainer.style.width, 10) *
              parseInt(col.col, 10)) /
            12
          this.htmlContent += `<!--[if mso | IE]><td class="" style="vertical-align:top;width:${widthCol}px;" ><![endif]-->`
          this.htmlContent += `<div class="mj-column-per-${col.col} mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">`
          this.htmlContent += `<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;font-size:0;text-align:center;" width="100%"><tbody><tr>`
          this.htmlContent += `<td align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;font-size:0px;text-align:left;vertical-align:top;padding-top:${col.style.paddingTop};padding-bottom:${col.style.paddingBottom};padding-right:${col.style.paddingRight};padding-left:${col.style.paddingLeft};border-top-style:${col.style.borderTopStyle};border-top-width:${col.style.borderTopWidth};border-top-color:${col.style.borderTopColor};border-left-style :${col.style.borderLeftStyle};border-left-width:${col.style.borderLeftWidth};border-left-color:${col.style.borderLeftColor};border-right-style:${col.style.borderRightStyle};border-right-width:${col.style.borderRightWidth};border-right-color:${col.style.borderRightColor};border-bottom-style:${col.style.borderBottomStyle};border-bottom-width:${col.style.borderBottomWidth};border-bottom-color:${col.style.borderBottomColor};background-color:${col.style.backgroundColor};">`
          col.content.forEach((content) => {
            this.htmlContent += this.putContent(content)
          })
          this.htmlContent += `</td></tr></tbody></table></div><!--[if mso | IE]></td><![endif]-->`
        })
        this.htmlContent += `<!--[if mso | IE]></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]-->`
      })
      this.htmlContent += `</div></body></html>`
    },
    downMove(row) {
      const index = this.stageContainer.rowContainer.findIndex(
        (element) => element === row
      )
      if (index !== this.stageContainer.rowContainer.length - 1) {
        const newRows = []
        this.stageContainer.rowContainer.forEach((item, indexR) => {
          if (index !== indexR) {
            if (indexR !== index + 1) {
              newRows.push(item)
            } else {
              newRows.push(item)
              newRows.push(row)
            }
          }
        })
        this.stageContainer.rowContainer = newRows
      }
    },
    upMove(row) {
      const index = this.stageContainer.rowContainer.findIndex(
        (element) => element === row
      )
      if (index !== 0) {
        const newRows = []
        this.stageContainer.rowContainer.forEach((item, indexR) => {
          if (index !== indexR) {
            if (indexR !== index - 1) {
              newRows.push(item)
            } else {
              newRows.push(row)
              newRows.push(item)
            }
          }
        })
        this.stageContainer.rowContainer = newRows
      }
    },
    async recordChanges() {
      await this.passHtml()
      await this.makeImageContent()
      this.changesMade = false
    },
    async makeImageContent() {
      const screenDiv = document.createElement('div')
      screenDiv.style.width = '8.5in'
      screenDiv.id = 'temporal'
      screenDiv.innerHTML = this.htmlContent
      document.body.appendChild(screenDiv)
      const screenTMP = document.getElementById('temporal')
      html2canvas(screenTMP).then((canvas) => {
        this.unloadImage(canvas.toDataURL('image/png'))
      })
    },
    async unloadImage(screenTMP) {
      const newTemplate = {
        clientId: this.clientId,
        templateId: '-1',
        htmlContent: this.htmlContent,
        base64image: screenTMP.replace('data:image/png;base64,', ''),
        imageExtension: 'png',
        stageContainer: this.stageContainer,
      }
      const result = await this.registerNewHtmlTemplate(newTemplate)
      if (result !== null) {
        const newTemplateDef = {
          templateId: result,
          imageContent: newTemplate.base64image,
          imageExtension: 'png',
          htmlContent: this.htmlContent,
          stageContainer: this.stageContainer,
        }
        this.$emit('new-template', newTemplateDef)
      }
    },
    exitModelDatabase() {
      if (this.changesMade) {
        this.changesMadeDialog = true
      } else {
        this.$emit('change-model', false)
      }
    },
    exitDraggble() {
      this.changesMade = false
      this.changesMadeDialog = false
      this.$emit('change-model', false)
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 100%;
  overflow: hidden;
}

.all-screen {
  width: calc(100vw - 390px);
  height: calc(100vh - 64px) !important;
  position: relative;
  background-color: var(--v-gray-base);
  box-shadow: -11px 1px 19px -11px rgb(30 30 60 / 25%) inset;
  overflow-y: auto;
}
.menu-screen {
  border-top: 1px solid var(--v-gray-base);
  width: 390px;
  max-height: calc(100vh - 64px) !important;
  overflow: hidden;
}
.menu-screen .content-row {
  overflow-y: auto;
  max-height: calc(100vh - 112px) !important;
}
.right-column {
  max-height: calc(100vh - 65px) !important;
  top: 65px !important;
  box-shadow: -11px 1px 19px -11px rgba(30, 30, 60, 0.25);
  overflow-y: auto;
}
.right-column-setting {
  margin-top: 113px;
  box-shadow: -11px 1px 19px -11px rgba(30, 30, 60, 0.25);
}
.right-column-setting .contenido {
  max-height: calc(100vh - 141px) !important;
  overflow-y: auto;
}
.stageInner {
  padding: 20px;
  display: inline-block;
  min-width: 100%;
}
.Draggable-Sidebar {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  pointer-events: none;
}
.StageRow_row {
  background-color: transparent;
  background-image: none;
  background-position: left top;
  background-repeat: no-repeat;
  text-align: center;
  outline: none;
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.activa-row {
  border: 1px dashed var(--v-gray300-base);
}
.new_row {
  background: rgba(222, 242, 250, 0.85);
  border-radius: 3px;
  display: flex;
  min-height: 75px;
  margin-bottom: 10px;
  padding: 18px 15px 15px 15px;
  border: #dddddd 1px solid;
  -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
  -webkit-transition-duration: 0.15s;
  -o-transition-duration: 0.15s;
  transition-duration: 0.15s;
  -webkit-transition-property: -webkit-box-shadow;
  transition-property: -webkit-box-shadow;
  -o-transition-property: box-shadow;
  transition-property: box-shadow;
  transition-property: box-shadow, -webkit-box-shadow;
}
.new_row div {
  background: var(--v-lightcyan-base);
  margin: 0 5px;
  outline: 1px dashed var(--v-primary-base);
  border-radius: 3px;
}
.new_row:hover {
  cursor: -webkit-grab;
  cursor: grab;
  border: 1px solid var(--v-primary-base);
  -webkit-box-shadow: 0 0 14px -2px rgba(0, 0, 0, 0.61);
  box-shadow: 0 0 14px -2px rgba(0, 0, 0, 0.61);
}
.content-style:hover {
  -webkit-box-shadow: 0 0 14px -2px rgba(0, 0, 0, 0.61);
  box-shadow: 0 0 14px -2px rgba(0, 0, 0, 0.61);
}
.drop {
  height: 5px;
  z-index: 100;
  position: relative;
}
.drop div {
  background-color: var(--v-primary-base);
  color: white;
  border-radius: 15px;
  padding: 2px 5px;
  margin-left: auto;
  margin-right: auto;
  display: none;
  width: 100px;
  position: absolute;
  top: -10px;
  left: calc((100vw - 375px) / 2);
  font-size: 0.7rem !important;
  font-weight: 400;
}
.drop.over {
  background-color: var(--v-primary-base);
}
.drop.over div {
  display: block;
}
.change-btn {
  animation: changeAnimation 3s ease 0s infinite normal none;
}
@keyframes changeAnimation {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}
</style>
