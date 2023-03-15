<template>
  <v-data-table
    :loading="loading"
    :headers="headersAux"
    :items="items"
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
    <template v-slot:no-data>
      <v-card-text>
        <v-col>
          <span class="text-h7 gray300--text">
            {{ emptyLabel }}
          </span>
        </v-col>
      </v-card-text>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <span :class="getSpanColor(item.status)">
        {{ getSpanLabel(item.status) }}
      </span>
    </template>
    <template v-slot:[`item.content`]="{ item }">
      <v-btn dark icon @click="$emit('btn-action', item)">
        <v-icon :color="buttonColor"> {{ buttonIcon }} </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'SimpleDatatable',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    emptyLabel: {
      type: String,
      default: 'No existen registros...',
    },
    buttonIcon: {
      type: String,
      default: 'mdi-eye',
    },
    buttonColor: {
      type: String,
      default: 'primary',
    },
    spanLabelsConst: {
      type: Object,
      default: () => ({}),
    },
    spanColorsConst: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    totalElements: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      headersAux: [],
      actualPage: 1,
      itemsPerPage: 5,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
    }
  },

  watch: {
    headers: {
      handler(value) {
        this.headersAux = value
      },
    },
  },

  beforeMount() {
    this.headersAux = this.headers
  },

  methods: {
    getSpanColor(status) {
      if (this.spanColorsConst[status]) return this.spanColorsConst[status]
      return 'accent--text'
    },
    getSpanLabel(status) {
      if (this.spanLabelsConst[status]) return this.spanLabelsConst[status]
      return 'Desconocido'
    },
    async printEvent(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      const updateObject = {
        actualPage: this.actualPage,
        itemsPerPage: this.itemsPerPage,
        sortBy: this.sort.sortBy,
        sortDesc: this.sort.sortDesc,
      }
      this.updateListAux = updateObject
      await this.$emit('update-list', updateObject)
    },
  },
}
</script>
