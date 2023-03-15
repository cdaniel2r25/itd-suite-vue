<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col v-if="adderItem" cols="12">
          <template>
            <v-hover v-slot="{ hover }">
              <v-card
                min-height="200"
                max-height="200"
                class="mx-auto py-8 pa-8 font-weight-medium"
                :class="!hover || 'hover-new'"
                outlined
                @click="actionNew"
              >
                <div>
                  <v-icon class="mb-2">mdi-plus-circle-outline</v-icon>
                </div>
                <h3 class="h3">{{ adderItem.name }}</h3>
              </v-card>
            </v-hover>
          </template>
        </v-col>
        <v-col v-for="item in elements" :key="item.id" cols="4">
          <hover-card-animation :card="item" @action="actionHover" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="mb-6">
          <v-pagination v-model="page" :length="2" circle></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import HoverCardAnimation from '@/components/util/HoverCardAnimation.vue'

export default {
  components: { HoverCardAnimation },
  props: {
    elements: {
      type: Array,
      default: () => ({}),
    },
    itemSelect: {
      type: String,
      default: null,
    },
    adderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    cardsHover: {},
    page: 1,
  }),
  methods: {
    actionHover(args) {
      this.$emit('action', { name: args.name, params: args.params })
    },
    actionNew() {
      this.$emit('clickNew')
    },
  },
}
</script>

<style scoped>
.hover-new {
  background-color: var(--v-blue200-base);
  cursor: pointer;
}
.hover-new i {
  color: var(--v-primary-base);
}
</style>
