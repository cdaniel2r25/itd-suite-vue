<template>
  <div v-if="isCreateBroadcastListActivated">
    <v-card flat color="gray100">
      <div class="d-flex justify-end">
        <v-btn icon @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="d-flex">
        <v-btn icon @click="cancel()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="d-flex flex-column ml-2">
          Nueva difusión
          <span class="caption">
            {{
              `${selectedDiffusion.length} de ${agentChats.length} seleccionados.`
            }}
          </span>
        </div>
      </div>
      <v-card-actions class="ml-6 mt-2">
        <v-btn
          text
          color="primary"
          :disabled="selectedDiffusion.length === 0"
          @click="cancel()"
        >
          Cancelar
        </v-btn>
        <v-btn
          class="ml-2"
          outlined
          color="primary"
          :disabled="selectedDiffusion.length === 0"
          @click="$emit('create-broadcast-list', selectedDiffusion)"
        >
          crear difusión
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      v-if="selectedDiffusion.length !== 0"
      flat
      color="white"
      class="dividir"
    >
      <v-card-text class="d-flex flex-nowrap overflow-x-auto">
        <div v-for="chat in selectedDiffusion" :key="chat.id" class="mr-6">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-badge
                bordered
                bottom
                color="gray300"
                icon="mdi-close"
                offset-x="10"
                offset-y="10"
              >
                <v-avatar
                  size="40"
                  class="avatar-border"
                  color="darkgray"
                  v-bind="attrs"
                  @click="selectItem(chat)"
                  v-on="on"
                >
                  <img v-if="chat.avatar" alt="Avatar" :src="chat.avatar" />
                  <v-icon v-else color="white">
                    {{
                      chat.broadcastList
                        ? 'mdi-bullhorn-variant'
                        : 'mdi-account'
                    }}
                  </v-icon>
                </v-avatar>
              </v-badge>
            </template>
            <span>{{ chat.name }}</span>
          </v-tooltip>
        </div>
      </v-card-text>
    </v-card>
    <v-card flat color="white">
      <v-card-text>
        <v-text-field
          v-model="searchChat"
          class="pl-2"
          dense
          outlined
          clearable
          hide-details
          placeholder="Buscar contacto"
          prepend-inner-icon="mdi-magnify"
        />
      </v-card-text>
      <v-card class="pt-0" flat color="white">
        <v-card-text class="pt-0">
          <v-btn text color="primary" @click="selectAll()">
            Seleccionar todos
          </v-btn>
        </v-card-text>
        <v-list two-line>
          <v-list-item
            v-for="chat in filteredChatsDos"
            :key="chat.id"
            class="dividir"
          >
            <v-list-item-action tile size="60" class="my-0 mr-6">
              <v-badge
                :value="isIncluded(chat)"
                bordered
                bottom
                color="primary"
                icon="mdi-check-bold"
                offset-x="10"
                offset-y="10"
              >
                <v-avatar
                  size="40"
                  class="avatar-border"
                  color="darkgray"
                  @click="selectItem(chat)"
                >
                  <img v-if="chat.avatar" alt="Avatar" :src="chat.avatar" />
                  <v-icon v-else color="white">
                    {{
                      chat.broadcastList
                        ? 'mdi-bullhorn-variant'
                        : 'mdi-account'
                    }}
                  </v-icon>
                </v-avatar>
              </v-badge>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="chat.name" />
              <v-list-item-subtitle v-text="chat.phone" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'NewDiffusionDialog',
  model: {
    prop: 'isCreateBroadcastListActivated',
    event: 'change-model',
  },
  props: {
    isCreateBroadcastListActivated: {
      type: Boolean,
      default: false,
    },
    agentChats: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      totalSelection: 0,
      listSelection: 5,
      searchChat: '',
      selectedDiffusion: [],
    }
  },
  computed: {
    filteredChatsDos() {
      return this.agentChats.filter((chat) => {
        if (!this.searchChat) return true
        return chat.name.toLowerCase().includes(this.searchChat.toLowerCase())
      })
    },
  },
  methods: {
    selectAll() {
      this.selectedDiffusion = JSON.parse(JSON.stringify(this.agentChats))
    },
    selectItem(item) {
      const itemTMP = JSON.parse(JSON.stringify(item))
      let exists = -1
      this.selectedDiffusion.forEach((itemT, index) => {
        if (itemTMP.id === itemT.id) exists = index
      })
      if (exists === -1) {
        this.selectedDiffusion.push(itemTMP)
      } else {
        this.selectedDiffusion.splice(exists, 1)
      }
    },
    isIncluded(item) {
      const itemTMP = JSON.parse(JSON.stringify(item))
      let exists = false
      this.selectedDiffusion.forEach((itemT) => {
        if (itemTMP.id === itemT.id) exists = true
      })
      return exists
    },
    cancel() {
      this.selectedDiffusion = []
      this.$emit('change-model', false)
    },
  },
}
</script>
<style scoped>
.dividir {
  border-bottom: 2px solid var(--v-gray-base) !important;
}
.avatar-border {
  cursor: pointer;
}
</style>
