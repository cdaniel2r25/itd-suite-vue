<template>
  <div class="template-div">
    <div class="mt-10"><h3>¿Qué tipo de vehículo prefieres?</h3></div>
    <div class="d-flex justify-end align-center mt-10">
      <v-menu top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            outlined
            color="primary"
            class="mr-2 px-1"
            style="min-width: 30px"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(menuItem, index) in menuItems"
            :key="index"
            @click="menuActions(menuItem.text)"
          >
            <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="mr-2" style="width: 200px">
        <v-menu
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Fecha"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              class="mt-4"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="date"
            no-title
            locale="es-es"
            color="primary"
          />
        </v-menu>
      </div>
      <v-btn
        outlined
        color="primary"
        class="mr-2 px-1"
        style="min-width: 30px"
        @click="filter()"
      >
        <v-icon>mdi-filter</v-icon>
      </v-btn>
      <v-btn outlined color="primary" @click="search()"> buscar </v-btn>
    </div>
    <div class="mt-0">
      <v-card color="lightcyan" height="300px" flat style="position: relative">
        <div class="d-flex align-center justify-center" style="height: 100%">
          Aún no hay resultados.
        </div>
        <div class="copy-style">
          <v-btn icon color="gray300" @click="copy()">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeeResults',
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      date: null,
      menuItems: [
        { text: 'CSV' },
        { text: 'Excel' },
        { text: 'XML' },
        { text: 'PDF' },
      ],
    }
  },
  methods: {
    menuActions(itemMenu) {
      console.log(itemMenu)
    },
    copy() {
      console.log('copy')
    },
    search() {
      console.log('buscar')
    },
    filter() {
      console.log('filtrar')
    },
  },
}
</script>
<style scoped>
.template-div {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.copy-style {
  position: absolute;
  top: 5px;
  right: 0;
}
</style>
