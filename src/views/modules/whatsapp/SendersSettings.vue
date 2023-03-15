<!-- eslint-disable eqeqeq -->
<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div v-if="tableActive">
        <v-row no-gutters>
          <v-col sm="12" md="7">
            <h1>Remitentes</h1>
          </v-col>
          <v-col sm="12" md="5">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="activateCreateSender = true">
                <v-icon> mdi-plus </v-icon>CREAR REMITENTE
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2">
              Aquí podrás encontrar el listado de remitentes y crear uno nuevo.
            </P>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <senders-table
              :loading="loading"
              :senders-list="sendersList"
              :headers="headers"
              :total-elements="totalElements"
              @edit-dialog-activator="editSender($event)"
              @delete-sender="dialogDelete($event)"
              @filter-inputs="filterInputs($event)"
              @clean-inputs="cleanFilters($event)"
              @update-list="updateTable"
            />
          </v-col>
        </v-row>
      </div>
      <div v-if="dialogSentSuccessfully" class="justify-center" no-gutters>
        <sent-successfully-dialog
          :content="contentRequestSummary"
          @btn-add-action="btnBackListPN()"
        />
      </div>
    </v-col>
    <add-sender-dialog
      v-model="activateCreateSender"
      @btn-existing-number-action="acceptExistingNumber()"
      @btn-create-number-action="acceptCreateNumber()"
    />
    <existing-number-dialog
      v-model="dialogExistingNumber"
      :add-new-row="addNewRow"
      :countries="countries"
      @btn-add-action="dialogAddCreateNumber('1')"
    />
    <create-number-dialog
      v-model="dialogCreateNumber"
      :add-new-row="addNewRow"
      :countries="countries"
      @btn-add-action-yt="dialogAddCreateNumber('2')"
      @btn-add-action-nt="dialogAddCreateNumber('3')"
    />
    <delete-dialog-simple
      v-model="deleteDialog"
      :element-to-delete="senderAux.name"
      @btn-active-action="deleteSender()"
    />
  </v-container>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import SendersTable from '@/components/modules/whatsapp/settings/SendersTable.vue'
import AddSenderDialog from '@/components/modules/whatsapp/settings/AddSenderDialog.vue'
import CreateNumberDialog from '@/components/modules/whatsapp/settings/CreateNumberDialog.vue'
import SentSuccessfullyDialog from '@/components/modules/whatsapp/settings/SentSuccessfullyDialog.vue'
import ExistingNumberDialog from '@/components/modules/whatsapp/settings/ExistingNumberDialog.vue'
import DeleteDialogSimple from '@/components/util/DeleteDialogSimple.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SendersSettings',
  components: {
    SendersTable,
    AddSenderDialog,
    SentSuccessfullyDialog,
    ExistingNumberDialog,
    CreateNumberDialog,
    DeleteDialogSimple,
  },
  mixins: [whatsappBffMixin],
  data() {
    return {
      tableActive: true,
      isSenderDeleted: false,
      dialogSentSuccessfully: false,
      deleteDialog: false,
      valid: false,
      loading: false,
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      senderAux: {
        id: null,
        name: '',
        businessIdAccount: '',
        prefix: { id: '', name: '', flag: '', prefix: '' },
        email: '',
        phone: '',
        state: '',
      },
      activateCreateSender: false,
      editing: false,
      dialogCreateNumber: false,
      dialogExistingNumber: false,
      conditions: ['Chile', 'Peru'],
      idAdd: 1,
      addNewRow: {},
      headers: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'Estado', value: 'state' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      sendersList: [],
      contentRequestSummary: {},
      countries: [],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    dialogCreateNumber: {
      handler(value) {
        if (!value) {
          this.editing = false
          this.cleanSenderAux()
        }
      },
    },
  },
  async mounted() {
    this.countries = await this.getAllFlagsPrefix()
  },
  methods: {
    async getSenderList() {
      this.loading = true

      let name = '-1'
      let phone = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.filters !== undefined) {
        if (this.filters.name !== '') {
          name = this.filters.name
        }
        if (this.filters.phone !== '') {
          phone = this.filters.phone
        }
      }
      const filterService = {
        clientId: this.clientId,
        name,
        phone,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const senderObjectQuery = await this.getSendersByClient(filterService)
      this.sendersList = await senderObjectQuery.dataList
      this.totalElements = await senderObjectQuery.totalElements

      this.loading = false
    },
    acceptExistingNumber() {
      this.activateCreateSender = false
      const newRecord = {
        id: null,
        name: '',
        businessIdAccount: '',
        prefix: {
          id: '402881da82db21790182db2493bc011d',
          name: 'Chile',
          flag: 'em-flag-cl',
          prefix: '56',
        },
        phone: '',
        state: '',
      }
      this.addNewRow = newRecord
      this.dialogExistingNumber = true
    },
    editSender(sender) {
      console.log(sender)
      this.senderAux = sender
      this.editing = true
      this.acceptCreateNumber()
    },
    acceptCreateNumber() {
      this.cleanSender()
      this.activateCreateSender = false
      let newRecord = {
        id: null,
        name: '',
        businessIdAccount: '',
        prefix: {
          id: '402881da82db21790182db2493bc011d',
          name: 'Chile',
          flag: 'em-flag-cl',
          prefix: '56',
        },
        email: '',
        phone: '',
        state: '',
      }
      if (this.senderAux && this.editing) {
        newRecord = {
          id: this.senderAux.id,
          name: this.senderAux.name,
          businessIdAccount: this.senderAux.businessIdAccount,
          prefix: {
            id: this.senderAux.prefix.id,
            name: this.senderAux.prefix.name,
            flag: this.senderAux.prefix.flag,
            prefix: this.senderAux.prefix.prefix,
          },
          email: this.senderAux.email,
          phone: this.senderAux.phone.replace(this.senderAux.prefix.prefix, ''),
          state: this.senderAux.state,
        }
      }
      this.cleanSender()
      this.addNewRow = newRecord
      this.dialogCreateNumber = true
    },
    async dialogAddCreateNumber(type) {
      let subtitleTMP = ''
      let itemsTMP = []
      if (type === '1') {
        this.dialogExistingNumber = false
        this.addNewRow.state = 'VALIDADO'
        this.addNewRow.phone = `+${this.addNewRow.prefix.prefix}${this.addNewRow.phone}`
        subtitleTMP = 'Tipo: Portar numero existente'
        itemsTMP = [
          {
            label: 'Nombre empresa',
            text: this.addNewRow.name,
          },
          {
            label: 'Número de celular',
            text: this.addNewRow.businessIdAccount,
          },
          {
            label: 'Número celular o fijo para activar',
            text: this.addNewRow.phone,
          },
        ]
      }
      if (type === '2') {
        this.dialogCreateNumber = false
        this.addNewRow.state = 'VALIDADO'
        this.addNewRow.phone = `+${this.addNewRow.prefix.prefix}${this.addNewRow.phone}`
        subtitleTMP = 'Tipo: Crear número / Si tengo número'
        this.addNewRow.hasNumber = true
        itemsTMP = [
          {
            label: 'Nombre empresa',
            text: this.addNewRow.name,
          },
          {
            label: 'Número de celular',
            text: this.addNewRow.phone,
          },
        ]
        this.editing = false
        this.dialogCreateNumber = false
      }
      if (type === '3') {
        this.dialogCreateNumber = false
        this.addNewRow.state = 'EN ESPERA'
        subtitleTMP = 'Tipo: Crear número / No tengo número'
        this.addNewRow.hasNumber = false
        itemsTMP = [
          {
            label: 'Código de área',
            text: `${this.addNewRow.prefix.name} +${this.addNewRow.prefix.prefix}`,
          },
          {
            label: 'Email',
            text: this.addNewRow.email,
          },
        ]
        this.dialogCreateNumber = false
      }
      this.addNewRow.id = await this.saveSender(this.addNewRow)
      const contentRequestSummarytmp = {
        title: 'Resumen solicitud de remitente',
        subtitle: subtitleTMP,
        items: itemsTMP,
      }
      this.contentRequestSummary = contentRequestSummarytmp
      this.dialogSentSuccessfully = true
      this.getSenderList()
      this.tableActive = false
      this.cleanSender()
    },
    btnBackListPN() {
      this.tableActive = true
      this.dialogSentSuccessfully = false
    },
    dialogDelete(sender) {
      this.senderAux = JSON.parse(JSON.stringify(sender))
      this.deleteDialog = true
    },
    async deleteSender() {
      if (this.senderAux.id === null) {
        this.removeElementFromArray(this.sendersList, this.senderAux)
      } else {
        await this.deleteSenderById(this.senderAux.id)
        this.getSenderList()
      }
      this.deleteDialog = false
    },
    async filterInputs(filters) {
      this.filters = filters
      this.getSenderList()
    },
    removeElementFromArray(array, item) {
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    cleanSender() {
      this.addNewRow = {
        id: null,
        name: '',
        businessIdAccount: '',
        prefix: {
          id: '402881da82db21790182db2493bc011d',
          name: 'Chile',
          flag: 'em-flag-cl',
          prefix: '56',
        },
        phone: '',
        state: '',
      }
    },
    cleanSenderAux() {
      this.senderAux = {
        id: null,
        name: '',
        businessIdAccount: '',
        prefix: {
          id: '402881da82db21790182db2493bc011d',
          name: 'Chile',
          flag: 'em-flag-cl',
          prefix: '56',
        },
        phone: '',
        state: '',
      }
    },
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      if (event.sortBy === undefined) {
        this.sort.sortBy = '-1'
      } else {
        this.sort.sortBy = event.sortBy
      }
      this.sort.sortDesc = event.sortDesc
      this.getSenderList()
    },
    async cleanFilters(event) {
      this.filters = event
      this.filters = { name: '', phone: '' }
      this.getSenderList()
    },
  },
}
</script>
<style scoped>
.body-dialog {
  max-height: calc(100vh * 0.7);
}
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.box-row {
  border: 1px solid var(--v-gray100-base);
  width: 100%;
  overflow-y: auto;
}
</style>
