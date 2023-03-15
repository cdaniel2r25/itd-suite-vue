<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <v-data-table
            dense
            :headers="headers"
            :items="restrictList"
            :items-per-page="5"
            hide-default-footer
          >
            <template v-slot:[`item.active`]="{ item }">
              <v-switch
                v-model="item.active"
                color="primary"
                class="pt-4 mb-0 mt-0"
                @change="$emit('restriction-change-status', item)"
              />
            </template>
            <template v-slot:[`item.sunday`]="{ item }">
              <div
                :class="
                  item.sunday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                D
              </div>
            </template>
            <template v-slot:[`item.monday`]="{ item }">
              <div
                :class="
                  item.monday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                L
              </div>
            </template>
            <template v-slot:[`item.tuesday`]="{ item }">
              <div
                :class="
                  item.tuesday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                M
              </div>
            </template>
            <template v-slot:[`item.wednesday`]="{ item }">
              <div
                :class="
                  item.wednesday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                X
              </div>
            </template>
            <template v-slot:[`item.thursday`]="{ item }">
              <div
                :class="
                  item.thursday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                J
              </div>
            </template>
            <template v-slot:[`item.friday`]="{ item }">
              <div
                :class="
                  item.friday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                V
              </div>
            </template>
            <template v-slot:[`item.saturday`]="{ item }">
              <div
                :class="
                  item.saturday
                    ? 'font-weight-medium primary--text'
                    : 'gray300--text'
                "
              >
                S
              </div>
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
                    v-for="menuItem in menuItems"
                    :key="menuItem.action"
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
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RestrictTable',
  props: {
    restrictList: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    selectedRestriccion: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menuItems: [
        { text: 'Editar', icon: 'mdi-pencil' },
        { text: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
  methods: {
    menuActions(item, action) {
      if (action === 'Editar') {
        this.$emit('input', item)
        this.$emit('btn-edit-item', item)
      } else if (action === 'Eliminar') {
        this.$emit('input', item)
        this.$emit('btn-delete-item', item)
      }
    },
  },
}
</script>
