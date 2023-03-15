<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="sendersList"
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
            <template v-slot:top>
              <v-row
                :class="
                  menuAssign
                    ? 'my-8 pl-4 align-center'
                    : 'my-3 pl-4 align-center'
                "
                no-gutters
                dense
              >
                <v-col cols="2">
                  <v-text-field
                    v-model="filters.name"
                    label="Nombre"
                    placeholder="Ingresar nombre..."
                    dense
                    hide-details
                  />
                </v-col>
                <v-col class="pl-4" cols="2">
                  <v-text-field
                    v-model="filters.phone"
                    label="Teléfono"
                    placeholder="Ingresar teléfono..."
                    dense
                    hide-details
                  />
                </v-col>
                <v-col class="ml-5">
                  <v-btn
                    color="error"
                    outlined
                    @click="
                      cleanFilters()
                      $emit('clean-inputs', filters)
                    "
                  >
                    limpiar filtros
                  </v-btn>
                  <v-btn
                    class="ml-5"
                    color="primary"
                    outlined
                    @click="$emit('filter-inputs', filters)"
                  >
                    buscar
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.state`]="{ item }">
              <span v-if="item.state === 'VALIDADO'" class="success--text">
                {{ item.state }}
              </span>
              <span v-else class="warning--text">
                {{ item.state }}
              </span>
            </template>
            <template v-slot:[`item.menu`]="{ item, index }">
              <v-menu bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="primary"
                    v-bind="attrs"
                    :disabled="
                      item.state === 'VALIDADO' || item.state === 'EJECUTANDO'
                    "
                    v-on="on"
                  >
                    <v-icon> mdi-dots-vertical </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="menuItem in menuItems"
                    :key="menuItem.action"
                    @click="menuActions(item, menuItem.text, index)"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ menuItem.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SendersTable',
  props: {
    sendersList: {
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
    loading: {
      type: Boolean,
      default: false,
    },
    menuAssign: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actualPage: 1,
      itemsPerPage: 5,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      filters: { name: '', phone: '' },
      menuEdit: [
        { text: 'Editar', icon: 'mdi-pencil' },
        { text: 'Eliminar', icon: 'mdi-delete' },
      ],
      assignMenuItems: [{ text: 'Asignar', icon: 'mdi-phone-plus' }],
    }
  },
  computed: {
    menuItems() {
      if (this.menuAssign) return this.assignMenuItems
      return this.menuEdit
    },
  },
  methods: {
    menuActions(item, action, index) {
      console.log(index)
      if (action === 'Editar') {
        this.$emit('edit-dialog-activator', item)
      } else if (action === 'Eliminar') {
        this.$emit('delete-sender', item)
      } else if (action === 'Asignar') {
        this.$emit('assign-sender', item)
      }
    },
    cleanFilters() {
      this.filters = { name: '', phone: '' }
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
      await this.$emit('update-list', updateObject)
    },
  },
}
</script>
