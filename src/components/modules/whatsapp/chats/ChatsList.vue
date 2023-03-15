<template>
  <v-list two-line>
    <v-list-item
      v-for="chat in filteredAgentChats"
      :key="chat.id"
      class="dividir"
      :class="{ gray100: openedChatId === chat.id }"
    >
      <v-list-item-avatar
        tile
        size="60"
        class="my-0 mr-1"
        style="cursor: pointer"
        @click="
          isMultipleSelectionActivated ? selectChat(chat) : openChat(chat)
        "
      >
        <v-badge
          :value="selectedChats[chat.id] ? true : false"
          bordered
          bottom
          overlap
          color="primary"
          offset-x="10"
          offset-y="15"
          @change="cambio()"
        >
          <template v-slot:badge>
            <v-icon color="white">mdi-check-bold</v-icon>
          </template>
          <v-avatar size="40" color="darkgray">
            <img v-if="chat.avatar" alt="Avatar" :src="chat.avatar" />
            <v-icon v-else color="white">
              {{ chat.broadcast ? 'mdi-bullhorn-variant' : 'mdi-account' }}
            </v-icon>
          </v-avatar>
        </v-badge>
      </v-list-item-avatar>
      <v-list-item-content
        style="cursor: pointer"
        @click="
          isMultipleSelectionActivated ? selectChat(chat) : openChat(chat)
        "
      >
        <v-list-item-title v-text="chat.name" />
        <v-list-item-subtitle>
          {{
            chat.broadcast ? chat.contactsQuantity + ' contactos' : chat.phone
          }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action v-if="!isMultipleSelectionActivated">
        <div class="d-flex justify-end align-center">
          <v-tooltip v-if="chat.labels && chat.labels.length > 0" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="$emit('assign-labels', chat)"
              >
                <v-icon :color="chat.labels[0].color">
                  {{
                    chat.labels.length > 1 ? 'mdi-label-multiple' : 'mdi-label'
                  }}
                </v-icon>
              </v-btn>
            </template>
            <v-list class="transparent">
              <v-list-item v-for="label in chat.labels" :key="label.id">
                <v-list-item-content class="white--text">
                  <div class="d-flex align-center">
                    <v-icon :color="label.color" class="mr-1 mb-1">
                      mdi-label
                    </v-icon>
                    {{ label.name }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-tooltip>
          <v-list-item-action-text class="ml-1" v-text="chat.lastSendAt" />
        </div>
        <div class="d-flex justify-end">
          <v-icon v-if="chat.setChat" color="gray300">mdi-pin</v-icon>
          <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on">
                <v-icon color="accent">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                link
                @click="$emit(item.action, chat)"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    agentChats: {
      type: Array,
      default: () => [],
    },
    menuItems: {
      type: Array,
      default: () => [],
    },
    openedChatId: {
      type: String,
      default: '',
    },
    isMultipleSelectionActivated: {
      type: Boolean,
      default: false,
    },
    selectedChats: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    filteredAgentChats() {
      if (this.isMultipleSelectionActivated)
        return this.agentChats.filter((chat) => !chat.broadcast)
      return this.agentChats
    },
  },
  methods: {
    openChat(chat) {
      this.$emit('open-chat', chat)
    },
    selectChat(chat) {
      this.$emit('select-chat', chat)
    },
  },
}
</script>
<style scoped>
.dividir {
  border-bottom: 2px solid var(--v-gray-base);
}
.v-badge__badge .v-icon {
  margin: -4px -2px;
}
</style>
