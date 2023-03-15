<template>
  <div>
    <v-row no-gutters class="mt-2">
      <v-col cols-4 class="ma-2">
        <v-text-field
          label="Fecha de campaña"
          placeholder="Ingresar fecha"
          type="date"
          outlined
        />
      </v-col>
      <v-col cols-4 class="ma-2">
        <v-text-field
          label="Nombre de campaña"
          placeholder="Ingresar nombre"
          outlined
        />
      </v-col>
      <v-col cols="4" class="ma-2">
        <v-btn outlined color="primary">BUSCAR</v-btn>
      </v-col>
    </v-row>
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
        <template v-slot:[`item.state`]="{ item }">
          <span v-if="isStateSuccess(item.state)" class="success--text">
            {{ DATABASE_STATE_TEXT[item.state] }}
          </span>
          <span v-else-if="isStateWaiting(item.state)" class="gray300--text">
            {{ DATABASE_STATE_TEXT[item.state] }}
          </span>
          <span v-else-if="isStateAbort(item.state)" class="danger--text">
            {{ DATABASE_STATE_TEXT[item.state] }}
          </span>
          <span v-else class="warning--text">
            {{ DATABASE_STATE_TEXT[item.state] }}
            <v-icon small class="warning--text rotate"> mdi-sync </v-icon>
          </span>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span class="primary--text">
            {{ item.name }}
          </span>
        </template>
        <template v-slot:[`item.applications`]="{ item }">
          <v-icon v-if="item.applications.email" small> mdi-email </v-icon>
          <v-icon v-if="item.applications.sms" small>
            mdi-message-processing
          </v-icon>
          <v-icon v-if="item.applications.vms" small> mdi-phone </v-icon>
          <v-icon v-if="item.applications.whatsapp" small>
            mdi-whatsapp
          </v-icon>
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
    <v-dialog v-model="dialogDelete" width="550">
      <v-card>
        <v-card-title class="text-h5 lighten-2 d-flex justify-space-between">
          <div>{{ title }}</div>
          <v-btn
            color="grey"
            plain
            style="font-size: 1rem"
            @click="cancelDialogDelete()"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text align="center">
          <v-icon x-large color="warning" class="pb-5">
            mdi-alert-circle
          </v-icon>
          <br />
          ¿Está seguro de eliminar <b>{{ usertList.name }}</b> que esta siendo
          <br />
          utilizada en campaña en curso?
          <div class="mt-3">
            Por seguridad ingresa la palabra ‘borrar’ para confirmar.
          </div>
          <v-text-field
            v-model="textDelete"
            label='Ingresar "borrrar"'
            placeholder='Ingresar "borrrar"'
            type="text"
            outlined
            class="mt-10 mx-16"
            @input="verifyDelete($event)"
          />
        </v-card-text>
        <v-card-actions class="justify-center pb-10">
          <v-btn large outlined color="primary" @click="cancelDialogDelete()">
            CANCELAR
          </v-btn>
          <v-btn
            large
            color="primary"
            depressed
            class="ml-5"
            :disabled="disabledDelete"
            @click="actionDelete()"
          >
            SI ELIMINAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'

export default {
  mixins: [customTableBffMixin],
  data() {
    return {
      loading: false,
      databasesList: [],
      dialogDelete: false,
      disabledDelete: true,
      textDelete: '',
      usertList: Object,
      title: '',
      test: 'databases',
      itemsPerPage: 5,
      actualPage: 1,
      totalElements: 0,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      menuItems: [
        { text: 'Ver base de datos', icon: 'mdi-database' },
        { text: 'Descargar', icon: 'mdi-download' },
        { text: 'Eliminar', icon: 'mdi-delete' },
      ],
      headers: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Nº de registros', value: 'records' },
        { text: 'Estado', value: 'state' },
        { text: 'Aplicaciones', value: 'applications', sortable: false },
        { text: 'Fecha creación', value: 'date' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  created() {
    this.DATABASE_STATE_TEXT = {
      loaded: 'CARGADA 100%',
      loading: 'CARGANDO',
      waiting: 'EN ESPERA',
      abort: 'CANCELADO',
      pause: 'PAUSADO',
    }
  },
  mounted() {},
  methods: {
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
    printEvent(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      this.getDatabaseList()
    },
    isStateSuccess(state) {
      if (state === 'loaded') {
        return true
      }
      return false
    },
    isStateWaiting(state) {
      if (state === 'waiting') {
        return true
      }
      return false
    },
    isStateAbort(state) {
      if (state === 'abort') {
        return true
      }
      return false
    },
    menuActions(item, action) {
      if (action === 'Ver base de datos') {
        this.$router.push({
          name: 'DatabaseView',
          params: { id: item.id },
        })
      } else if (action === 'Descargar') {
        console.log('descargar bd: ', item)
      } else if (action === 'Eliminar') {
        this.usertList = item
        this.dialogDelete = true
      }
    },
    actionDelete() {
      this.textDelete = ''
      this.dialogDelete = false
      this.databasesList = this.databasesList.filter(
        (item) => item.id !== this.usertList.id
      )
    },
    verifyDelete(item) {
      if (item === 'borrar') {
        this.disabledDelete = false
        return
      }
      this.disabledDelete = true
    },
    cancelDialogDelete() {
      this.textDelete = ''
      this.dialogDelete = false
    },
  },
}
</script>
