<template>
  <div class="mt-6">
    <v-row no-gutters>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="4" class="mt-0">
            <v-text-field
              v-model="searchNotificationName"
              label="Notificación"
              hide-details
              placeholder="Ingresar notificación"
              required
              class="mt-0 pt-0"
            />
          </v-col>
          <v-col cols="12" md="6">
            <date-picker-calendar v-model="searchDate" />
          </v-col>
          <v-col cols="12" md="2" class="pt-0 mt-0">
            <v-btn outlined color="primary" @click="getNotifications()">
              buscar
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="mt-4">
      <v-skeleton-loader v-if="loading" type="table" />
      <notifications-list
        :process-list="notifications"
        :client-id="clientId"
        :total-elements="totalElements"
        :actual-page="actualPage"
        :items-per-page="itemsPerPage"
        @update-table="updateTable"
      />
    </div>
  </div>
</template>

<script>
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import NotificationsList from '@/components/modules/notifications/NotificationsList.vue'
import notificationsBffMixin from '@/mixins/services/notificationsBffMixin'

export default {
  name: 'NotificationsAllTable',
  components: { DatePickerCalendar, NotificationsList },
  mixins: [notificationsBffMixin],
  props: {
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      searchNotificationName: '',
      searchDate: null,
      newNotificationMessages: false,
      notifications: [],
      actualPage: 1,
      itemsPerPage: 5,
      totalElements: 0,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
    }
  },
  methods: {
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getNotifications()
    },
    async getNotifications() {
      this.loading = true
      let name = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.searchNotificationName !== '') {
        name = this.searchNotificationName
      }
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      const params = {
        clientId: this.clientId,
        name,
        date: this.selectedDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const ntfCampaignsTMP =
        await this.getSearchAutomationsProcessesListByQuery(params)
      this.notifications = ntfCampaignsTMP.dataList
      this.totalElements = ntfCampaignsTMP.totalElements
      this.loading = false
    },
  },
}
</script>
