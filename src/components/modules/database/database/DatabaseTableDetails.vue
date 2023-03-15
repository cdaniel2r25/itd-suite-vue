<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <div class="actions-style-th font-weight-bold">Acciones</div>
          <v-data-table
            :key="tableId"
            :loading="loading"
            :headers="headers"
            :items="customTableData"
            :page.sync="actualPage"
            :items-per-page.sync="itemsPerPage"
            :server-items-length="totalElements"
            :footer-props="{
              'show-current-page': true,
              'show-first-last-page': true,
              'items-per-page-text': 'Elementos por página',
              'items-per-page-options': [5, 10, 15, 20, 25],
            }"
            class="fluid-table actions-style"
            @update:options="printEvent"
          >
            <template v-slot:[`item.menu`]="{ item, index }">
              <td>
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
                      @click="menuActions(item, menuItem.action, index)"
                    >
                      <v-list-item-icon>
                        <v-icon>{{ menuItem.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <div>
      <base-dialog
        v-model="dialogDelete"
        text-alert="¿Está seguro de eliminar registro?"
        primary-btn-text="Sí, Eliminar"
        @primary-btn-action="deleteRecord()"
      />
      <edit-database-row-dialog
        v-model="dialogEdit"
        :show-cancel-btn="showCancelBtn"
        :item-database="databaseRowToEditClone"
        @primary-btn-action="editRecord()"
        @primary-btn-cancel="dialogEdit = !dialogEdit"
      />
    </div>
  </v-container>
</template>

<script>
import BaseDialog from '@/components/util/BaseDialog.vue'
import EditDatabaseRowDialog from '@/components/modules/database/database/EditDatabaseRowDialog.vue'
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'

export default {
  name: 'DatabaseTableDetails',
  components: { BaseDialog, EditDatabaseRowDialog },
  mixins: [customTableDataBffMixin],
  props: {
    customTableData: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    totalElements: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      tableId: 0,
      dialogDelete: false,
      dialogEdit: false,
      indexRecordToDelete: '',
      databaseIndexToEdit: '',
      databaseRowToEditClone: {},
      showCancelBtn: true,
      actualPage: 1,
      itemsPerPage: 5,

      menuItems: [
        { action: 'edit', text: 'Editar', icon: 'mdi-pencil' },
        { action: 'delete', text: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
  methods: {
    closeEditDialog() {
      this.databaseIndexToEdit = ''
      this.databaseRowToEditClone = {}
      this.dialogEdit = false
    },
    closeDeleteDialog() {
      this.indexRecordToDelete = ''
      this.dialogDelete = false
    },
    menuActions(item, action, index) {
      if (action === 'edit') {
        this.databaseIndexToEdit = index
        this.databaseRowToEditClone = JSON.parse(JSON.stringify({ ...item }))
        this.dialogEdit = true
      } else if (action === 'delete') {
        this.indexRecordToDelete = index
        this.dialogDelete = true
      }
    },
    async editRecord() {
      const recortId = await this.createOrEditDatabaseRecord(
        this.databaseRowToEditClone
      )
      if (recortId !== '') {
        await Object.assign(
          this.customTableData[this.databaseIndexToEdit],
          this.databaseRowToEditClone
        )
      }

      this.closeEditDialog()
      this.tableId += 1
    },
    async deleteRecord() {
      console.log(this.customTableData)
      const validated = await this.deleteDatabaseRecord(
        this.customTableData[this.indexRecordToDelete].customTableId,
        this.customTableData[this.indexRecordToDelete].id
      )
      if (validated) {
        this.customTableData.splice(this.indexRecordToDelete, 1)
        this.closeDeleteDialog()
      }
    },
    async printEvent(event) {
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      const updateObject = {
        actualPage: this.actualPage,
        itemsPerPage: this.itemsPerPage,
      }
      await this.$emit('update-list', updateObject)
    },
  },
}
</script>

<style scoped>
.scrollsettings {
  width: calc(100% - 75px);
  border-right: 1px solid #d1d1d1;
}
.actions-style-th {
  position: absolute;
  right: 5px;
  padding-top: 15px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
}
.actions-style td:last-child {
  position: absolute;
  right: 0;
  border-top: thin solid rgba(0, 0, 0, 0.12);
}
.header-lines {
  border-top: thin solid rgba(0, 0, 0, 0.12);
}
</style>
