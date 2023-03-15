<template>
  <v-hover v-slot="{ hover }">
    <v-card
      min-height="200"
      max-height="200"
      class="'mx-auto overflow-hidden"
      :class="{ cardActived: card.isSelected !== undefined && card.isSelected }"
      outlined
    >
      <div>
        <div class="pa-8">
          <div class="text-h6 black--text">{{ card.title }}</div>
          <span
            class="rounded-pill white--text px-4"
            :class="card.pill && card.pill.class"
          >
            {{ card.pill && card.pill.label ? card.pill.label : '' }}
          </span>
          <div v-if="card.body.type === 'text'" class="py-4">
            {{ card.body.content }}
          </div>
          <div v-if="card.body.type === 'image'">
            <v-img :src="card.body.content" max-height="100" max-width="100%" />
          </div>
          <div class="grey--text lighten-2--text text-caption">
            {{ card.footer }}
          </div>
        </div>
        <v-expand-transition>
          <div
            v-if="cardsHover[card.id] || hover"
            class="d-flex transition-fast-in-fast-out v-card--reveal white overflow-hidden"
            style="height: 100%"
          >
            <v-container justify="center">
              <div v-if="card.hover.header">
                <v-row>
                  <v-col cols="12">
                    <v-icon
                      v-if="card.isSelected"
                      color="primary"
                      class="float-left"
                    >
                      mdi-checkbox-marked-circle
                    </v-icon>
                    <span
                      v-for="button in card.hover.header"
                      :key="button.id"
                      class="float-right"
                    >
                      <v-btn v-if="button.menu === undefined" icon class="mr-1">
                        <v-icon>
                          {{ button.icon }}
                        </v-icon>
                      </v-btn>
                      <v-menu v-else v-model="cardsHover[card.id]" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            disabled
                            icon
                            v-bind="attrs"
                            class="mr-1"
                            v-on="on"
                          >
                            <v-icon class="d-none">
                              {{ button.icon }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(cardMenu, index) in button.menu"
                            :key="index"
                          >
                            <v-list-item-title>
                              {{ cardMenu.label }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </span>
                  </v-col>
                </v-row>
              </div>
              <div v-if="card.hover.body" class="text-center">
                <v-row v-for="button in card.hover.body" :key="button.id">
                  <v-col>
                    <v-btn
                      :class="button.classes"
                      v-bind="button.attributes"
                      @click="
                        actionCard(button.event.name, button.event.params)
                      "
                    >
                      {{ button.label.text }}
                      <v-icon v-if="button.label.icon" class="ml-2">
                        {{ button.label.icon }}
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </div>
        </v-expand-transition>
      </div>
    </v-card>
  </v-hover>
</template>
<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
    hoverText: {
      type: String,
      default: '',
    },
    contentText: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    cardsHover: {},
    page: 1,
  }),
  methods: {
    actionCard(name, params) {
      this.$emit('action', { name, params })
    },
  },
}
</script>
<style scoped>
.v-card--reveal {
  bottom: 0;
  position: absolute;
  width: 100%;
}
.cardActived {
  border: 3px solid var(--v-primary-base);
}
</style>
