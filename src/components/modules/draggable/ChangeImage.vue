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
            <v-btn text color="primary" @click="$emit('change-model', false)">
              <v-icon left> mdi-arrow-left </v-icon>
              Volver a diseño de emails
            </v-btn>
          </div>
          <v-divider vertical class="px-2"></v-divider>
          <v-spacer></v-spacer>
          <v-toolbar-title>Administrador de archivos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="ma-2 white--text" @click="openFile()">
            Importar
            <v-icon right> mdi-file-import-outline </v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid class="px-0 py-0 d-flex">
          <div v-if="directory" class="left-column">
            <v-list>
              <v-list-item link @click="iniFolders()">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="caption primary--text"
                  >Inicio</v-list-item-title
                >
              </v-list-item>
              <v-list-group
                v-for="itemFolder in directory.folders"
                :key="itemFolder.id"
                prepend-icon="mdi-folder"
                @click="selectFolders = itemFolder"
              >
                <template v-slot:activator>
                  <v-list-item-title class="caption">
                    {{ itemFolder.name }}
                  </v-list-item-title>
                </template>
                <v-list-item
                  v-for="itemFile in itemFolder.fileList"
                  :key="itemFile.name"
                  link
                  class="ml-4"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-file-image</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    class="caption"
                    @click="imageSelectionAction(itemFile)"
                  >
                    {{ itemFile.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-group>
              <v-list-item
                v-for="itemFiles in directory.fileList"
                :key="itemFiles.name"
                link
                @click="imageSelectionAction(itemFiles)"
              >
                <v-list-item-icon>
                  <v-icon>mdi-file-image</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="caption">{{
                  itemFiles.name
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
          <div class="all-screen pa-2">
            <div v-if="selectFolders" class="d-flex flex-wrap">
              <div
                v-for="itemCol in selectFolders.fileList"
                :key="itemCol.name"
                class="item-card"
              >
                <v-card outlined>
                  <div class="d-flex">
                    <div
                      class="image-column d-flex justify-center align-center ml-2 my-2"
                      @click="imageSelectionAction(itemCol)"
                    >
                      <v-img
                        :src="itemCol.url"
                        max-width="100%"
                        max-height="100%"
                      />
                    </div>
                    <div
                      class="ml-2 d-flex flex-column justify-space-between"
                      style="width: 60%"
                    >
                      <div class="caption font-weight-bold mt-1">
                        {{ itemCol.name }}
                      </div>
                      <div
                        class="text-right pa-2 mr-2"
                        style="border-top: 1px solid var(--v-gray300-base)"
                      >
                        <v-btn
                          color="primary"
                          elevation="2"
                          small
                          @click="imageSelectionAction(itemCol)"
                          >Insertar</v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
    <v-file-input
      v-show="false"
      id="inputUploadImg"
      ref="inputUploadImg"
      v-model="fileToUploadImg"
      :accept="fileExtension"
      @change="onChangeFileInput"
    />
  </div>
</template>

<script>
import draggableMixin from '@/mixins/services/draggableBffMixin'
import filesMixin from '@/mixins/util/filesMixin'

export default {
  name: 'ChangeImage',
  mixins: [draggableMixin, filesMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    clienteId: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    imageSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menuTab: true,
      directory: null,
      selectFolders: null,
      fileToUploadImg: null,
      fileExtension: 'image/*',
    }
  },
  watch: {},
  created() {
    this.createDirectory()
  },
  methods: {
    async createDirectory() {
      this.directory = await this.getListOfFoldersAndFilesByClientId(
        this.clientId
      )
      this.iniFolders()
    },
    imageSelectionAction(itemImage) {
      this.imageSelection.src = itemImage.url
      this.$emit('change-model', false)
    },
    iniFolders() {
      this.selectFolders = {
        active: true,
        id: -1,
        name: 'Inicio',
        url: '/',
        fileList: this.directory.fileList,
      }
    },
    openFile() {
      document.getElementById('inputUploadImg').click()
    },
    async onChangeFileInput() {
      const file = this.fileToUploadImg
      if (file !== null) {
        let fBase64 = ''
        await this.fileToBase64(this.fileToUploadImg).then((result) => {
          fBase64 = result
        })
        const itemNew = {
          clienteId: this.clienteId,
          name: file.name,
          fileBase64: fBase64,
          fileExtension: await this.getFileExtension(this.fileToUploadImg),
          selectFolders: this.selectFolders.url,
        }
        const result = await this.registerNewImageFile(itemNew)
        if (result !== '') {
          const itemNewReg = {
            name: itemNew.name,
            url: result,
            fileExtension: itemNew.fileExtension,
          }
          this.selectFolders.fileList.push(itemNewReg)
        }
        this.fileToUploadImg = null
      }
    },
  },
}
</script>
<style scoped>
.left-column {
  width: 300px;
  max-height: calc(100vh - 65px) !important;
  top: 65px !important;
  box-shadow: 11px 1px 19px -11px rgba(30, 30, 60, 0.25);
  overflow-y: auto;
}
.all-screen {
  width: calc(100vw - 300px);
  height: calc(100vh - 65px) !important;
  position: relative;
  background-color: var(--v-gray-base);
  overflow-y: auto;
  overflow-x: hidden;
}
.image-column {
  width: 40%;
  height: 140px;
  background-color: var(--v-gray-base);
  border: 2px solid var(--v-gray300-base);
  border-radius: 4px;
  cursor: pointer;
}
.item-card {
  width: 329px;
  height: 156px;
  padding: 12px;
  margin-bottom: 12px;
}
</style>
