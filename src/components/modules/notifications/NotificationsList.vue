<template>
  <v-data-table
    :headers="headers"
    :items="processList"
    :total-elements="totalElements"
    :page.sync="actualPage"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="totalElements"
    :footer-props="{
      'show-current-page': true,
      'show-first-last-page': true,
      'items-per-page-text': 'Elementos por página',
      'items-per-page-options': [5, 10, 15, 20, 25],
    }"
    @update:options="$emit('update-table', $event)"
  >
    <template v-slot:[`item.comesFrom`]="{ item }">
      <v-icon
        v-if="item.comesFrom === 'whatsapp' || item.comesFrom === 'sms'"
        color="primary"
      >
        mdi-message-text
      </v-icon>
      <v-icon v-if="item.comesFrom === 'vms'" color="primary">
        mdi-phone
      </v-icon>
      <v-icon v-if="item.comesFrom === 'error'" color="secondary">
        mdi-alert-circle
      </v-icon>
      <v-icon v-if="item.comesFrom === 'group'" color="primary">
        mdi-view-sequential
      </v-icon>
    </template>
    <template v-slot:[`item.notification`]="{ item }">
      <div class="d-fex flex-column my-2">
        <div :class="item.notSeen ? 'font-weight-bold' : ''">
          {{ item.notification }}
        </div>
        <div class="caption">{{ item.date }}</div>
      </div>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'NotificationsList',
  props: {
    processList: {
      type: Array,
      default: () => [],
    },
    clientId: {
      type: String,
      default: '',
    },
    totalElements: {
      type: Number,
      default: 0,
    },
    actualPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      headers: [
        {
          text: '',
          align: 'start',
          value: 'comesFrom',
          width: '50',
        },
        { text: 'Notificación', value: 'notification' },
      ],
    }
  },
}
</script>
