<template>
  <div>
    <div class="px-4 mt-10 d-flex justify-space-between align-center">
      <div class="caption pt-1">Altura</div>
      <div class="pa-1" style="width: 200px">
        <v-btn-toggle dense>
          <v-btn @click="changeHeight('menos')">
            <v-icon small>mdi-minus-circle-outline</v-icon>
          </v-btn>
          <div class="caption input-padding" style="min-width: 95px">
            {{ spacerSelection.height }}
          </div>
          <v-btn @click="changeHeight('mas')">
            <v-icon small>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpacerSetting',
  props: {
    spacerSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    changeHeight(type) {
      let valor = parseFloat(this.spacerSelection.height)
      if (type === 'mas') {
        if (valor !== 3) {
          valor += 5
        }
      } else if (valor !== 5) {
        valor -= 5
      }
      this.spacerSelection.style.paddingTop = `${valor.toString()}px`
      this.spacerSelection.height = valor
    },
  },
}
</script>
<style scoped>
.input-padding {
  border-top-style: solid;
  border-top-width: thin;
  border-top-color: rgba(0, 0, 0, 0.12);
  border-bottom-style: solid;
  border-bottom-width: thin;
  border-bottom-color: rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
