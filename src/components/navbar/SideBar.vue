<template>
  <div>
    <v-navigation-drawer
      app
      clipped
      permanent
      height="100vh"
      width="220"
      :mini-variant="miniVariant"
      expand-on-hover
    >
      <v-list nav dense>
        <v-list-item
          v-for="item in items"
          :key="item.icon"
          :to="item.link"
          link
        >
          <v-list-item-icon class="mr-2">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    miniVariant: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
