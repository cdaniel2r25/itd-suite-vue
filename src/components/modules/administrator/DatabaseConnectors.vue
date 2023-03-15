<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <v-row class="mt-5">
      <v-col cols="3" class="d-flex">
        <v-select
          v-model="clientFilter"
          dense
          :items="clientList"
          item-text="name"
          item-value="id"
          label="Clientes"
          placeholder="Filtrar por cliente"
          class="mt-2"
        />
      </v-col>
      <v-col cols="3">
        <v-btn
          outlined
          color="primary"
          @click="$emit('filter-connections', clientFilter)"
        >
          Buscar
        </v-btn>
      </v-col>
      <v-col cols="6">
        <div class="d-flex justify-end">
          <v-btn text color="primary" @click="reorderDataTable()">
            <v-icon left>mdi-pencil</v-icon>
            reordenar columnas
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row :class="activateBtn ? 'mb-2' : 'mb-0'">
      <v-col cols="6">
        <v-expand-transition>
          <div v-if="activateBtn" class="d-flex justify-start">
            <v-btn text color="primary" @click="changeCondition(true)">
              <v-icon left>mdi-check</v-icon>
              habilitar
            </v-btn>
            <v-btn
              text
              color="primary"
              class="ml-2"
              @click="changeCondition(false)"
            >
              <v-icon left>mdi-cancel</v-icon>
              desabilitar
            </v-btn>
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>
    <div class="mt-0">
      <v-data-table
        ref="vDataTable"
        v-model="selected"
        dense
        :headers="headers"
        :items="databasesList"
        item-key="id"
        :loading="loading"
        :expanded.sync="expanded"
        :hide-default-footer="hideFooter"
        show-expand
        show-select
        single-select
        :footer-props="{
          'show-current-page': true,
          'show-first-last-page': true,
          'items-per-page-text': 'Elementos por página',
          'items-per-page-options': [5, 10, 15, 20, 25],
        }"
      >
        <template v-slot:[`item.status`]="{ item }">
          <div class="d-flex align-center">
            <v-switch
              v-model="item.status"
              color="primary"
              @change="$emit('change-status', item)"
            />
            <div v-if="item.error !== ''">
              <v-tooltip right color="accent">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="secondary" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <div>
                  <div class="pb-2 white--text font-weight-bold help-text">
                    {{ item.error }}
                  </div>
                </div>
              </v-tooltip>
            </div>
          </div>
        </template>
        <template v-slot:[`item.condition`]="{ item }">
          <div v-if="item.condition === true">
            <v-icon color="greencheck">mdi-check-bold</v-icon>
          </div>
          <div v-else>
            <v-icon color="error">mdi-close</v-icon>
          </div>
        </template>
        <template v-slot:[`item.connectionStatus`]="{ item }">
          <div
            v-if="item.connectionStatus === 'ONLINE'"
            class="d-flex flex-column"
          >
            <div class="greencheck--text">
              {{ item.connectionStatus }}
            </div>
            <div class="caption gray300--text">
              {{ item.connectionDate }}
            </div>
          </div>
          <div v-else class="error--text">
            {{ item.connectionStatus }}
          </div>
        </template>
        <template v-slot:[`item.menu`]="{ item }">
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
                  @click="menuActions(item, menuItem.action)"
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
        <template v-slot:expanded-item="{ item }">
          <td
            :colspan="headers.length + 1"
            :class="{
              'ma-0 pa-0': true,
              'expanded-closing': !transitioned[getItemId(item)],
            }"
            style="height: auto; background-color: white"
          >
            <v-expand-transition>
              <div v-show="transitioned[getItemId(item)]">
                <div class="px-10 pb-10 pt-5" style="min-height: 100px">
                  <v-data-table
                    ref="childTable"
                    :headers="expandedTableHeaders"
                    :items="item.senders"
                    hide-default-footer
                    class="striped-table"
                    item-key="id"
                  >
                    <template v-slot:[`item.actions`]="{ item: childItem }">
                      <v-menu bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon color="primary" v-bind="attrs" v-on="on">
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="menuItem in menuItemsChildTable"
                            :key="menuItem.action"
                            @click="
                              menuActionsChildTable(childItem, menuItem.action)
                            "
                          >
                            <v-list-item-icon>
                              <v-icon>{{ menuItem.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{
                              menuItem.text
                            }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template
                      v-slot:[`item.processThread`]="{ item: childItem }"
                    >
                      <v-row>
                        <v-btn
                          color="primary"
                          text
                          :disabled="childItem.processThread === undefined"
                          @click="processThreadDetail(childItem.processThread)"
                        >
                          ver detalle
                        </v-btn>
                        <div
                          v-if="
                            childItem.processThread !== undefined &&
                            checkDownServices(childItem.processThread)
                          "
                        >
                          <v-tooltip
                            bottom
                            color="accent"
                            nudge-bottom="6"
                            content-class="custom-tooltip"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="pt-1"
                                color="secondary"
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <div>
                              <div
                                class="py-2 white--text font-weight-bold help-text"
                              >
                                Uno o más servicios caídos. Se recomienda
                                reiniciar el servicio
                              </div>
                            </div>
                          </v-tooltip>
                        </div>
                      </v-row>
                    </template>
                    <template
                      v-slot:[`item.lastProcessActive`]="{ item: childItem }"
                    >
                      {{
                        childItem.lastProcessActive !== undefined
                          ? childItem.lastProcessActive
                          : '-'
                      }}
                    </template>
                    <template v-slot:[`item.state`]="{ item: childItem }">
                      <v-row>
                        <div v-if="item.type !== 'DUMMY'">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-chip
                                outlined
                                v-bind="attrs"
                                class="gray300"
                                :color="
                                  childItem.state !== 'PENDIENTE'
                                    ? 'success'
                                    : 'darkgray'
                                "
                                style="background: white !important"
                                v-on="on"
                              >
                                <v-icon
                                  small
                                  left
                                  :color="
                                    childItem.state !== 'PENDIENTE'
                                      ? 'success'
                                      : 'darkgray'
                                  "
                                >
                                  mdi-checkbox-blank-circle
                                </v-icon>
                                {{
                                  childItem.state !== 'PENDIENTE'
                                    ? 'Activo'
                                    : 'Inactivo'
                                }}
                                <v-icon right color="gray300">
                                  mdi-menu-down
                                </v-icon>
                              </v-chip>
                            </template>
                            <v-list>
                              <v-list-item
                                @click="changeStatus('start', childItem.id)"
                              >
                                <v-list-item-icon class="mr-3">
                                  <v-icon small color="success">
                                    mdi-checkbox-blank-circle
                                  </v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="accent--text">
                                  Activo
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                @click="changeStatus('stop', childItem.id)"
                              >
                                <v-list-item-icon class="mr-3">
                                  <v-icon small color="darkgray">
                                    mdi-checkbox-blank-circle
                                  </v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="accent--text">
                                  Inactivo
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                        <div v-else>
                          <v-chip
                            outlined
                            color="gray300"
                            style="background: white !important"
                          >
                            <v-icon small left color="warning">
                              mdi-checkbox-blank-circle
                            </v-icon>
                            <span class="warning--text">PENDIENTE</span>
                          </v-chip>
                        </div>
                        <div
                          v-if="childItem.state !== 'PENDIENTE'"
                          class="pl-2"
                        >
                          <v-btn
                            icon
                            color="primary"
                            @click="restartStatus(childItem.id)"
                          >
                            <v-icon
                              :class="!restartConnector ? '' : 'inverse-rotate'"
                            >
                              mdi-restart
                            </v-icon>
                          </v-btn>
                        </div>
                      </v-row>
                    </template>
                    <template v-slot:[`item.online`]="{ item: childItem }">
                      <v-card
                        :color="childItem.online ? 'success' : 'gray300'"
                        class="text-center white--text"
                      >
                        <span>
                          {{ childItem.online ? 'ONLINE' : 'OFFLINE' }}
                        </span>
                      </v-card>
                      {{ childItem.lastCheckOnline }}
                    </template>
                  </v-data-table>
                </div>
              </div>
            </v-expand-transition>
          </td>
        </template>
        <template v-slot:[`item.data-table-expand`]="props">
          <v-icon
            class="primary--text"
            :class="{
              'v-data-table__expand-icon': true,
              'v-data-table__expand-icon--active':
                props.isExpanded && transitioned[getItemId(props.item)],
            }"
            @click="toggleExpand(props)"
          >
            {{ props.isExpanded ? 'mdi-close' : 'mdi-eye' }}
          </v-icon>
        </template>
      </v-data-table>
    </div>
    <reorder-columns-dialog
      v-model="activeReorder"
      :item-database="headersClone"
      @primary-btn-action="reorderDataTableList"
      @primary-btn-cancel="activeReorder = false"
      @move-down="moveDown"
      @move-up="moveUp"
    />
    <v-row v-if="threadAux" justify="center">
      <v-dialog v-model="threadDetail" persistent max-width="500">
        <v-card>
          <v-card-title class="d-flex text-h5 justify-center accent--text">
            Proceso general
          </v-card-title>
          <v-card-subtitle
            class="d-flex justify-center align-center accent--text mt-1"
            style="font-weight: 500"
          >
            <div>
              <v-icon
                v-if="threadAux.name === undefined"
                class="pr-1"
                color="secondary"
              >
                mdi-alert-circle
              </v-icon>
            </div>
            {{
              threadAux.name !== undefined
                ? threadAux.name
                : 'Uno o más servicios caídos. Se recomienda reiniciar el servicio'
            }}
          </v-card-subtitle>
          <v-card-subtitle
            class="d-flex justify-center accent--text"
            style="font-weight: 500"
          >
            <span
              :class="
                threadAux.alive !== undefined && threadAux.alive
                  ? 'success--text'
                  : 'gray300--text'
              "
            >
              {{
                threadAux.alive !== undefined && threadAux.alive
                  ? 'ACTIVO'
                  : 'INACTIVO'
              }}
            </span>
          </v-card-subtitle>
          <v-card-text>
            <v-divider class="mt-2" />
            <v-row no-gutters class="pt-5">
              <v-col class="d-flex justify-center">Envío masivo</v-col>
              <v-col class="d-flex justify-center">
                <span
                  :class="
                    threadAux.massive !== undefined && threadAux.massive.alive
                      ? 'success--text'
                      : 'gray300--text'
                  "
                >
                  {{
                    threadAux.massive !== undefined && threadAux.massive.alive
                      ? 'ACTIVO'
                      : 'INACTIVO'
                  }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="my-5" />
            <v-row no-gutters class="mt-5">
              <v-col class="d-flex justify-center">Envío único</v-col>
              <v-col class="d-flex justify-center">
                <span
                  :class="
                    threadAux.fast !== undefined && threadAux.fast.alive
                      ? 'success--text'
                      : 'gray300--text'
                  "
                >
                  {{
                    threadAux.fast !== undefined && threadAux.fast.alive
                      ? 'ACTIVO'
                      : 'INACTIVO'
                  }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="mt-5" />
          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer />
            <v-btn color="primary" @click="closeThreadDialog()"> Cerrar </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import ReorderColumnsDialog from '@/components/modules/administrator/ReorderColumnsDialog.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import administratorBffMixin from '@/mixins/services/administratorBffMixin'

export default {
  name: 'DatabaseConnectors',
  components: { ReorderColumnsDialog },
  mixins: [adminBffMixin, administratorBffMixin],
  props: {
    databasesList: {
      type: Array,
      default: () => [],
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: [],
      transitioned: [],
      closeTimeouts: {},
      filterDrawer: false,
      singleExpand: true,
      activateBtn: false,
      activeReorder: false,
      clientFilter: '',
      headersClone: [],
      clientList: [],
      headers: [
        { text: '', value: 'status', align: '', width: '50' },
        { text: 'Nombre', value: 'name', align: '' },
        { text: 'Proveedor', value: 'type', align: 'start' },
        { text: 'Host', value: 'host', align: '' },
        {
          text: 'Detalle',
          value: 'data-table-expand',
          align: 'center',
          width: 200,
        },
        { text: 'Acciones', value: 'menu', width: 1, sortable: false },
      ],
      expandedTableHeaders: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'Estado', value: 'state', width: '200' },
        {
          text: 'Último proceso activo',
          value: 'lastProcessActive',
          align: 'center',
        },
        { text: 'Última conexión', value: 'online', width: '150' },
        {
          text: '',
          value: 'processThread',
          width: '200',
          align: 'center',
          sortable: false,
        },
        {
          text: '',
          align: 'center',
          value: 'actions',
          sortable: false,
          width: 1,
        },
      ],
      menuItemsChildTable: [
        { action: 'edit', text: 'Editar', icon: 'mdi-pencil' },
        { action: 'unassign', text: 'Desasignar', icon: 'mdi-phone-minus' },
      ],
      menuItems: [
        { action: 'edit', text: 'Editar', icon: 'mdi-pencil' },
        { action: 'delete', text: 'Eliminar', icon: 'mdi-delete' },
      ],
      selected: [],
      restartConnector: false,
      threadAux: null,
      threadDetail: false,
    }
  },
  watch: {
    selected(newSeleted) {
      if (newSeleted.length !== 0) {
        this.activateBtn = true
      } else {
        this.activateBtn = false
      }
    },
  },
  mounted() {
    this.getClients()
  },
  methods: {
    async getClients() {
      const params = {
        page: -1,
      }
      const clientResponse = await this.getClientList(params)
      this.clientList = clientResponse.dataList
    },
    reorderDataTable() {
      this.activeReorder = true
      this.headersClone = JSON.parse(JSON.stringify(this.headers))
      this.headersClone.forEach((item) => {
        if (item.align === ' d-none') {
          item.check = false
        } else {
          item.check = true
        }
      })
    },
    moveUp(item) {
      const index = this.headersClone.indexOf(item)
      if (index > 0) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            if (indexI === index - 1) {
              newList.push(item)
            }
            newList.push(itemI)
          }
        })
        this.headersClone = newList
      }
    },
    moveDown(item) {
      const index = this.headersClone.indexOf(item)
      if (index + 1 <= this.headersClone.length - 1) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            newList.push(itemI)
            if (indexI === index + 1) {
              newList.push(item)
            }
          }
        })
        this.headersClone = newList
      }
    },
    reorderDataTableList(listHeaders) {
      const newHearders = []
      listHeaders.forEach((item) => {
        let ver = ' d-none'
        if (item.check === true) {
          ver = ''
        }
        const newItem = {
          text: item.text,
          value: item.value,
          align: ver,
          width: item.width,
        }
        newHearders.push(newItem)
      })
      this.headers = newHearders
      this.activeReorder = false
    },
    changeCondition(value) {
      this.$emit('change-condition', value, this.selected)
      this.selected = []
    },
    menuActions(item, action) {
      if (action === 'edit') {
        this.$router.push({ name: 'CreateConnector', params: { id: item.id } })
      } else if (action === 'delete') {
        this.$emit('delete-connector', item)
      }
    },
    changeName(filterName) {
      this.filter.clientName = filterName
    },
    menuActionsChildTable(item, action) {
      if (action === 'edit') {
        this.$router.push({ name: 'SenderForm', params: { id: item.id } })
      } else if (action === 'unassign') {
        this.unassignSenderToConnection(item)
      }
      if (action) console.log(item)
      else console.log(item)
    },
    async unassignSenderToConnection(sender) {
      await this.assignSenderToWhatsappConnection(sender)
      this.$emit('filter-connections', '-1')
    },
    getItemId(item) {
      return item.id
    },
    toggleExpand(props) {
      const { item } = props
      const id = this.getItemId(item)
      if (props.isExpanded && this.transitioned[id]) {
        this.closeExpand(item)
      } else {
        clearTimeout(this.closeTimeouts[id])
        props.expand(true)
        this.$nextTick(() => this.$set(this.transitioned, id, true))
        if (this.singleExpand)
          this.$nextTick(() =>
            this.expanded.forEach((i) => i !== item && this.closeExpand(i))
          )
      }
    },
    closeExpand(item) {
      const id = this.getItemId(item)
      this.$set(this.transitioned, id, false)
      this.closeTimeouts[id] = setTimeout(
        () => this.$refs.vDataTable.expand(item, false),
        600
      )
    },
    processThreadDetail(activeProcess) {
      this.threadAux = activeProcess
      this.threadDetail = true
    },
    closeThreadDialog() {
      this.threadDetail = false
      this.threadAux = null
    },
    async changeStatus(action, id) {
      if (action === 'start')
        await this.startConnectorById(id).then(() => {
          this.$router.go()
        })
      else if (action === 'stop')
        await this.stopConnectorById(id).then(() => {
          this.$router.go()
        })
    },
    async restartStatus(id) {
      this.restartConnector = true
      await this.restartCheckConnectorById(id).finally(() => {
        this.$router.go()
        this.restartConnector = false
      })
    },
    checkDownServices(thread) {
      if (
        !thread.alive ||
        thread.massive === undefined ||
        !thread.massive.alive ||
        thread.fast === undefined ||
        !thread.fast.alive
      )
        return true
      return false
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
  padding-top: 6px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
}
.actions-style td:last-child {
  position: absolute;
  right: 0;
  padding-top: 15px;
  height: 67px;
}
.header-lines {
  border-top: thin solid rgba(0, 0, 0, 0.12);
}
.expanded-closing {
  border-bottom: none !important;
}
.custom-tooltip {
  opacity: 1 !important;
}
</style>
