<template>
  <div class="d-flex justify-end">
    <div class="mr-2">
      <v-menu top offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined color="primary" v-bind="attrs" v-on="on">
            <v-icon>mdi-arrow-collapse-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menuItem in menuItems"
            :key="menuItem.action"
            @click="$emit('menu-actions', menuItem)"
          >
            <v-list-item-title>{{ menuItem }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="mr-2 mt-2" style="width: 300px">
      <v-combobox
        v-if="clientList.length > 0"
        v-model="changeClient"
        dense
        :items="clientList"
        :label="labelName"
        item-value="id"
        item-text="name"
        :placeholder="`Ingresar ${labelName}`"
        @change="$emit('change-client', changeClient)"
      />
    </div>
    <v-btn
      outlined
      color="primary"
      class="mr-2"
      @click="$emit('activate-filter-drawer')"
    >
      <v-icon>mdi-filter</v-icon>
    </v-btn>
    <v-btn outlined color="primary" @click="$emit('activate-filter')">
      Buscar
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ActivateFilters',
  props: {
    filterDrawer: {
      type: Boolean,
      default: false,
    },
    labelName: {
      type: String,
      default: 'Cliente',
    },
    clientList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menuItems: ['CSV', 'Excel', 'XML', 'PDF'],
      changeClient: '',
    }
  },
}
</script>

<style></style>
