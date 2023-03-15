<template>
  <v-card elevation="5" :width="width" class="mx-auto">
    <v-card-title class="subtitle-1 gray300--text border-bottom-color">
      <v-icon
        size="20"
        color="grey"
        class="btn-close-card"
        @click="$emit('close-menu')"
      >
        mdi-close
      </v-icon>
    </v-card-title>
    <div class="card-overflow">
      <v-card-title class="mb-2">
        <div style="line-height: 1.5rem">Selecciona tipo</div>
        <div style="line-height: 1.5rem">de Autorrespuesta</div>
      </v-card-title>
      <div style="height: 250px" class="overflow-y-auto px-4">
        <div
          v-for="(item, i) in addDataActivitiesItems"
          :key="i"
          class="d-flex align-start div-list border-list"
          @click="$emit('selection-activity', item)"
        >
          <div class="mt-2 avatar-div">
            <v-icon color="secondary">{{ item.icon }}</v-icon>
          </div>
          <div class="px-2 my-2">
            <div class="font-weight-medium">
              {{ item.title }}
            </div>
            <div class="caption" style="font-size: 0.85rem !important">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  menu: 'AutoresponderMenuList',
  props: {
    width: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      selectedDataActivitiesItem: -1,
      addDataActivitiesItems: [
        {
          title: 'Simple/Contacto',
          text: 'Crea un mensaje respuesta de tipo estático.',
          icon: 'mdi-message-text',
          value: 'single',
        },
        {
          title: 'Menú',
          text: 'Crea un mensaje respuesta de tipo menú. Crea un menú con lista o botones.',
          icon: 'mdi-format-list-bulleted',
          value: 'menu',
        },
      ],
    }
  },
}
</script>
<style scoped>
.btn-close-card {
  position: absolute;
  top: 5px;
  right: 5px;
}
.border-list {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.div-list {
  cursor: pointer;
}
.div-list:hover {
  background-color: var(--v-gray-base);
}
.avatar-div {
  height: 24px;
  width: 48px;
  min-width: 48px;
  text-align: center;
}
</style>
