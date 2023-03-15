<template>
  <v-tooltip :left="left" :right="right" color="accent">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        class="pl-2"
        :color="activeColor ? 'primary' : ''"
        v-bind="attrs"
        v-on="on"
      >
        mdi-help-circle-outline
      </v-icon>
    </template>
    <div>
      <div class="py-1 white--text font-weight-bold">
        <div v-for="(item, i) in listMessage" :key="i">
          {{ item }}
        </div>
      </div>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    message: {
      type: String,
      default: '',
    },
    activeColor: {
      type: Boolean,
      default: true,
    },
    left: {
      type: Boolean,
      default: true,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listMessage: [],
    }
  },
  created() {
    this.createList()
  },
  methods: {
    createList() {
      this.listMessage = this.message.split('<br>')
    },
  },
}
</script>
