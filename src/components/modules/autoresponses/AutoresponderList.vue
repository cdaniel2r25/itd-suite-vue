<template>
  <div>
    <div class="position-line">
      <div class="pb-6 line" style="height: 48px"></div>
    </div>
    <div
      v-for="(col, index) in autoresponderItem.autoresponsesSetting.menuSetting
        .listList"
      :key="col.id"
      class="d-flex align-baseline"
      :class="rightDrawer ? 'row-item-margin' : 'row-item'"
    >
      <div
        class="align-self-start"
        :class="
          autoresponderItem.autoresponsesSetting.menuSetting.listList.length ===
          index + 1
            ? 'item-line-more'
            : 'item-line'
        "
      ></div>
      <div class="item-line-dos align-self-start"></div>
      <div class="d-flex flex-column align-center align-self-start box-line">
        <div class="caption">Respuesta</div>
        <div class="text-line">{{ index + 1 }}. {{ col.name }}</div>
      </div>
      <div class="item-line-dos align-self-start"></div>
      <v-card
        class="mt-3 py-1 text-center"
        width="40"
        color="secondary"
        @click="$emit('active-menu-list', col)"
      >
        <v-icon color="white">mdi-plus-circle</v-icon>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoresponderList',
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
    rightDrawer: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped>
.position-line {
  position: relative;
  margin-top: -22px;
}
.line:before {
  left: calc(50% - 1px);
  right: auto;
  background: var(--v-gray300-base);
  bottom: 0;
  content: '';
  height: cal(100% - 24px);
  position: absolute;
  top: 24px;
  width: 2px;
  text-decoration: inherit;
  vertical-align: inherit;
}
.row-item {
  margin-left: calc(100vw / 2 - 17px);
}
.row-item-margin {
  margin-left: calc(100vw / 2 - 186px);
}
.item-line-dos {
  height: 30px;
  width: 24px;
  border-bottom: 2px solid var(--v-gray300-base);
}
.item-line {
  width: 2px;
  height: 60px;
  background-color: var(--v-gray300-base);
}
.item-line-more {
  height: 30px;
  width: 2px;
  background-color: var(--v-gray300-base);
}
.box-line {
  border: 1px solid var(--v-gray300-base);
  background-color: white;
  padding: 0 5px;
  width: 200px;
  margin-top: 5px;
}
.text-line {
  width: 100%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
