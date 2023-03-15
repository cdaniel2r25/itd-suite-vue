<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <v-row no-gutters>
          <v-col cols="7">
            <h1>Etiquetas</h1>
          </v-col>
          <v-col cols="5">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="addLabel()">
                <v-icon> mdi-plus </v-icon>CREAR ETIQUETA
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2 mt-6">
              Aquí podrás ver y crear etiquetas para tus chats.
            </P>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-skeleton-loader v-if="loading" type="table" />
            <v-data-table v-else :items="labelsList" :headers="headers">
              <template v-slot:[`item.color`]="{ item }">
                <v-icon :color="item.color"> mdi-label </v-icon>
              </template>
              <template v-slot:[`item.description`]="{ item }">
                {{ cutText(item.description, 60) }}
              </template>
              <template v-slot:[`item.menu`]="{ item }">
                <v-menu bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="primary" v-bind="attrs" v-on="on">
                      <v-icon> mdi-dots-vertical </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="menuItem in menuItems"
                      :key="menuItem.action"
                      @click="menuActions(item, menuItem.action)"
                    >
                      <v-list-item-icon>
                        <v-icon>{{ menuItem.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <add-or-edit-label-dialog
      v-if="!!labelToEdit || isCreatingLabel"
      v-model="addOrEditLabelDialog"
      :label-to-edit="labelToEdit"
      @clear-data="clearData()"
      @create-update-label="createUpdateLabel"
    />
    <delete-dialog
      v-if="!!labelToDelete"
      v-model="deleteLabelDialog"
      :element-to-delete="labelToDelete.name"
      @btn-active-action="deleteSelectedLabel()"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import WhatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import AddOrEditLabelDialog from '@/components/modules/whatsapp/chats/AddOrEditLabelDialog.vue'

export default {
  name: 'Labels',
  components: { DeleteDialog, AddOrEditLabelDialog },
  mixins: [WhatsappBffMixin],
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Etiqueta', align: 'center', value: 'color', sortable: false },
        { text: 'Nombre', value: 'name' },
        { text: 'Descripción', value: 'description' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      menuItems: [
        { action: 'edit', text: 'Editar', icon: 'mdi-pencil' },
        { action: 'delete', text: 'Eliminar', icon: 'mdi-delete' },
      ],
      labelsList: [],
      isCreatingLabel: false,
      addOrEditLabelDialog: false,
      deleteLabelDialog: false,
      labelToEdit: null,
      labelToDelete: null,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.getLabelsFilterInit()
  },
  methods: {
    async getLabelsFilterInit() {
      this.loading = true

      const filter = {
        page: -1,
      }
      const labels = await this.getLabelsFilter(filter)
      this.labelsList = await labels.dataList
      this.loading = false
    },
    cutText(text, size) {
      return text.length <= size ? text : `${text.slice(0, size)}...`
    },
    clearData() {
      this.labelToEdit = null
      this.labelToDelete = null
      this.isCreatingLabel = false
      this.addOrEditLabelDialog = false
      this.deleteLabelDialog = false
    },
    addLabel() {
      this.addOrEditLabelDialog = true
      this.isCreatingLabel = true
    },
    menuActions(item, action) {
      if (action === 'edit') {
        this.labelToEdit = item
        this.addOrEditLabelDialog = true
      } else if (action === 'delete') {
        this.labelToDelete = item
        this.deleteLabelDialog = true
      }
    },
    async deleteSelectedLabel() {
      await this.deleteLabelById(this.labelToDelete.id)
      this.getLabelsFilterInit()
      this.clearData()
    },
    async createUpdateLabel(label) {
      await this.createOrUpdateLabel(label)
      this.getLabelsFilterInit()
      this.clearData()
    },
  },
}
</script>
