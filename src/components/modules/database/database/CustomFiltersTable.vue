<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <v-data-table
            :key="tableId"
            :loading="loading"
            :headers="headers"
            :items="customTableData"
            :page.sync="actualPage"
            :items-per-page.sync="itemsPerPage"
            :server-items-length="totalElements"
            :footer-props="{
              'show-current-page': true,
              'show-first-last-page': true,
              'items-per-page-text': 'Elementos por página',
              'items-per-page-options': [5, 10, 15, 20, 25],
            }"
            class="striped-table fluid-table"
            @update:options="printEvent"
          >
            <template v-slot:item.menu="{ item }">
              <v-btn
                v-if="item.name != 'Lista Completa'"
                icon
                color="primary"
                @click="editItem(item)"
              >
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn
                v-if="item.name != 'Lista Completa'"
                icon
                color="primary"
                @click="deleteItem(item)"
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CustomFiltersTable',
  props: {
    customTableData: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    totalElements: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      tableId: 0,
      actualPage: 1,
      itemsPerPage: 5,
    }
  },
  methods: {
    editItem(item) {
      this.$emit('input', item)
      this.$emit('btn-edit-action')
    },
    deleteItem(item) {
      this.$emit('input', item)
      this.$emit('btn-delete-action')
    },
    async printEvent(event) {
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      const updateObject = {
        actualPage: this.actualPage,
        itemsPerPage: this.itemsPerPage,
      }
      await this.$emit('update-list', updateObject)
    },
  },
}
</script>
<style></style>
