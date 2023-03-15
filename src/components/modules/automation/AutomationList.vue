<template>
  <v-list>
    <v-list-group
      v-for="itemProcess in processList"
      :key="itemProcess.id"
      color="primary"
      class="border-top"
    >
      <template v-slot:activator>
        <v-list-item-content>
          <div class="d-flex">
            <div style="width: 10%">
              <v-list-item-title>ID:</v-list-item-title>
              <v-list-item-subtitle>
                {{ itemProcess.id }}
              </v-list-item-subtitle>
            </div>
            <div style="width: 60%">
              <v-list-item-title>Nombre de proceso:</v-list-item-title>
              <v-list-item-subtitle>
                {{ itemProcess.processName }}
              </v-list-item-subtitle>
            </div>
            <div style="width: 10%; text-align: center">
              <v-btn
                color="primary"
                text
                @click="goEditAutomation(itemProcess.id)"
              >
                <v-icon color="primary" class="mr-2"> mdi-pencil </v-icon>
              </v-btn>
            </div>
            <div style="width: 20%; text-align: right">
              <v-list-item-title class="pt-3 caption">
                DETALLE PROCESO
              </v-list-item-title>
            </div>
          </div>
        </v-list-item-content>
      </template>
      <v-list-item-content>
        <v-data-table
          dense
          :headers="headers"
          :items="itemProcess.automationList"
          class="striped-table"
        >
          <template v-slot:[`item.state`]="{ item }">
            <div v-if="item.state" class="greencheck--text">ACTIVO</div>
            <div v-if="!item.state" class="gray300--text">INACTIVO</div>
          </template>
          <template v-slot:[`item.menu`]="{ item }">
            <v-menu bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                  <v-icon> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(menuItem, index) in menuItems"
                  :key="index"
                  @click="menuActions(item, menuItem.text)"
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
      </v-list-item-content>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  name: 'AtomationList',
  props: {
    processList: {
      type: Array,
      default: () => [],
    },
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      automationId: '',
      selectedItem: [],
      headers: [
        {
          text: 'Nombre automatización',
          align: 'start',
          value: 'automationName',
        },
        { text: 'Estado', value: 'state' },
        { text: 'Última ejecución', value: 'lastRun' },
        { text: 'Siguiente ejecución', value: 'nextRun' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      menuItems: [{ text: 'Ver tracking', icon: 'mdi-eye-arrow-right' }],
    }
  },
  methods: {
    menuActions(item, action) {
      if (action === 'Ver tracking') {
        this.$emit('input', item)
        this.$emit('selection-see-tracking-action')
      }
    },
    goEditAutomation(processId) {
      this.$router.push({ name: 'CreateAutomation', params: { id: processId } })
    },
  },
}
</script>

<style scoped>
.border-top {
  border-top: 1px solid var(--v-gray-base);
}
</style>
