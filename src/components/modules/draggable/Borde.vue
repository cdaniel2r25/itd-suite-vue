<template>
  <v-row no-gutters>
    <v-col cols="4">
      <v-select
        v-model="bordeSelection.borderStyle"
        :items="borderItems"
        outlined
        dense
        hide-details
        class="caption color-back"
        @change="$emit('borde-change', bordeSelection)"
      />
    </v-col>
    <v-col cols="3">
      <v-text-field
        v-model="bordeSelection.borderWidth"
        outlined
        dense
        hide-details
        class="caption color-back"
        @change="$emit('borde-change', bordeSelection)"
      />
    </v-col>
    <v-col cols="5">
      <v-text-field
        v-model="bordeSelection.borderColor"
        dense
        hide-details
        class="ma-0 pa-0 caption color-back"
        outlined
        @change="$emit('borde-change', bordeSelection)"
      >
        <template v-slot:append>
          <v-menu
            v-model="menuColor"
            top
            nudge-bottom="105"
            nudge-left="16"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <div
                :style="swatchStyle(bordeSelection.borderColor)"
                v-on="on"
              ></div>
            </template>
            <v-card>
              <v-card-text class="pa-0">
                <v-color-picker v-model="bordeSelection.borderColor" flat />
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Brode',
  props: {
    bordeSelection: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menuColor: false,
      borderItems: [
        { text: 'Sólido', value: 'solid' },
        { text: 'Discontinua', value: 'dashed' },
        { text: 'Punteado', value: 'dotted' },
      ],
    }
  },
  watch: {
    'bordeSelection.borderWidth': {
      handler(value) {
        if (value !== undefined) {
          if (value.indexOf('px') === -1) {
            this.bordeSelection.borderWidth = `${value}px`
          } else {
            this.bordeSelection.borderWidth = value
          }
        }
      },
    },
  },
  methods: {
    swatchStyle(color) {
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        borderRadius: '4px',
        border: '2px solid gray',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
  },
}
</script>

<style scoped>
.color-back {
  background-color: white;
}
</style>
