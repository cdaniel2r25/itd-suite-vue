<template>
  <div>
    <div class="position-line">
      <div class="pb-6 line" style="height: 48px"></div>
    </div>
    <div class="d-flex flex-column align-center">
      <div
        class="horizontal-line-col"
        :style="`width:${createLineWidth}`"
      ></div>
    </div>
    <div class="d-flex align-start justify-center">
      <div
        v-for="col in autoresponderItem.autoresponsesSetting.menuSetting
          .buttonList"
        :key="col.id"
        class="d-flex flex-column justify-center col-div"
      >
        <div
          class="chip-btn d-flex flex-column"
          @click="$emit('active-menu-setting')"
        >
          <div class="d-flex justify-center">
            <v-icon left small color="primary">
              mdi-lightning-bolt-circle
            </v-icon>
            Respuesta/Disparador
          </div>
          <div class="col-name">
            {{ col.name }}
          </div>
        </div>
        <v-card
          v-if="!activeActivityMenu[col.id]"
          :key="activeKey"
          class="mx-auto py-1 text-center"
          style="margin-top: 22px"
          width="40"
          color="warning"
          @click="activateMenu(col)"
        >
          <v-icon color="white">mdi-plus-circle</v-icon>
        </v-card>
        <autoresponder-menu-list
          v-if="activeActivityMenu[col.id]"
          :key="activeKey"
          style="margin-top: 22px"
          :width="250"
          @selection-activity="selectionActivity"
          @close-menu="closeMenu(col.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AutoresponderMenuList from '@/components/modules/autoresponses/AutoresponderMenuList.vue'

export default {
  name: 'AutoresponderMenuBtn',
  components: { AutoresponderMenuList },
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeActivityMenu: {},
      colItem: null,
      activeKey: 0,
    }
  },
  computed: {
    createLineWidth() {
      if (
        this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList
          .length === 2
      )
        return '272px'
      if (
        this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList
          .length === 3
      )
        return '542px'
      return '2px'
    },
  },
  methods: {
    activateMenu(col) {
      this.closeAllMenu()
      this.activeKey += 1
      this.colItem = col
      this.activeActivityMenu[col.id] = true
    },
    selectionActivity(menuItem) {
      this.$emit('active-menu-col', this.colItem)
      this.closeAllMenu()
      console.log('menu: ', menuItem.value)
    },
    closeAllMenu() {
      this.createSelectedCol()
      this.activeKey += 1
    },
    closeMenu(id) {
      this.activeActivityMenu[id] = !this.activeActivityMenu[id]
      this.activeKey += 1
    },
    async createSelectedCol() {
      this.activeActivityMenu = {}
      await this.autoresponderItem.autoresponsesSetting.menuSetting.buttonList.forEach(
        (item) => {
          this.activeActivityMenu[item.id] = false
        }
      )
    },
  },
}
</script>
<style scoped>
.horizontal-line-col {
  width: 100%;
  height: 2px;
  background: var(--v-gray300-base);
}
.position-line {
  position: relative;
  margin-top: -22px;
}
.col-div {
  width: 270px;
  margin-top: 26px;
  position: relative;
  align-items: flex-start;
  cursor: pointer;
}
.col-div:before {
  left: calc(50% - 1px);
  right: auto;
  background: var(--v-gray300-base);
  bottom: 0;
  content: '';
  height: 94px;
  position: absolute;
  top: -26px;
  width: 2px;
  text-decoration: inherit;
  vertical-align: inherit;
}
.chip-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 23px;
  font-size: 14px;
  height: 46px;
  border: 1px solid var(--v-gray300-base);
  padding: 0 10px;
  width: 250px;
  margin: 0 auto;
  background-color: white;
  z-index: 10;
}
.col-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--v-gray300-base);
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
</style>
