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
        <v-btn outlined color="primary" @click="getSurveys()">BUSCAR</v-btn>
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
    <div class="mt-10">
      <v-data-iterator
        v-if="surveyList"
        :items="surveyList"
        :loading="loading"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        hide-default-footer
      >
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <survey-sheet
                :item="item"
                @menu-actions="menuActions"
                @active-select="activeSelect"
                @view-template="viewTemplate"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:footer>
          <div class="d-flex justify-end align-center mt-6">
            <span class="grey--text">Encuestas por página:</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="gray300"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <span class="mr-4 grey--text">
              Página {{ page }} de {{ numberOfPages }}
            </span>
            <v-btn icon color="gray300" class="mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon color="gray300" class="ml-1" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-iterator>
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
import SurveySheet from '@/components/modules/surveys/SurveySheet.vue'
import EditNewSurveysDialog from '@/components/modules/surveys/EditNewSurveysDialog.vue'

export default {
  name: 'DatabaseRecords',
  components: { DatePickerCalendar, SurveySheet, EditNewSurveysDialog },
  mixins: [surveysBffMixin],
  data() {
    return {
      showEdit: false,
      keyEdit: 0,
      loading: false,
      selectedTab: null,
      searchName: '',
      selectedDate: null,
      itemsPerPageArray: [4, 8, 12],
      surveyList: null,
      totalElements: 0,
      page: 1,
      itemsPerPage: 8,
      menuItems: [
        { action: 'goSurvey', text: 'Ir a encuesta' },
        { action: 'duplicate', text: 'Duplicar' },
        { action: 'remove', text: 'Eliminar' },
      ],
      tabsHeaders: ['TODOS'],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
    numberOfPages() {
      return Math.ceil(this.totalElements / this.itemsPerPage)
    },
  },
  mounted() {
    this.getSurveys()
  },
  methods: {
    async getSurveys() {
      this.loading = true
      let name = '-1'
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
        page: this.page - 1,
        limit: this.itemsPerPage,
      }
      const surveyListTMP = await this.getListOfSurveysByClientId(params)
      this.surveyList = surveyListTMP.dataList
      this.totalElements = surveyListTMP.totalElements
      this.loading = false
    },
    menuActions(item, menuItem) {
      console.log('menu: ', item)
      console.log('menu: ', menuItem)
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    async nextPage() {
      if (this.page + 1 <= this.numberOfPages) {
        this.page += 1
        await this.getSurveys()
      }
    },
    async formerPage() {
      if (this.page - 1 >= 1) {
        this.page -= 1
        await this.getSurveys()
      }
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
    },
    viewTemplate(item) {
      console.log('template: ', item)
    },
  },
}
</script>
<style scoped>
.foot-tab {
  z-index: 20;
}
.border-menu {
  border-bottom: 1px solid var(--v-primary-base);
}
</style>
