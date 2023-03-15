<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card color="gray" width="250" class="mx-auto">
        <v-card-text class="d-flex justify-center">
          <v-img
            height="166"
            width="130"
            max-height="166"
            max-width="130"
            :src="item.imageCode64"
            class="background-img"
          />
        </v-card-text>
        <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex flex-column transition-fast-in-fast-out white v-card--reveal"
            style="height: 100%"
          >
            <v-btn
              depressed
              color="primary"
              @click="$emit('active-select', item)"
            >
              seleccionar
            </v-btn>
            <v-btn icon color="primary" @click="$emit('view-template', item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </div>
        </v-expand-transition>
        <div
          class="status"
          :class="{ 'color-inactive': item.status === false }"
        >
          {{ item.status === true ? 'Activa' : 'Inactiva' }}
        </div>
      </v-card>
    </v-hover>
    <div
      class="d-flex justify-space-between align-center mt-2 mx-auto"
      style="width: 250px"
    >
      <div>{{ item.name }}</div>
      <div v-if="!notMenu" class="foot-tab">
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
              @click="$emit('menu-actions', item, menuItem.action)"
            >
              <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveySheet',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    notMenu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuItems: [
        { action: 'goSurvey', text: 'Ir a encuesta' },
        { action: 'duplicate', text: 'Duplicar' },
        { action: 'remove', text: 'Eliminar' },
      ],
    }
  },
}
</script>
<style scoped>
.status {
  position: absolute;
  top: 5px;
  right: 0;
  background-color: var(--v-primary-base);
  padding: 5px 10px;
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  color: white;
  min-width: 76px;
  text-align: center;
}
.color-inactive {
  background-color: var(--v-gray300-base) !important;
}
.background-img {
  background-color: white;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
  border: 2px solid var(--v-primary-base) !important;
}
</style>
