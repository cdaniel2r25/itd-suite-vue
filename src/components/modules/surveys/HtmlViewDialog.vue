<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      fullscreen
      hide-overlay
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="container">
        <v-toolbar dense elevation="4">
          <v-btn text color="primary" @click="$emit('change-model', false)">
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            VOLVER
          </v-btn>
        </v-toolbar>
        <v-container fluid class="px-0 py-0">
          <div v-if="selectedItem" class="all-screen">
            <v-card color="white" width="700" class="mt-6 pb-6">
              <v-card-title class="pb-0">
                {{ selectedItem.name }}
              </v-card-title>
              <v-card-text class="pb-0">
                {{ selectedItem.description }}
              </v-card-text>
            </v-card>
            <div v-for="(item, i) in selectedItem.contents" :key="i">
              <v-card color="white" width="700" class="mt-4 mb-0">
                <v-card-text class="font-weight-bold pb-0 text-subtitle-1">
                  {{ item.question }}
                </v-card-text>
                <div v-if="item.type === 'uniqueSelection'" class="ml-4">
                  <v-card-text>
                    <v-radio-group
                      v-model="item.response"
                      dense
                      hide-details
                      class="mt-0"
                    >
                      <v-radio
                        v-for="(radio, ii) in item.options"
                        :key="ii"
                        :label="radio.option"
                        :value="radio.option"
                      />
                    </v-radio-group>
                  </v-card-text>
                </div>
                <div v-if="item.type === 'multipleSelection'" class="ml-4">
                  <v-card-text>
                    <v-checkbox
                      v-for="(check, ii) in item.options"
                      :key="ii"
                      v-model="item.response"
                      multiple
                      dense
                      hide-details
                      :value="check.option"
                      :label="check.option"
                    />
                  </v-card-text>
                </div>
                <div v-if="item.type === 'starRating'" class="ml-4">
                  <v-card-text>
                    <v-rating
                      v-model="item.response"
                      color="secondary"
                      :length="item.option.length"
                    />
                  </v-card-text>
                </div>
                <div v-if="item.type === 'textResponse'" class="ml-4">
                  <v-card-text>
                    <v-textarea
                      v-model="item.response"
                      outlined
                      rows="4"
                      :maxlength="item.option.maximumCharacters"
                      :counter="item.option.maximumCharacters"
                    />
                  </v-card-text>
                </div>
                <div v-if="item.type === 'linearScale'" class="ml-4">
                  <div class="d-flex justify-center mt-2 pb-6">
                    <v-radio-group
                      v-model="item.response"
                      dense
                      hide-details
                      row
                      class="mt-0"
                    >
                      <div
                        v-for="(radio, ii) in getListScale(
                          item.option.from,
                          item.option.to
                        )"
                        :key="ii"
                        class="div-scale"
                      >
                        <v-radio :value="radio" class="mr-0" />
                        <div style="margin-right: 8px">{{ radio }}</div>
                      </div>
                    </v-radio-group>
                  </div>
                </div>
                <div
                  v-if="item.type === 'simpleSelections'"
                  class="ml-4 pb-4 div-class"
                >
                  <div class="d-flex">
                    <div style="min-width: 100px; max-width: 100px">&nbsp;</div>
                    <div
                      v-for="(col, ii) in item.options.columns"
                      :key="ii"
                      class="text-center caption"
                      style="min-width: 100px; max-width: 100px"
                    >
                      {{ col.col }}
                    </div>
                  </div>
                  <div
                    v-for="(row, rowi) in item.options.rows"
                    :key="rowi"
                    class="d-flex mb-1"
                  >
                    <div
                      class="caption"
                      style="min-width: 100px; max-width: 100px"
                    >
                      {{ row.row }}
                    </div>
                    <v-radio-group
                      v-model="item.response[rowi].answer"
                      dense
                      row
                      hide-details
                      class="mt-0"
                      :style="`min-width: ${
                        100 * item.options.columns.length
                      }px`"
                    >
                      <v-radio
                        v-for="(col, coli) in item.options.columns"
                        :key="coli"
                        class="mr-0"
                        style="
                          min-width: 100px;
                          max-width: 100px;
                          display: flex;
                          justify-content: center;
                        "
                        :value="col.col"
                      />
                    </v-radio-group>
                  </div>
                </div>
                <div
                  v-if="item.type === 'multipleSelections'"
                  class="ml-4 pb-4 div-class"
                >
                  <div class="d-flex mt-4">
                    <div style="min-width: 100px; max-width: 100px">&nbsp;</div>
                    <div
                      v-for="(col, ii) in item.options.columns"
                      :key="ii"
                      class="px-1 text-center caption"
                      style="min-width: 100px; max-width: 100px"
                    >
                      {{ col.col }}
                    </div>
                  </div>
                  <div
                    v-for="(row, rowi) in item.options.rows"
                    :key="rowi"
                    class="d-flex mb-1"
                  >
                    <div
                      class="caption"
                      style="min-width: 100px; max-width: 100px"
                    >
                      {{ row.row }}
                    </div>
                    <div
                      v-for="(check, ii) in item.options.columns"
                      :key="ii"
                      class="mr-0 d-flex justify-center"
                      style="
                        min-width: 100px;
                        max-width: 100px;
                        display: flex;
                        justify-content: center;
                      "
                    >
                      <v-checkbox
                        v-model="item.response[rowi].answer"
                        multiple
                        dense
                        hide-details
                        :value="check.col"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="item.type === 'date'" class="ml-4 pb-4">
                  <v-card-text style="width: 200px">
                    <v-menu
                      :close-on-content-click="false"
                      :return-value.sync="dates"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="item.response"
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
                        v-model="item.response"
                        no-title
                        locale="es-es"
                        color="primary"
                      />
                    </v-menu>
                  </v-card-text>
                </div>
                <div v-if="item.type === 'time'" class="ml-4 pb-4">
                  <v-card-text style="width: 200px">
                    <v-menu
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="item.response"
                          label="Hora"
                          prepend-inner-icon="mdi-clock-time-four-outline"
                          dense
                          readonly
                          class="mt-4"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-time-picker v-model="item.response" full-width />
                    </v-menu>
                  </v-card-text>
                </div>
              </v-card>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'HtmlViewDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menu: false,
      rules: {
        length: (len) => (v) =>
          (v || '').length >= len ||
          `Longitud de carácter no válida, obligatorio ${len}`,
      },
    }
  },
  methods: {
    getListScale(from, to) {
      const newList = []
      for (let i = from; i <= to; i += 1) {
        newList.push(i.toString())
      }
      return newList
    },
  },
}
</script>
<style scoped>
.all-screen {
  margin-top: 4px;
  width: 100%;
  height: calc(100vh - 52px) !important;
  position: relative;
  background-color: var(--v-gray100-base);
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}
.div-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}
.div-class {
  min-width: calc(100% - 32px);
  max-width: calc(100% - 32px);
  overflow: auto;
}
</style>
