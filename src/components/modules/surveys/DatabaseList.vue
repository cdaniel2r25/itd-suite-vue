<template>
  <div>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="searchName"
          label="Nombre"
          hide-details
          placeholder="Ingresar nombre"
          class="mt-0 pt-0"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <date-picker-calendar v-model="selectedDate" label="Fecha creación" />
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn outlined color="primary" @click="getCampaigns()">BUSCAR</v-btn>
      </v-col>
    </v-row>
    <div class="mt-2 d-flex border-menu">
      <v-tabs v-model="selectedTab" color="primary" show-arrows>
        <v-tab v-for="item in tabsHeaders" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-btn icon color="primary" @click="$emit('change-tab-list')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>
    <div class="mt-6">
      <v-data-table
        v-if="surveyList"
        :headers="headers"
        :items="surveyList"
        :loading="loading"
        :items-per-page.sync="itemsPerPage"
        :server-items-length="totalElements"
        :footer-props="{
          'show-current-page': true,
          'show-first-last-page': true,
          'items-per-page-text': 'Elementos por página',
          'items-per-page-options': [5, 10, 15, 20, 25],
        }"
        @update:options="updateTable"
      >
        <template v-slot:[`item.privacyResults`]="{ item }">
          <td class="text-center">
            <v-chip color="lightcyan" text-color="primary">
              {{ item.privacyResults }}
            </v-chip>
          </td>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <td class="text-center">
            <span :class="item.status ? 'success--text' : 'gray300--text'">
              {{ item.status ? 'ACTIVA' : 'INACTIVA' }}
            </span>
          </td>
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
                  <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </div>
    <edit-new-surveys-dialog
      v-if="showEdit"
      :key="keyEdit"
      v-model="showEdit"
      :selected-item="selectedItem"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import surveysBffMixin from '@/mixins/services/surveysBffMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import EditNewSurveysDialog from '@/components/modules/surveys/EditNewSurveysDialog.vue'

export default {
  name: 'DatabaseList',
  components: { DatePickerCalendar, EditNewSurveysDialog },
  mixins: [surveysBffMixin],
  data() {
    return {
      showEdit: false,
      keyEdit: 0,
      selectedTab: null,
      searchName: '',
      selectedDate: null,
      tabsHeaders: ['TODOS'],
      surveyList: null,
      totalElements: 0,
      itemsPerPage: 5,
      loading: false,
      headers: [
        { text: 'Nombre', value: 'name', align: 'start' },
        { text: '', value: 'privacyResults', align: 'center' },
        { text: 'Fecha de creación', value: 'creationDate', align: 'start' },
        { text: 'Estado', value: 'status', align: 'center' },
        { text: 'Respuestas', value: 'answers', align: 'center' },
        { text: 'Acciones', value: 'menu', width: 1, sortable: false },
      ],
      menuItems: [
        { action: 'goSurvey', text: 'Ir a encuesta' },
        { action: 'duplicate', text: 'Duplicar' },
        { action: 'remove', text: 'Eliminar' },
      ],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.getCampaigns()
  },
  methods: {
    async getCampaigns() {
      this.loading = true
      let name = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.searchName !== '') {
        name = this.searchName
      }
      if (this.selectedDate)
        this.selectedDate = this.sortDateRangeToArray(
          this.selectedDate[0],
          this.selectedDate[1]
        )
      const params = {
        clientId: this.clientId,
        name,
        date: this.selectedDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const surveyListTMP = await this.getListOfSurveysByClientId(params)
      this.surveyList = surveyListTMP.dataList
      this.totalElements = surveyListTMP.totalElements
      this.loading = false
    },
    menuActions(item, menuItem) {
      if (menuItem === 'goSurvey') this.activeSelect(item)
      console.log('menu: ', item)
      console.log('menu: ', menuItem)
    },
    async activeSelect(item) {
      const params = {
        clientId: this.clientId,
        surveyId: item.surveyId,
      }
      const newItem = await this.getSurveyTemplateByClientIdAndSurveyId(params)
      this.selectedItem = newItem
      this.keyEdit += 1
      this.showEdit = true
      console.log('paso')
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getCampaigns()
    },
  },
}
</script>
<style scoped>
.border-menu {
  border-bottom: 1px solid var(--v-primary-base);
}
</style>
