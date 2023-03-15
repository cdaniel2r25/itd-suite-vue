<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="databasesList"
      dense
      class="striped-table"
      :footer-props="{
        'show-current-page': true,
        'show-first-last-page': true,
        'items-per-page-text': 'Elementos por página',
        'items-per-page-options': [5, 10, 15, 20, 25],
      }"
    >
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status === 'EN ESPERA'" class="warning--text">
          EN ESPERA
        </div>
        <div v-else class="gray300--text">
          {{ item.status }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'DatabaseWhatsappPending',
  props: {
    databasesList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', align: 'start', width: '100' },
        { text: 'Cliente', value: 'clientName', align: '' },
        { text: 'Nombre', value: 'name', align: '' },
        {
          text: 'Fecha de envío',
          value: 'shippingDate',
          align: '',
          width: '150',
        },
        { text: 'Estado', value: 'status', align: '', width: '150' },
        {
          text: 'Volumen de envío',
          value: 'shippingVolume',
          align: '',
          width: '150',
        },
        { text: 'Enviados', value: 'sent', align: '', width: '100' },
      ],
    }
  },
}
</script>

<style></style>
