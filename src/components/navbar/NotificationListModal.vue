<!-- eslint-disable vue/valid-v-for -->
<template>
  <v-card width="350">
    <div class="d-flex justify-space-between">
      <h3 class="h2 pt-2 pl-4">Notificaciones</h3>
      <v-btn icon color="grey" @click="$emit('change-model', false)">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="overflow-y-auto" style="max-height: 290px">
      <div v-if="notifications.length === 0">
        <v-card-text class="text-center mt-2">
          <v-icon large color="primary"> mdi-alert-circle </v-icon>
        </v-card-text>
        <v-card-text class="text-center mb-2 pt-0">
          No tienes notificaciones.
        </v-card-text>
      </div>
      <v-list v-else>
        <v-list-item-group v-model="selectedItem" color="gray300">
          <template v-for="(item, index) in notifications">
            <v-hover v-slot="{ hover }">
              <v-list-item
                :key="item.id"
                :class="item.notSeen ? 'unread-background' : ''"
              >
                <template v-slot:>
                  <v-list-item-icon>
                    <v-icon
                      :color="
                        item.comesFrom === 'error' ? 'secondary' : 'primary'
                      "
                    >
                      {{ iconsComesFrom(item.comesFrom) }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ item.subtitle }}
                    </v-list-item-subtitle>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle class="primary--text caption mt-2">
                      {{ item.date }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="hover && item.notSeen"
                      fab
                      small
                      elevation="0"
                      color="lightcyan"
                      @click="activitiesClick(item)"
                    >
                      <v-icon color="primary"> mdi-check </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-hover>
            <v-divider v-if="index < notifications.length - 1" :key="index" />
          </template>
        </v-list-item-group>
      </v-list>
    </div>
    <v-card-actions
      class="d-flex"
      :class="
        notifications.length === 0 ? 'justify-end' : 'justify-space-between'
      "
    >
      <v-btn
        v-if="notifications.length !== 0"
        text
        color="gray300"
        @click="$emit('mark-all-read')"
      >
        MARCAR COMO LEÍDAS
      </v-btn>
      <v-btn text color="primary" @click="$emit('see-all-notifications')">
        ver todas
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NotificationListModal',
  model: {
    prop: 'menuNotification',
    event: 'change-model',
  },
  props: {
    menuNotification: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedItem: null,
    }
  },
  methods: {
    activitiesClick(item) {
      if (item.seeDetail) {
        this.$emit('selection-notification', item)
      }
    },
    iconsComesFrom(type) {
      let text = ''
      if (type === 'sms' || type === 'whatsapp') {
        text = 'mdi-message-text'
      }
      if (type === 'vms') {
        text = 'mdi-phone'
      }
      if (type === 'error') {
        text = 'mdi-alert-circle'
      }
      if (type === 'group') {
        text = 'mdi-view-sequential'
      }
      return text
    },
  },
}
</script>
<style scoped>
.unread-background {
  background-color: var(--v-lightcyan-base);
}
</style>
