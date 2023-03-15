<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div v-if="tableRestriction" transition="slide-x-transition">
        <v-row no-gutters>
          <v-col lg="7" sm="12">
            <h1>Restricción horaria</h1>
          </v-col>
          <v-col lg="5" sm="12">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="createRestriction()">
                <v-icon> mdi-plus </v-icon>CREAR RESTRICCION
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2">
              Aquí podrás configurar restricciones de horarios en whatsapp.
            </P>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-skeleton-loader v-if="loading" type="table" />
          <restrict-table
            v-else
            v-model="selectedRestriccion"
            :restrict-list="restrictionsList"
            :headers="headers"
            @btn-edit-item="editItemRestriction"
            @btn-delete-item="deleteItemRestriction"
            @restriction-change-status="changeRestrictionActiveStatus"
          />
        </v-row>
      </div>
      <div v-else transition="slide-x-transition">
        <create-restriction
          :item-restriction="selectedRestriccionChange"
          :deactivate-btn="deactivateBtn"
          :active-wait="activeWait"
          :end-process="endProcess"
          :title="changeTitle"
          @btn-return-list="returnList()"
          @btn-add-action="addNewRestriction()"
        />
        <div v-if="endProcess" class="mt-6 ml-5">
          <v-btn
            depressed
            color="primary"
            @click="tableRestriction = !tableRestriction"
          >
            IR A LISTADO
          </v-btn>
        </div>
      </div>
    </v-col>
    <delete-restriction-dialog
      v-model="dialogDelete"
      :selected-restriccion="selectedRestriccion"
      @btn-delete-action="deleteAction()"
    />
  </v-container>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import { mapGetters } from 'vuex'
import RestrictTable from '@/components/modules/whatsapp/settings/RestrictTable.vue'
import CreateRestriction from '@/components/modules/whatsapp/settings/CreateRestriction.vue'
import DeleteRestrictionDialog from '@/components/modules/whatsapp/settings/DeleteRestrictionDialog.vue'

export default {
  components: { RestrictTable, CreateRestriction, DeleteRestrictionDialog },
  mixins: [whatsappBffMixin],
  data() {
    return {
      loading: false,
      dialogDelete: false,
      tableRestriction: true,
      restrictionsList: [],
      headers: [
        { text: 'Activo', value: 'active', sortable: false },
        { text: 'Descripción', align: 'start', value: 'name' },
        { text: '', align: 'center', value: 'sunday' },
        { text: '', align: 'center', value: 'monday' },
        { text: '', align: 'center', value: 'tuesday' },
        { text: '', align: 'center', value: 'wednesday' },
        { text: '', align: 'center', value: 'thursday' },
        { text: '', align: 'center', value: 'friday' },
        { text: '', align: 'center', value: 'saturday' },
        { text: 'Desde', value: 'scheduleFrom' },
        { text: 'Hasta', value: 'scheduleUntil' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      idAdd: 1,
      deactivateBtn: false,
      activeWait: false,
      endProcess: false,
      selectedRestriccion: {},
      selectedRestriccionChange: {},
      changeTitle: '',
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.getRestrictionsList()
  },
  methods: {
    async getRestrictionsList() {
      this.loading = true
      this.restrictionsList = await this.getRestrictionsByClient()
      this.loading = false
    },
    createRestriction() {
      this.tableRestriction = !this.tableRestriction
      if (!this.tableRestriction) {
        this.changeTitle = 'Crear restricción'
        const addItemRestrictionTMP = {
          id: '',
          name: '',
          active: true,
          scheduleFrom: '00:00',
          scheduleUntil: '00:00',
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        }
        this.selectedRestriccionChange = addItemRestrictionTMP
        this.deactivateBtn = false
        this.activeWait = false
        this.endProcess = false
      }
    },
    async returnList() {
      this.tableRestriction = true
      await this.getRestrictionsList()
    },
    async addNewRestriction() {
      this.loading = true
      this.deactivateBtn = true
      this.activeWait = true
      await this.saveRestriction(this.selectedRestriccionChange)
      setTimeout(() => {
        this.activeWait = false
        this.endProcess = true
        this.loading = false
      }, 1000)
      await this.getRestrictionsList()
    },
    editItemRestriction(restriction) {
      this.changeTitle = 'Editar restricción'
      this.selectedRestriccionChange = JSON.parse(JSON.stringify(restriction))
      this.deactivateBtn = false
      this.activeWait = false
      this.endProcess = false
      this.tableRestriction = !this.tableRestriction
    },
    deleteItemRestriction() {
      this.dialogDelete = true
    },
    async deleteAction() {
      this.loading = true
      await this.deleteRestrictionById(this.selectedRestriccion.id)
      this.dialogDelete = false
      await this.getRestrictionsList()
      this.loading = false
    },
    async changeRestrictionActiveStatus(restriction) {
      let statusRestriction = await {
        id: restriction.id,
        status: restriction.active,
      }
      statusRestriction = await this.changeRestrictionStatus(statusRestriction)
      restriction.active = statusRestriction.status
      await this.getRestrictionsList()
    },
  },
}
</script>
