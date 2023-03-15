<template>
  <div>
    <div
      v-if="itemFolder.name !== '' && !rename"
      class="d-flex justify-space-between"
    >
      <v-btn color="accent" text @click="onClick()">
        <v-icon left>
          {{ itemFolder.active ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
        <v-icon left> mdi-folder </v-icon>
        {{ itemFolder.name !== '' ? itemFolder.name : '' }}
      </v-btn>
      <div>
        <v-menu bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="accent" v-bind="attrs" v-on="on">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="menuItem in menuItems"
              :key="menuItem.action"
              @click="menuActions(itemFolder, menuItem.action)"
            >
              <v-list-item-icon>
                <v-icon>{{ menuItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div
      v-if="itemFolder.name === '' || rename"
      class="d-flex align-center ml-3"
    >
      <v-icon color="accent" style="font-size: 18px"> mdi-chevron-down </v-icon>
      <v-icon color="accent" class="ml-1" left style="font-size: 18px">
        mdi-folder
      </v-icon>
      <v-text-field
        v-model="nameAux"
        outlined
        dense
        hide-details
        class="mr-2 mb-2 mt-1"
        @blur="createUrl(itemFolder)"
      />
    </div>
    <div v-if="itemFolder.active">
      <div v-for="fileItem in itemFolder.fileList" :key="fileItem.name">
        <div class="d-flex justify-space-between align-center accent--text">
          <div class="ml-9" style="font-size: 0.875rem">
            {{ fileItem.name }}
          </div>
          <div class="caption">
            <v-btn icon @click="deleteItemFile(fileItem)">
              <v-icon color="primary"> mdi-delete </v-icon>
            </v-btn>
          </div>
        </div>
        <delete-folder-or-file
          v-if="activeDeleteFile && itemFileDelete === fileItem"
          title="¿Estás seguro de eliminar archivo?"
          element-to-delete="SÍ, ELIMINAR"
          :file-item="fileItem"
          @cancel-action="activeDeleteFile = !activeDeleteFile"
          @delete-definitive-file="deleteDefinitiveFile"
        />
      </div>
    </div>
    <div v-if="itemFolder.active" class="ml-4">
      <v-btn
        text
        color="primary"
        class="ml-1"
        @click="$emit('file-upload', itemFolder)"
      >
        <v-icon left> mdi-file-image-plus </v-icon>
        cargar archivo
      </v-btn>
    </div>
  </div>
</template>

<script>
import DeleteFolderOrFile from '@/components/modules/automation/DeleteFolderOrFile.vue'

export default {
  name: 'ListFolderJasper',
  components: { DeleteFolderOrFile },
  props: {
    itemFolder: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      variableAux: false,
      activeDeleteFile: false,
      itemFileDelete: null,
      nameAux: '',
      rename: false,
      menuItems: [
        { action: 'delete', text: 'Eliminar', icon: 'mdi-delete' },
        { action: 'edit', text: 'Editar nombre', icon: 'mdi-pencil' },
      ],
    }
  },
  methods: {
    createUrl(item) {
      let url = this.nameAux.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      url = url.toLowerCase()
      url = url.replace(/ /g, '_')
      item.url = `/${url}/`
      this.variableAux = false
      this.itemFolder.name = this.nameAux
      this.rename = false
    },
    onClick() {
      this.itemFolder.active = !this.itemFolder.active
      this.clicks = 0
    },
    menuActions(item, action) {
      if (action === 'edit') {
        this.nameAux = this.itemFolder.name
        this.rename = true
      } else if (action === 'delete') {
        this.$emit('delete-element-folder', item)
      }
    },
    deleteItemFile(itemJasper) {
      this.itemFileDelete = itemJasper
      this.activeDeleteFile = true
    },
    deleteDefinitiveFile(fileItem) {
      const index = this.itemFolder.fileList.indexOf(fileItem)
      this.itemFolder.fileList.splice(index, 1)
      this.activeDeleteFile = false
    },
  },
}
</script>
