<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div v-if="startModelDatabase">
        <v-row no-gutters>
          <v-col cols="8">
            <h1>Modelo de base de datos</h1>
            <P class="my-2">
              Aquí podras modelar y configurar bases de datos para tus envíos.
            </P>
            <div class="mt-12">
              <v-img
                class="v-img"
                :src="require('@/assets/databaseModeling.png')"
              />
            </div>
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" @click="goModelDatabase()">
              ir a modelo base de datos
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-dialog
          v-model="dialog"
          persistent
          fullscreen
          hide-overlay
          :retain-focus="false"
          transition="dialog-bottom-transition"
        >
          <v-card class="container">
            <v-toolbar>
              <v-btn text color="primary" @click="exitModelDatabase()">
                <v-icon class="mr-2">mdi-arrow-left</v-icon>
                Volver
              </v-btn>
              <v-spacer></v-spacer>
              <v-toolbar-title>Modelo de base de datos</v-toolbar-title>
              <v-spacer></v-spacer>
              <div class="d-flex flex-column">
                <div class="d-flex align-center">
                  <v-btn
                    outlined
                    color="primary"
                    class="mr-6"
                    @click="saveExitModeling()"
                  >
                    Guardar y salir
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="mr-6"
                    :class="{ 'change-btn': changesMade }"
                    @click="saveModeling()"
                  >
                    Guardar
                  </v-btn>
                </div>
                <div class="mt-1">
                  <v-progress-linear
                    v-if="progressSave"
                    color="primary accent-4"
                    indeterminate
                    rounded
                    height="6"
                  />
                </div>
              </div>
            </v-toolbar>
            <div class="all-screen" style="overflow: hidden">
              <v-container fluid class="px-0 py-0">
                <v-navigation-drawer
                  v-model="leftDrawer"
                  absolute
                  class="left-column"
                >
                  <v-list-item class="pr-0">
                    <div class="d-flex flex-row-reverse" style="width: 100%">
                      <v-icon
                        color="grey"
                        class="pt-1 pr-1"
                        @click="closeLeftColumn()"
                      >
                        mdi-close
                      </v-icon>
                    </div>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-item
                      v-for="item in selectedDatabase.tables"
                      :key="item.id"
                      link
                    >
                      <v-list-item-content
                        :class="{ active: item.active }"
                        class="px-2"
                        @click="elementSelection(item)"
                      >
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-navigation-drawer>
                <v-navigation-drawer
                  v-model="rightDrawer"
                  absolute
                  right
                  width="350"
                  class="right-column"
                >
                  <v-list-item class="pr-0">
                    <div
                      class="d-flex justify-space-between align-center"
                      style="width: 100%"
                    >
                      <div>{{ rightTitle }}</div>
                      <div>
                        <v-tooltip left>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="primary"
                              class="pt-1 pr-1"
                              v-bind="attrs"
                              v-on="on"
                              @click="activateDelete = !activateDelete"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                          <span>Eliminar {{ textDelete }}</span>
                        </v-tooltip>
                        <v-icon
                          color="grey"
                          class="pt-1 pr-1"
                          @click="closeRightColumn()"
                        >
                          mdi-close
                        </v-icon>
                      </div>
                    </div>
                  </v-list-item>
                  <v-divider></v-divider>
                  <div v-if="activateDelete" class="px-6 py-4">
                    <v-sheet outlined color="secondary" rounded>
                      <v-card outlined elevation="0">
                        <v-card-text>
                          <div class="d-flex">
                            <v-icon color="secondary" class="mx-4">
                              mdi-alert-circle
                            </v-icon>
                            ¿Está seguro de eliminar {{ textDelete }}
                          </div>
                        </v-card-text>
                        <v-card-actions class="pt-2">
                          <v-btn
                            text
                            color="primary"
                            @click="activateDelete = !activateDelete"
                          >
                            cancelar
                          </v-btn>
                          <v-btn
                            outlined
                            color="primary"
                            class="mr-6"
                            @click="btnDelete()"
                          >
                            sí, eliminar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-sheet>
                  </div>
                  <div v-if="selectionDatabase" class="px-6 py-4">
                    <div class="mt-2 mb-10">Encabezado</div>
                    <v-text-field
                      v-model="selectionItem.name"
                      label="Nombre"
                      placeholder="Ingresar nombre tabla"
                      dense
                      hide-details
                      type="text"
                      @keyup="keyPress('database')"
                      @change="placeChangesMade()"
                    />
                    <div class="mt-10 d-flex">
                      <div class="mt-4">Color fondo</div>
                      <v-text-field
                        v-model="selectionItem.backgroundColor"
                        filled
                        dense
                        type="color"
                        class="ml-10"
                        :label="selectionItem.backgroundColor"
                        @change="placeChangesMade()"
                      />
                    </div>
                    <div class="mt-4 mb-7">Columnas de base de datos</div>
                    <div>
                      <v-btn
                        outlined
                        block
                        color="primary"
                        class="mb-4"
                        @click="addColumn()"
                      >
                        <v-icon> mdi-plus-circle-outline </v-icon>
                        crear columna
                      </v-btn>
                      <v-btn color="primary" block text @click="importColumn()">
                        importar columnas
                      </v-btn>
                    </div>
                  </div>
                  <div v-if="selectionColumn" class="px-6 py-4">
                    <div class="mt-2 mb-10">
                      <v-text-field
                        v-model="selectionColItem.field"
                        label="Nombre"
                        placeholder="Ingrese nombre"
                        dense
                        outlined
                        class="mb-2"
                        @keyup="keyPress('column')"
                        @change="placeChangesMade()"
                      />
                      <v-select
                        v-model="selectionColItem.type"
                        :items="columnTypeslist"
                        label="Tipo"
                        dense
                        outlined
                        hide-details
                        placeholder="Seleccionar tipo"
                        class="mb-2"
                        @change="placeChangesMade()"
                      />
                      <v-textarea
                        v-model="selectionColItem.comment"
                        rows="2"
                        label="Comentario"
                        placeholder="Ingrese comentario"
                        dense
                        auto-grow
                        outlined
                        hide-details
                        class="mt-8"
                        @change="placeChangesMade()"
                      />
                    </div>
                  </div>
                  <div v-if="selectionImportColumn" class="px-0 py-4">
                    <import-columns
                      :selection-item-import="selectionItemImport"
                      :column-typeslist="columnTypeslist"
                      @btn-close-action="closeImport()"
                      @import-btn-accept-action="acceptImport()"
                    />
                  </div>
                </v-navigation-drawer>
                <div
                  v-if="centerColumn"
                  class="p-10 center-column"
                  :class="{ 'margin-left': leftDrawer }"
                >
                  <v-skeleton-loader v-if="loading" type="date-picker" />
                  <div v-else class="d-flex">
                    <v-icon
                      v-if="icoMenu"
                      large
                      color="primary"
                      class="pt-1 pr-1"
                      @click="btnMenu()"
                    >
                      mdi-menu
                    </v-icon>
                    <v-card outlined max-width="280" @click="addDatabase()">
                      <div class="d-flex mx-2 my-2">
                        <div class="d-flex align-center">
                          <v-icon large color="secondary">
                            mdi-plus-circle
                          </v-icon>
                        </div>
                        <div class="px-2">
                          <v-list-item-title class="text-h5 mb-1">
                            Crear base de datos
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Agrega un elemento
                          </v-list-item-subtitle>
                        </div>
                      </div>
                    </v-card>
                  </div>
                  <div class="d-flex flex-wrap align-center mt-10">
                    <v-card
                      v-for="item in selectedDatabase.tables"
                      :key="item.id"
                      :class="{ active: item.active }"
                      class="mb-3 mx-10"
                      width="280"
                      min-height="192"
                      outlined
                    >
                      <v-card-title
                        class="px-2 py-2 accent--text selection"
                        :style="`background-color: ${item.backgroundColor}`"
                        @click="elementSelection(item)"
                      >
                        <v-icon color="primary"> mdi-window-maximize </v-icon>
                        {{ item.name }}
                      </v-card-title>
                      <v-card-text
                        v-for="itemColumn in item.columns"
                        :key="itemColumn.id"
                        class="px-2 py-2 accent--text selection"
                        @click="columnSelection(item, itemColumn)"
                      >
                        <div class="d-flex justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon small color="secondary" class="mr-2">
                              {{
                                itemColumn.active
                                  ? 'mdi-checkbox-blank-circle'
                                  : 'mdi-checkbox-blank-circle-outline'
                              }}
                            </v-icon>
                            {{ itemColumn.field }}
                          </div>
                          <div class="primary--text pl-1">
                            {{ itemColumn.type }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
              </v-container>
            </div>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
    <base-dialog
      v-model="changesMadeDialog"
      text-alert="Tienes cambios sin guardar, ¿Estás seguro de salir? "
      primary-btn-text="Sí, Salir"
      @primary-btn-action="exitPermanently()"
    />
  </v-container>
</template>

<script>
import ImportColumns from '@/components/modules/database/database/ImportColumns.vue'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import { mapGetters } from 'vuex'
import BaseDialog from '@/components/util/BaseDialog.vue'

export default {
  name: 'DatabaseModeling',
  components: { ImportColumns, BaseDialog },
  mixins: [customTableBffMixin],
  data() {
    return {
      changesMade: false,
      changesMadeDialog: false,
      loading: false,
      startModelDatabase: true,
      progressSave: false,
      textDelete: '',
      dialog: true,
      icoMenu: false,
      centerColumn: true,
      rightColumn: false,
      leftDrawer: false,
      rightDrawer: false,
      activeImportData: true,
      activateDelete: false,
      rightTitle: 'Configuración',
      selectedDatabase: {
        tables: [],
      },
      databaseId: 1,
      colomnId: 0,
      selectionItem: null,
      selectionItemImport: {
        encodingFormat: 'utf-8',
        columns: [],
      },
      selectionColItem: null,
      selectionDatabase: false,
      selectionColumn: false,
      selectionImportColumn: false,
      columnTypesEncodingFormat: [
        {
          text: 'UTF-8',
          value: 'utf-8',
        },
        {
          text: 'ISO-8859-1',
          value: 'iso-8859-1',
        },
      ],
      columnTypeslist: [],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  created() {
    this.getColumnTypes()
  },
  methods: {
    async getColumnTypes() {
      this.columnTypeslist = await this.getColumnTypeslist(this.clientId)
    },
    goModelDatabase() {
      this.getRecord()
      this.startModelDatabase = !this.startModelDatabase
    },
    async getRecord() {
      this.loading = true
      this.selectedDatabase = await this.getDatabaseModelingByClientId(
        this.clientId
      )
      if (this.selectedDatabase.tables.length !== 0) {
        this.leftDrawer = true
        this.selectedDatabase.tables.forEach((item) => {
          this.databaseId += 1
          this.colomnId += item.columns.length
        })
      }
      this.loading = false
    },
    async saveModeling() {
      this.progressSave = true
      await this.saveAllDatabaseModeling(this.selectedDatabase)
      this.changesMade = false
      this.progressSave = false
    },
    async saveExitModeling() {
      await this.saveModeling()
      this.exitModelDatabase()
    },
    async addDatabase() {
      this.leftDrawer = true
      const item = {
        id: '',
        clientId: this.clientId,
        name: `Base_de_datos_${this.databaseId}`,
        backgroundColor: '#ffffff',
        columns: [],
        active: false,
        encodingFormat: 'utf-8',
      }
      const newId = await this.createDatabaseModeling(item)
      item.id = newId
      this.selectedDatabase.tables.push(item)
      this.databaseId += 1
    },
    closeRightColumn() {
      this.rightDrawer = false
    },
    closeLeftColumn() {
      this.leftDrawer = false
      this.icoMenu = true
    },
    btnMenu() {
      this.leftDrawer = true
      this.icoMenu = false
    },
    deselect() {
      this.selectedDatabase.tables.forEach((item) => {
        item.active = false
        item.columns.forEach((itemCol) => {
          itemCol.active = false
        })
      })
    },
    elementSelection(selectedItem) {
      this.deselect()
      const index = this.selectedDatabase.tables.indexOf(selectedItem)
      this.selectedDatabase.tables[index].active = true
      this.rightDrawer = true
      this.selectionItem = selectedItem
      this.rightTitle = 'Configuración'
      this.selectionDatabase = true
      this.selectionColumn = false
      this.selectionImportColumn = false
      this.activateDelete = false
      this.textDelete = ` la base de datos ${this.selectionItem.name}?`
    },
    importColumn() {
      this.selectionItemImport = {
        encodingFormat: 'utf-8',
        columns: [],
      }
      this.selectionImportColumn = true
      this.activeImportData = true
      this.selectionDatabase = false
      this.selectionColumn = false
      this.rightTitle = 'Importar columnas'
    },
    addColumn() {
      this.colomnId += 1
      const column = {
        id: this.colomnId,
        field: `Columna_${this.colomnId}`,
        type: 'text_nor',
        validate: false,
        format: '',
        hasFormat: false,
        comment: '',
        active: false,
      }
      this.selectionItem.columns.push(column)
      this.placeChangesMade()
    },
    columnSelection(selectedItem, selectedColumn) {
      this.rightDrawer = true
      this.rightTitle = 'Editar columna'
      this.deselect()
      selectedColumn.active = true
      const index = this.selectedDatabase.tables.indexOf(selectedItem)
      this.selectedDatabase.tables[index].active = true
      this.selectionItem = selectedItem
      this.selectionColItem = selectedColumn
      this.selectionDatabase = false
      this.selectionImportColumn = false
      this.activateDelete = false
      this.selectionColumn = true
      this.textDelete = ` la columna ${this.selectionColItem.field}?`
    },
    closeImport() {
      this.rightDrawer = false
    },
    acceptImport() {
      this.rightDrawer = false
      this.selectionItem.encodingFormat =
        this.selectionItemImport.encodingFormat
      this.selectionItem.columns = this.selectionItemImport.columns
      this.placeChangesMade()
    },
    exitModelDatabase() {
      if (this.changesMade) {
        this.changesMadeDialog = true
      } else {
        this.exitPermanently()
      }
    },
    exitPermanently() {
      this.selectedDatabase.tables = []
      this.selectionItem = {}
      this.leftDrawer = false
      this.rightDrawer = false
      this.databaseId = 1
      this.colomnId = 0
      this.startModelDatabase = true
      this.changesMadeDialog = false
      this.changesMade = false
    },
    async btnDelete() {
      if (this.selectionDatabase) {
        const approved = await this.deleteDatabaseModeling(this.selectionItem)
        if (approved !== true) {
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas al eliminar la base de datos.',
          })
        } else {
          const index = this.selectedDatabase.tables.indexOf(this.selectionItem)
          this.selectedDatabase.tables.splice(index, 1)
        }
      }
      if (this.selectionColumn) {
        const deleteArray = {
          id: this.selectionItem.id,
          clientId: this.clientId,
          column: this.selectionColItem,
        }
        const approved = await this.deleteDatabaseModelingColumn(deleteArray)
        if (approved !== true) {
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas al eliminar la columna de la base de datos.',
          })
        } else {
          const index = this.selectionItem.columns.indexOf(
            this.selectionColItem
          )
          this.selectionItem.columns.splice(index, 1)
        }
      }
      this.placeChangesMade()
      this.rightDrawer = false
    },
    keyPress(evento) {
      if (evento === 'database') {
        this.selectionItem.name = this.selectionItem.name.replace(/ /g, '_')
      } else if (evento === 'column') {
        this.selectionColItem.field = this.selectionColItem.field.replace(
          / /g,
          '_'
        )
      }
    },
    placeChangesMade() {
      this.changesMade = true
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 100%;
  overflow: hidden;
}
.v-img {
  width: 50%;
}
.all-screen {
  width: 100%;
  background-color: var(--v-gray-base);
  height: calc(100vh - 64px) !important;
}
.margin-left {
  margin-left: 256px;
  width: calc(100vw - 273px) !important;
}
.left-column {
  max-height: calc(100vh - 65px) !important;
  top: 65px !important;
}
.right-column {
  max-height: calc(100vh - 65px) !important;
  top: 65px !important;
}
.center-column {
  padding: 10px;
  width: 100%;
  max-height: calc(100vh - 65px) !important;
  overflow-y: auto;
}
.active {
  border: 2px solid var(--v-primary-base) !important;
}
.selection {
  cursor: pointer;
  border-bottom: 1px solid var(--v-gray-base);
}
.change-btn {
  animation: changeAnimation 3s ease 0s infinite normal none;
}
@keyframes changeAnimation {
  0.0% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
  51.1% {
    opacity: 100;
  }
}
</style>
