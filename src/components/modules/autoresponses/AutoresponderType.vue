<template>
  <v-sheet outlined color="bluelagoon" class="mx-auto" rounded max-width="350">
    <v-card
      class="mx-auto"
      max-width="350"
      color="white"
      @click="$emit('select-activity')"
    >
      <v-app-bar color="bluelagoon" height="40" class="py-0">
        <v-toolbar-title class="white--text py-0 subtitle-2">
          <v-icon small color="white">
            {{
              autoresponderItem.autoresponsesType === 'single'
                ? 'mdi-message-text'
                : 'mdi-format-list-bulleted'
            }}
          </v-icon>
          {{
            autoresponderItem.autoresponsesType === 'single' ? 'Simple' : 'Menú'
          }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(menuItem, index) in menuActivityItems"
              :key="index"
              @click="$emit('menu-activity-actions', menuItem.title)"
            >
              <v-list-item-icon>
                <v-icon>{{ menuItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-list-item-subtitle class="text-center accent--text py-4">
        {{
          autoresponderItem.autoresponsesType === 'single'
            ? autoresponderItem.autoresponsesSetting.messageText === ''
              ? 'Respuesta de tipo simple'
              : autoresponderItem.autoresponsesSetting.messageText
            : autoresponderItem.autoresponsesSetting.messageText === ''
            ? 'Respuesta de tipo menú'
            : autoresponderItem.autoresponsesSetting.messageText
        }}
      </v-list-item-subtitle>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: 'AutoresponderItem',
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menuActivityItems: [
        { title: 'Editar', icon: 'mdi-pencil' },
        { title: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
}
</script>
