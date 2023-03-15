<template>
  <v-container fluid>
    <v-col cols="12">
      <h1 style="font-weight: 500; font-size: 2rem">Resellers</h1>
      <v-btn
        v-if="can('CREATE_RESELLERS', 'settings')"
        depressed
        style="float: right"
        color="primary"
        @click="goToModuleView('create-reseller')"
      >
        <v-icon left> mdi-plus </v-icon>
        CREAR RESELLER
      </v-btn>
      <div class="align-center pt-8">
        <p>Buscar un reseller por filtro</p>
        <v-row class="mt-4">
          <v-col cols="4">
            <v-text-field
              v-model="searchName"
              label="Nombre"
              placeholder="Ingresar nombre"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <div class="mt-2">
      <v-skeleton-loader v-if="loading" type="table" />
      <v-data-table
        v-else
        :headers="headers"
        :items="filteredResellersList"
        :items-per-page="5"
      >
        <template v-slot:[`item.disabled`]="{ item }">
          <v-icon v-if="!item.disabled" color="success"> mdi-check </v-icon>
          <v-icon v-else color="error"> mdi-close </v-icon>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>
<script>
import adminBffMixin from '@/mixins/services/adminBffMixin'
import permissionsMixin from '@/mixins/permissionsMixin'

export default {
  name: 'Resellers',
  mixins: [adminBffMixin, permissionsMixin],

  data() {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Correo', value: 'email' },
        { text: 'Estado', value: 'disabled' },
      ],
      loading: false,
      resellersList: [],
      searchName: '',
    }
  },
  computed: {
    filteredResellersList() {
      return this.resellersList.filter((reseller) => {
        if (!this.searchName) return true
        return reseller.name
          .toLowerCase()
          .includes(this.searchName.toLowerCase())
      })
    },
  },
  async mounted() {
    this.loading = true
    this.resellersList = await this.getResellers()
    this.loading = false
  },
  methods: {
    goToModuleView(route) {
      this.$router.push(route)
    },
  },
}
</script>
