<template>
  <v-container pa-0 fluid fill-height>
    <div class="d-flex all-screen">
      <v-navigation-drawer
        permanent
        :class="windowWidth < 970 ? 'desactive-menu' : 'navigation'"
        :style="
          activeMenu
            ? 'width: 400px !important; display: block !important; position: absolute; z-index: 100'
            : ''
        "
      >
        <div v-if="activeMenu">
          <v-btn
            icon
            class="mr-2 icon-delete pr-2"
            @click="activeMenu = !activeMenu"
          >
            <v-icon color="gray300"> mdi-close </v-icon>
          </v-btn>
        </div>
        <new-diffusion-dialog
          v-if="isCreateBroadcastListActivated"
          v-model="isCreateBroadcastListActivated"
          :agent-chats="diffusionList"
          @create-broadcast-list="createBroadcastList"
        />
        <div v-if="!isCreateBroadcastListActivated">
          <v-list class="pb-0">
            <v-list-item>
              <v-list-item-avatar class="outlined">
                <v-img
                  v-if="selectedSender.img"
                  contain
                  :aspect-ratio="4 / 3"
                  :width="55"
                  :src="selectedSender.img"
                />
                <v-icon v-else class="primary" color="white">
                  mdi-card-account-phone
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-select
                  v-model="selectedSender"
                  :items="sendersList"
                  :hint="selectedSender.type"
                  item-text="name"
                  return-object
                  @change="getConversationList()"
                />
              </v-list-item-content>
              <v-list-item-action>
                <div class="d-flex align-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="addNewChat()"
                      >
                        <v-icon>mdi-message-text</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo chat</span>
                  </v-tooltip>
                  <v-menu bottom left offset-x offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item link @click="addNewContact()">
                        <v-list-item-title>Añadir Contacto</v-list-item-title>
                      </v-list-item>
                      <v-list-item link @click="addNewBroadcastList()">
                        <v-list-item-title
                          >Nueva Lista de difusión</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <!-- <v-menu bottom left offset-x offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item link @click="activateMultipleSelection()">
                        <v-list-item-title>Selección múltiple</v-list-item-title>
                      </v-list-item>
                      <v-list-item link>
                        <v-list-item-title>
                          Desconectarse de todos
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu> -->
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div class="px-0">
            <v-tabs
              v-model="tabs"
              centered
              icons-and-text
              class="border-bottom"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab v-for="(item, i) in itemsTab" :key="i" class="px-0">
                <div class="caption">{{ item.text }}</div>
                <v-icon>{{ item.icon }}</v-icon>
              </v-tab>
            </v-tabs>
          </div>
          <div class="white pa-0">
            <div class="d-flex align-center justify-end mt-2 pa-2">
              <v-combobox
                v-model="searchChat"
                :items="labelList"
                dense
                chips
                outlined
                clearable
                hide-details
                multiple
                item-text="name"
                item-value="name"
                return-object
                placeholder="Buscar..."
                class="mr-1 pl-2"
                prepend-inner-icon="mdi-magnify"
                @change="getConversationList()"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-action>
                    <v-icon :color="item.color">mdi-label</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    <v-icon
                      v-if="data.item.id !== undefined"
                      :color="data.item.color"
                      >mdi-label</v-icon
                    >
                    {{
                      data.item.id === undefined ? data.item : data.item.name
                    }}
                  </v-chip>
                </template>
              </v-combobox>
              <!-- <v-text-field
                v-model="searchChat"
                class="mr-1 pl-2"
                dense
                outlined
                clearable
                hide-details
                placeholder="Buscar..."
                prepend-inner-icon="mdi-magnify"
              /> -->
              <v-btn icon>
                <v-icon color="primary">mdi-filter-variant</v-icon>
              </v-btn>
            </div>
            <div v-if="tabs === 0">
              <div
                class="gray m-2 px-4 d-flex align-center"
                style="position: relative"
              >
                <div v-if="isMultipleSelectionActivated">
                  <v-icon
                    color="gray300"
                    class="mr-2 icon-delete"
                    @click="deactivateSelectAll()"
                  >
                    mdi-close
                  </v-icon>
                </div>
                <v-btn
                  v-if="!isMultipleSelectionActivated"
                  text
                  color="primary"
                  class="pl-0 my-2"
                  plain
                  @click="activateSelectAll()"
                >
                  <v-icon>mdi-checkbox-blank-outline</v-icon>
                  Selección multiple
                </v-btn>
                <div v-if="isMultipleSelectionActivated" class="mb-3">
                  <multiple-selection-bar
                    :is-searching="!!searchChat"
                    :is-broadcast-list="isCreateBroadcastListActivated"
                    @change-select-all="selectAllChats()"
                    @create-broadcast-list="createBroadcastList()"
                    @disconnect-chat="disconnectChat"
                    @is-activate-all-selection="isActivateAllSelection"
                    @set-chat="modifyChat('activeSetChat', true)"
                    @remove-chat="activeRemoveChat = !activeRemoveChat"
                    @archive-chat="modifyChat('activateArchive', true)"
                    @assign-label="
                      showAssignLabelsDialog = !showAssignLabelsDialog
                    "
                  />
                  <span class="caption ml-4">
                    Has seleccionado {{ selectedChatsCount }} chat
                  </span>
                </div>
              </div>
            </div>
            <div v-if="activeDisconnectChat" class="pa-4">
              <v-card flat class="border-card" style="position: relative">
                <div>
                  <v-btn
                    icon
                    color="gray300"
                    class="icon-delete"
                    style="top: -4px"
                    @click="activeDisconnectChat = !activeDisconnectChat"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
                <v-card-text>
                  <div class="d-flex align-start">
                    <v-icon color="secondary">mdi-alert-circle</v-icon>
                    <div class="ml-4">
                      ¿Estas seguro de desconectar chats seleccionados? Los
                      chats se te desasignarán y van a ir a No asignados.
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn
                    text
                    color="primary"
                    class="mr-4"
                    @click="activeDisconnectChat = !activeDisconnectChat"
                  >
                    cancelar
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    outlined
                    color="primary"
                    @click="modifyChat('activateDisconnect', true)"
                  >
                    sí, desconectar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <div v-if="activeRemoveChat" class="pa-4">
              <v-card flat class="border-card" style="position: relative">
                <div>
                  <v-btn
                    icon
                    color="gray300"
                    class="icon-delete"
                    style="top: -4px"
                    @click="activeRemoveChat = !activeRemoveChat"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
                <v-card-text>
                  <div class="d-flex align-start">
                    <v-icon color="secondary">mdi-alert-circle</v-icon>
                    <div class="ml-4">
                      ¿Estas seguro de eliminar los
                      {{ selectedChatsCount }} chat seleccionados?
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn
                    text
                    color="primary"
                    class="mr-4"
                    @click="activeRemoveChat = !activeRemoveChat"
                  >
                    cancelar
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    outlined
                    color="primary"
                    @click="modifyChat('activateRemove', true)"
                  >
                    sí, Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <div v-if="activeArchiveChat" class="pa-4">
              <v-card flat class="border-card" style="position: relative">
                <div>
                  <v-btn
                    icon
                    color="gray300"
                    class="icon-delete"
                    style="top: -4px"
                    @click="cancelArchiveChat()"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
                <v-card-text>
                  <div class="d-flex align-start">
                    <v-icon color="secondary">mdi-alert-circle</v-icon>
                    <div class="ml-4">El chat se ha archivado.</div>
                  </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                  <v-btn
                    text
                    color="primary"
                    class="mr-4"
                    @click="cancelArchiveChat()"
                  >
                    cancelar
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    outlined
                    color="primary"
                    @click="activateArchive()"
                  >
                    Deshacer
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <div>
              <div v-if="loading">
                <v-skeleton-loader
                  v-for="n in 3"
                  :key="n"
                  type="list-item-avatar-two-line"
                />
              </div>
              <chats-list
                v-else
                :key="agentListKey"
                :agent-chats="chats"
                :menu-items="menuItems"
                :opened-chat-id="openedChat && openedChat.id"
                :selected-chats="selectedChats"
                :is-multiple-selection-activated="isMultipleSelectionActivated"
                @open-chat="openChat"
                @select-chat="selectChat"
                @unmark-as-important="unmarkAsImportant"
                @change-alias="changeAlias"
                @assign-labels="assignLabels"
              />
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <div class="all-center">
        <div
          :class="windowWidth < 970 ? 'btn-menu' : 'btn-menu-hide'"
          :style="openedChat ? 'top: 49px' : ''"
        >
          <v-btn icon color="primary" @click="activeMenu = !activeMenu">
            <v-icon large>mdi-menu</v-icon>
          </v-btn>
        </div>
        <whatsapp-chat
          v-if="openedChat"
          :selected-chat="openedChat"
          :messages="messages"
          :loading-chat="loadingChat"
          @update-chat="openChat"
        />
        <div
          v-else
          class="fill-height background-div"
          :style="{
            'background-image':
              'url(' + require('@/assets/background_whatsapp.png') + ')',
          }"
        >
          <div
            class="d-flex flex-column justify-center align-center chat-background"
          >
            <v-icon size="100" color="success">mdi-whatsapp</v-icon>
            <div class="mx-auto mt-6">
              Mantén tu comunicación con los clientes<br />Servicio Whatsapp de
              agentes para mantener la comunicación con sus clientes al día<br /><br />
              ● Escribe !@ para ver una lista de palabras y frases
              predefinidas.<br />● Utiliza para adjuntar tus archivos de forma
              más rápida!<br />¡Nueva función! Ahora puedes archivar las
              conversaciones en la sección de históricos
            </div>
          </div>
        </div>
      </div>
    </div>
    <new-chat-and-contact-dialog
      v-model="showNewChatContactDialog"
      :create-contact-only="createContactOnly"
      @create-chat="createChat"
      @create-contact="createContact"
      @create-contact-and-chat="createContactAndChat"
    />
    <assign-labels-dialog
      v-model="showAssignLabelsDialog"
      :chat="chatToAssignLabels"
      @clear-data="chatToAssignLabels = null"
      @assign-labels-to-chat="assignLabelsToChat"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import dateMixin from '@/mixins/util/dateMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import ChatsList from '@/components/modules/whatsapp/chats/ChatsList.vue'
import WhatsappChat from '@/components/modules/whatsapp/chats/WhatsappChat.vue'
import NewChatAndContactDialog from '@/components/modules/whatsapp/chats/NewChatAndContactDialog.vue'
import AssignLabelsDialog from '@/components/modules/whatsapp/chats/AssignLabelsDialog.vue'
import NewDiffusionDialog from '@/components/modules/whatsapp/chats/NewDiffusionDialog.vue'
import MultipleSelectionBar from '@/components/modules/whatsapp/chats/MultipleSelectionBar.vue'

export default {
  components: {
    ChatsList,
    WhatsappChat,
    NewChatAndContactDialog,
    AssignLabelsDialog,
    NewDiffusionDialog,
    MultipleSelectionBar,
  },
  mixins: [permissionsMixin, whatsappBffMixin, dateMixin, adminBffMixin],
  data: () => ({
    windowWidth: window.innerWidth,
    activeMenu: false,
    loading: false,
    loadingChat: false,
    openedChat: null,
    isMultipleSelectionActivated: false,
    isCreateBroadcastListActivated: false,
    selectAll: false,
    selectedChats: {},
    selectedChatsTMP: [],
    selectedChatsCount: 0,
    agentListKey: 0,
    searchChat: '',
    showNewChatContactDialog: false,
    createContactOnly: false,
    showAssignLabelsDialog: false,
    chatToAssignLabels: null,
    activeDisconnectChat: false,
    activeRemoveChat: false,
    activeArchiveChat: false,
    menuItems: [
      {
        action: 'unmark-as-important',
        text: 'Desmarcar como importante',
        icon: 'mdi-account-cancel',
      },
      {
        action: 'change-alias',
        text: 'Cambiar alias',
        icon: 'mdi-account-question',
      },
      {
        action: 'assign-labels',
        text: 'Asignar Etiquetas',
        icon: 'mdi-label-multiple',
      },
    ],
    sendersList: [],
    diffusionList: [],
    chats: [],
    messages: [],
    selectedSender: {
      id: '-1',
      name: '',
      businessIdAccount: '',
      phone: '',
      state: '',
      type: '',
      img: '',
    },
    itemsTab: [
      { text: 'mis Chat', icon: 'mdi-message-reply-text-outline' },
      { text: 'Asignados', icon: 'mdi-account-multiple-outline' },
      { text: 'No Asignados', icon: 'mdi-account-multiple-minus-outline' },
      { text: 'Archivados', icon: 'mdi-inbox-arrow-down-outline' },
    ],
    tabs: null,
    filter: 'masChat',
    labelList: [],
  }),
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    tabs: {
      handler(value) {
        if (value === 0) {
          this.filter = 'myChat'
        } else if (value === 1) {
          this.filter = 'assigned'
        } else if (value === 2) {
          this.filter = 'unassignedChat'
        } else if (value === 3) {
          this.filter = 'archiveChat'
        }
        this.getConversationList()
      },
    },
  },
  async mounted() {
    this.loading = true

    this.getSenderList()
    if (this.sendersList.length !== 0) {
      const { 0: aux } = this.sendersList
      this.selectedSender = aux
    }

    this.getConversationList()
    await this.createSelectedChats()
    this.loading = false
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
    this.getLabelsFilterInit()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    async getSenderList() {
      const filterService = {
        statusList: [1, 2],
        page: -1,
      }
      const senderObject = await this.getSendersByClient(filterService)
      this.sendersList = await senderObject.dataList
    },
    async getLabelsFilterInit() {
      const filter = {
        page: -1,
      }
      const labels = await this.getLabelsFilter(filter)
      this.labelList = await labels.dataList
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
    async getConversationList() {
      this.loading = true
      const filter = {
        clientId: this.clientId,
        pageConversation: this.filter,
        senderId: this.selectedSender.id,
        searchChat: this.selectSearchList(),
        page: -1,
      }
      const chatsObj = await this.getChatsFilter(filter)
      this.chats = chatsObj.dataList
      this.openedChat = null
      this.isMultipleSelectionActivated = false
      this.loading = false
    },
    async createSelectedChats() {
      this.selectedChats = {}
      await this.chats.forEach((chat) => {
        this.selectedChats[chat.id] = false
      })
      this.selectedChatsCount = 0
    },
    disconnectChat(active) {
      this.activeDisconnectChat = !active
    },
    unmarkAsImportant(chat) {
      console.log('unmark as important: ', chat)
    },
    changeAlias(chat) {
      console.log('open change alias dialog: ', chat)
    },
    assignLabels(chat) {
      this.chatToAssignLabels = chat
      this.showAssignLabelsDialog = true
    },
    addNewChat() {
      this.createContactOnly = false
      this.showNewChatContactDialog = true
    },
    addNewContact() {
      this.createContactOnly = true
      this.showNewChatContactDialog = true
    },
    addNewBroadcastList() {
      console.log('chat: ', this.chats)
      const listTMP = JSON.parse(JSON.stringify(this.chats)).filter(
        (chat) => !chat.broadcastList
      )
      this.diffusionList = listTMP
      this.isCreateBroadcastListActivated = true
      this.isMultipleSelectionActivated = true
    },
    activateMultipleSelection() {
      this.isMultipleSelectionActivated = true
    },
    deactivateSelectAll() {
      Object.keys(this.selectedChats).forEach((key) => {
        this.selectedChats[key] = false
      })
      this.selectedChatsCount = 0
      this.openedChat = null
      this.activeDisconnectChat = false
      this.isMultipleSelectionActivated = false
    },
    activateSelectAll() {
      Object.keys(this.selectedChats).forEach((key) => {
        this.selectedChats[key] = true
      })
      this.selectedChatsCount = this.chats.length
      this.openedChat = null
      this.activeDisconnectChat = false
      this.isMultipleSelectionActivated = true
    },
    isActivateAllSelection(action) {
      this.chats.forEach((chat) => {
        this.selectedChats[chat.id] = action
        if (this.selectedChats[chat.id]) {
          this.selectedChatsCount += 1
        } else {
          this.selectedChatsCount -= 1
          this.selectAll = false
        }
        this.agentListKey += 1
      })
    },
    cancelArchiveChat() {
      this.activeArchiveChat = !this.activeArchiveChat
      this.activeRemoveChat = false
      this.isMultipleSelectionActivated = false
      this.createSelectedChats()
    },
    async activateArchive() {
      await this.modifyChat('activateArchive', false)
      this.createSelectedChats()
    },
    async modifyChat(type, action) {
      const listItems = []
      console.log(this.selectedChats)
      Object.keys(this.selectedChats).forEach((key) => {
        if (this.selectedChats[key] === true) {
          listItems.push(key)
        }
      })
      const listAssign = {
        clientId: this.clientId,
        chatIdList: listItems,
      }
      if (type === 'activateArchive') {
        listAssign.archiveChat = action
        this.activeArchiveChat = !this.activeArchiveChat
      }
      if (type === 'activateRemove') listAssign.removeChat = action
      if (type === 'activeSetChat') listAssign.setChat = action
      if (type === 'activateDisconnect') listAssign.unassignedChat = action

      await this.switchTochatsList(listAssign)
      await this.getConversationList()
      if (type !== 'activateArchive') {
        this.createSelectedChats()
        this.activeDisconnectChat = false
        this.showAssignLabelsDialog = false
        this.isMultipleSelectionActivated = false
      }
      this.activeRemoveChat = false
    },
    async assignLabelsToChat(labelsList) {
      const labelsIds = []
      labelsList.forEach((item) => {
        if (item.checked) {
          labelsIds.push(item.id)
        }
      })
      const listAssign = {
        clientId: this.clientId,
        chatId: this.chatToAssignLabels.id,
        assignLabelsId: labelsIds,
      }
      await this.switchTochatsList(listAssign)
      await this.getConversationList()
      this.showAssignLabelsDialog = false
      this.activeRemoveChat = false
    },
    // clearMultipleSelection() {
    //   this.selectAll = false
    //   Object.keys(this.selectedChats).forEach((key) => {
    //     this.selectedChats[key] = false
    //   })
    //   this.isMultipleSelectionActivated = false
    //   this.isCreateBroadcastListActivated = false
    //   this.selectedChatsCount = 0
    //   this.agentListKey += 1
    // },
    selectChat(chat) {
      this.selectedChats[chat.id] = !this.selectedChats[chat.id]
      if (this.selectedChats[chat.id]) {
        this.selectedChatsCount += 1
      } else {
        this.selectedChatsCount -= 1
        this.selectAll = false
      }
      this.agentListKey += 1
    },
    selectAllChats() {
      this.selectAll = !this.selectAll
      Object.keys(this.selectedChats).forEach((key) => {
        this.selectedChats[key] = this.selectAll
      })
      if (this.selectAll) {
        this.selectedChatsCount = this.chats.length
      } else {
        this.selectedChatsCount = 0
      }
      this.agentListKey += 1
    },
    addChatToList(newChat) {
      this.chats.push(newChat)
      this.selectedChats[newChat.id] = false
    },
    async addChatToTopOfList(newChat) {
      await this.chats.unshift(newChat)
      this.selectedChats[newChat.id] = false
    },
    async createChat(contact) {
      contact.senderId = this.selectedSender.id
      const newChat = await this.createChatByContactId(contact)
      this.addChatToList(newChat)
      this.showNewChatContactDialog = false
    },
    async createContact(contactToCreate) {
      await this.createSingleContact(contactToCreate)
      this.showNewChatContactDialog = false
    },
    async createContactAndChat(contactToCreate) {
      const newChat = await this.createChatByContactId({
        contact: contactToCreate,
        id: '-1',
        senderId: this.selectedSender.id,
      })
      this.addChatToList(newChat)
      this.showNewChatContactDialog = false
    },
    // TODO: create broadcast lists based on contacts and not chats
    async createBroadcastList(listDiffusion) {
      const object = {
        contacts: listDiffusion,
        senderId: this.selectedSender.id,
      }
      const newBroadcastList = await this.createNewBroadcastList(object)
      this.addChatToTopOfList(newBroadcastList)
      this.isCreateBroadcastListActivated = false
    },
    async openChat(chat) {
      this.loadingChat = true
      this.openedChat = chat

      const filter = {
        chatId: chat.id,
        page: -1,
        startDate: this.getCurrentDateFormattedSql(),
        endDate: this.getCurrentDateFormattedSql(),
      }
      const messagesObj = await this.getMessagesByChat(filter)
      this.messages = await messagesObj.dataList
      this.loadingChat = false
    },
    selectSearchList() {
      if (this.searchChat === undefined) return ''
      if (this.searchChat === '') return ''
      if (this.searchChat.length === 0) return ''
      const listName = []
      const listLabel = []
      this.searchChat.forEach((item) => {
        if (this.isObject(item)) {
          listLabel.push(item)
        } else {
          listName.push(item)
        }
      })
      const itemReturn = {
        name: listName,
        label: listLabel,
      }
      return itemReturn
    },
    isObject(val) {
      return typeof val === 'object'
    },
  },
}
</script>
<style scoped>
.chat-background {
  height: calc(100vh - 125px);
  background-color: rgba(255, 255, 255, 0.5);
}
.all-screen {
  width: 100%;
  height: calc(100vh - 128px) !important;
  overflow: hidden;
}
.navigation {
  width: 400px !important;
  display: block !important;
  position: relative;
}
.all-center {
  width: calc(100% - 400px);
}
.btn-menu {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 95;
}
.btn-menu-hide {
  display: none;
}
.desactive-menu {
  display: none;
  position: relative;
}

.left-margin {
  margin-left: 56px !important;
}
.outlined {
  border-radius: 50%;
  border: 1px solid var(--v-gray300-base);
}
.border-bottom {
  border-bottom: 1px solid var(--v-primary-base);
}
.color-label :deep() label {
  color: var(--v-primary-base) !important;
}
.color-label :deep() .v-icon.v-icon {
  color: var(--v-primary-base) !important;
}
.border-card {
  border: 1px solid var(--v-secondary-base);
}
.icon-delete {
  position: absolute;
  right: -6px;
  top: 2px;
  z-index: 101;
}
.background-div {
  background-size: 550px;
  background-repeat: repeat;
  background-color: var(--v-lightcyan-base);
}
@media screen and (max-width: 1064px) {
  .navigation {
    width: 350px !important;
    position: relative;
  }
  .all-center {
    width: calc(100% - 350px);
  }
}
@media screen and (max-width: 970px) {
  .all-center {
    width: 100vw;
  }
}
</style>
