<template>
  <div>
    <div>
      <v-row no-gutters>
        <v-col cols="7">
          <v-tooltip right nudge-bottom="20">
            <template v-slot:activator="{ on, attrs }">
              <h1 v-bind="attrs" v-on="on">Listado de Autorrespuestas</h1>
            </template>
            <div style="width: 200px">
              <span>
                Asignación de Autorrespuesta Por defecto a uno o más remitentes.
              </span>
            </div>
          </v-tooltip>
        </v-col>
        <v-col cols="5">
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              @click="activeCreateAutoresponse = !activeCreateAutoresponse"
            >
              <v-icon> mdi-plus </v-icon>CREAR AUTORESPUESTA
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <P class="my-2 mt-6">
            Aquí podrás activar, asignar remitente a autorrespuestas y crear
            nuevas.
          </P>
        </v-col>
      </v-row>
    </div>
    <div class="mt-2">
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="databasesList"
        :page.sync="actualPage"
        :items-per-page.sync="itemsPerPage"
        :server-items-length="totalElements"
        :footer-props="{
          'show-current-page': true,
          'show-first-last-page': true,
          'items-per-page-text': 'Elementos por página',
          'items-per-page-options': [5, 10, 15, 20, 25],
        }"
        @update:options="printEvent"
      >
        <template v-slot:[`header.assignedDefault`]="{ header }">
          {{ header.text }}
          <tooltip
            message="Asignación de<br>Autorrespuesta por<br>defecto a uno o más<br>
            remitentes."
          />
        </template>
        <template v-slot:[`item.validated`]="{ item }">
          <v-switch v-model="item.validated" @change="changeValidated(item)">
            <template v-slot:label>
              <!-- TODO: should appear when user is administrator -->
              <div
                class="caption"
                :class="item.validated ? 'primary--text' : 'accent--text'"
              >
                <v-icon :color="item.validated ? 'success' : 'darkgray'">
                  {{ item.validated ? 'mdi-check' : 'mdi-alarm' }}
                </v-icon>
              </div>
            </template>
          </v-switch>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                outlined
                v-bind="attrs"
                :color="item.status === 'active' ? 'success' : 'darkgray'"
                v-on="on"
              >
                <v-icon
                  small
                  left
                  :color="item.status === 'active' ? 'success' : 'darkgray'"
                >
                  mdi-checkbox-blank-circle
                </v-icon>
                {{ item.status === 'active' ? 'Activo' : 'Inactivo' }}
                <v-icon right color="gray300"> mdi-menu-down </v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item @click="changeStatus(item, 'active')">
                <v-list-item-icon>
                  <v-icon small color="success">
                    mdi-checkbox-blank-circle
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title>Activo</v-list-item-title>
              </v-list-item>
              <v-list-item @click="changeStatus(item, 'inactive')">
                <v-list-item-icon>
                  <v-icon small color="darkgray">
                    mdi-checkbox-blank-circle
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title>Inactivo</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:[`item.assignedDefault`]="{ item }">
          <v-chip
            v-if="item.assignedDefault.length !== 0"
            class="ma-2 height-chip"
            close
            color="blue200"
            @click:close="closeAssingned(item)"
          >
            <div class="d-flex flex-column align-center px-2">
              <div class="pt-1 caption primary--text">Remitente</div>
              {{ item.assignedDefault[0] }}
            </div>
          </v-chip>
          <v-btn
            v-if="item.assignedDefault.length > 1"
            icon
            color="gray300"
            @click="chageAssignedDefault(item)"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
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
                v-for="(menuItem, index) in menuItems"
                :key="index"
                @click="menuActions(item, menuItem.text)"
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
    </div>
    <assigned-default-dialog
      v-if="selectedItem"
      v-model="activeAssignedDefault"
      :selected-item="selectedItem"
      @delete-item-assigned="deleteItemAssigned"
      @add-assignment="activeAddAssignment = !activeAddAssignment"
    />
    <add-assignment-dialog
      v-if="selectedItem"
      v-model="activeAddAssignment"
      :selected-item="selectedItem"
      @save-changes-new="saveChangesNew"
    />
    <delete-autoresponse-dialog
      v-if="selectedItem"
      v-model="activeDeleteAutoresponse"
      :selected-item="selectedItem"
      @delete-autoresponse="deleteAutoresponse"
    />
    <create-autoresponder-dialog
      v-if="activeCreateAutoresponse"
      v-model="activeCreateAutoresponse"
      @create-autoresponse="createAutoresponse"
    />
    <create-autoresponder-config-dialog
      v-if="selectedItem"
      :key="ActivityConfig"
      v-model="activeCreateAutoresponseConfig"
      :selected-item="selectedItem"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'
import AssignedDefaultDialog from '@/components/modules/autoresponses/AssignedDefaultDialog.vue'
import AddAssignmentDialog from '@/components/modules/autoresponses/AddAssignmentDialog.vue'
import DeleteAutoresponseDialog from '@/components/modules/autoresponses/DeleteAutoresponseDialog.vue'
import CreateAutoresponderDialog from '@/components/modules/autoresponses/CreateAutoresponderDialog.vue'
import Tooltip from '@/components/util/Tooltip.vue'
import CreateAutoresponderConfigDialog from '@/components/modules/autoresponses/CreateAutoresponderConfigDialog.vue'

export default {
  name: 'DatabasesTable',
  components: {
    AssignedDefaultDialog,
    AddAssignmentDialog,
    DeleteAutoresponseDialog,
    Tooltip,
    CreateAutoresponderDialog,
    CreateAutoresponderConfigDialog,
  },
  mixins: [customTableBffMixin],
  data() {
    return {
      loading: false,
      databasesList: [],
      selectedItem: null,
      totalElements: 0,
      ActivityConfig: 0,
      activeAssignedDefault: false,
      activeAddAssignment: false,
      activeDeleteAutoresponse: false,
      activeCreateAutoresponse: false,
      activeCreateAutoresponseConfig: false,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      actualPage: 1,
      itemsPerPage: 5,
      headers: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Validación', value: 'validated' },
        { text: 'Estado', value: 'status' },
        {
          text: 'Asignada por defecto a',
          value: 'assignedDefault',
          sortable: false,
        },
        { text: 'Última actualización', value: 'lastUpdate' },
        { text: 'Autor', value: 'author' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      menuItems: [
        { text: 'Editar', icon: 'mdi-pencil' },
        { text: 'Asignar por defecto', icon: 'mdi-clipboard-check' },
        { text: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {
    printEvent(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      this.getDatabaseList()
    },
    async getDatabaseList() {
      this.loading = true
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      const customTableFilter = {
        clientId: this.clientId,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }

      const databasesObjectQuery = await this.getDatabasesListByClientId(
        customTableFilter
      )
      this.databasesList = await databasesObjectQuery.dataList
      this.totalElements = await databasesObjectQuery.totalElements
      this.loading = false
    },
    async changeValidated(item) {
      const change = {
        clientId: this.clientId,
        autoresponsesId: item.id,
        validated: item.validated,
      }
      await this.changeValidationByClientId(change)
    },
    menuActions(item, menuItem) {
      if (menuItem === 'Eliminar') this.goDeleteDialog(item)
      if (menuItem === 'Asignar por defecto') this.goaAssignmentDialogo(item)
      if (menuItem === 'Editar') this.goEditDialog(item)
    },
    goaAssignmentDialogo(item) {
      this.activeAddAssignment = true
      this.selectedItem = JSON.parse(JSON.stringify(item))
    },
    goDeleteDialog(item) {
      this.activeDeleteAutoresponse = true
      this.selectedItem = JSON.parse(JSON.stringify(item))
    },
    goEditDialog(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item))
      this.ActivityConfig += 1
      this.activeCreateAutoresponseConfig = true
    },
    async deleteItemAssigned(item) {
      const newList = JSON.parse(
        JSON.stringify(this.selectedItem.assignedDefault)
      )
      const index = newList.indexOf(item)
      newList.splice(index, 1)
      const assign = {
        clientId: this.clientId,
        autoresponsesId: this.selectedItem.id,
        assignedDefault: newList,
      }
      const result = await this.changeAssignedByClientId(assign)
      if (result) {
        this.selectedItem.assignedDefault = newList
      }
    },
    async closeAssingned(item) {
      const newList = JSON.parse(JSON.stringify(item.assignedDefault))
      const index = newList.indexOf(item.assignedDefault[0])
      newList.splice(index, 1)
      const assign = {
        clientId: this.clientId,
        autoresponsesId: item.id,
        assignedDefault: newList,
      }
      const result = await this.changeAssignedByClientId(assign)
      if (result) {
        item.assignedDefault = newList
      }
    },
    async changeStatus(item, status) {
      const assign = {
        clientId: this.clientId,
        autoresponsesId: item.id,
        status,
      }
      const result = await this.changeStatusByClientId(assign)
      if (result) {
        item.status = status
      }
    },
    chageAssignedDefault(item) {
      this.selectedItem = item
      this.activeAssignedDefault = !this.activeAssignedDefault
    },
    async saveChangesNew(itemList) {
      const assign = {
        clientId: this.clientId,
        autoresponsesId: this.selectedItem.id,
        assignedDefault: itemList.assignedDefault,
      }
      const result = await this.changeAssignedByClientId(assign)
      if (result) {
        this.selectedItem = this.databasesList.find(
          (x) => x.id === this.selectedItem.id
        )
        this.selectedItem.assignedDefault = itemList.assignedDefault
      }
    },
    async deleteAutoresponse(deleteItem) {
      const assign = {
        clientId: this.clientId,
        autoresponsesId: deleteItem.id,
      }
      const result = await this.deleteAutoresponseByClientIdAndAutoresponsesId(
        assign
      )
      if (result) {
        this.databasesList = this.databasesList.filter(
          (items) => items.id !== deleteItem.id
        )
      }
    },
    async createAutoresponse(name) {
      const newItem = {
        clientId: this.clientId,
        id: -1,
        name,
        validated: false,
        status: 'inactive',
        assignedDefault: [],
        author: `${this.$auth.user.given_name} ${this.$auth.user.family_name}`,
      }
      const newCreated = await this.createAutoresponder(newItem)
      if (newCreated) {
        this.activeCreateAutoresponse = false
        this.selectedItem = JSON.parse(JSON.stringify(newCreated))
        this.ActivityConfig += 1
        this.activeCreateAutoresponseConfig = true
        this.databasesList.push(newCreated)
      }
    },
  },
}
</script>
<style scoped>
.height-chip {
  height: 40px !important;
  border-radius: 20px !important;
}
</style>
