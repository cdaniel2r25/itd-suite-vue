<template>
  <v-container
    fill-height
    gray100
    pa-0
    fluid
    class="align-baseline"
    style="background-color: var(--v-lightcyan-base) !important"
  >
    <div style="width: 100%">
      <v-row no-gutters class="py-2 white pt-0 pb-0">
        <v-toolbar dense flat color="white">
          <v-toolbar-title>
            <v-container fluid>
              <v-row>
                <v-col cols="auto">
                  <v-avatar color="darkgray" size="36">
                    <img
                      v-if="selectedChat.avatar"
                      alt="Avatar"
                      :src="selectedChat.avatar"
                    />
                    <v-icon v-else color="white"> mdi-account </v-icon>
                  </v-avatar>
                </v-col>
                <v-col cols="auto">
                  <div class="d-flex flex-column">
                    <div class="header-text">{{ selectedChat.name }}</div>
                    <div class="header-text">{{ selectedChat.phone }}</div>
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-tooltip
                    v-if="selectedChat.labels && selectedChat.labels.length > 0"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        small
                        v-bind="attrs"
                        v-on="on"
                        @click="$emit('assign-labels', chat)"
                      >
                        <v-icon :color="selectedChat.labels[0].color">
                          {{
                            selectedChat.labels.length > 1
                              ? 'mdi-label-multiple'
                              : 'mdi-label'
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list class="transparent">
                      <v-list-item
                        v-for="label in selectedChat.labels"
                        :key="label.id"
                      >
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
                </v-col>
                <v-col cols="auto">
                  <v-chip
                    outlined
                    class="gray300"
                    :color="
                      selectedChat.sessionId !== undefined
                        ? 'success'
                        : 'darkgray'
                    "
                    style="background: white !important"
                  >
                    <v-icon
                      small
                      left
                      :color="
                        selectedChat.sessionId !== undefined
                          ? 'success'
                          : 'darkgray'
                      "
                    >
                      mdi-checkbox-blank-circle
                    </v-icon>
                    {{
                      selectedChat.sessionId !== undefined
                        ? 'Sesión abierta'
                        : 'Sesión cerrada'
                    }}
                  </v-chip>
                </v-col>
                <v-col
                  v-if="selectedChat.sessionId === undefined"
                  cols="auto"
                  class="d-flex flex-row justify-center align-center"
                  style="height: 60px"
                >
                  <v-icon color="primary"> mdi-alert-circle </v-icon>
                  <div
                    v-if="windowWidth > 1246 && windowWidth <= 966"
                    class="ml-2"
                    :class="
                      windowWidth > 1366 ? 'header-text' : 'header-text-small'
                    "
                  >
                    Para abrir sesión debes enviar mensaje con plantilla
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-toolbar-title>

          <v-spacer />

          <div class="d-flex align-center">
            <v-btn
              icon
              color="primary"
              @click="selectedAssignAgent = !selectedAssignAgent"
            >
              <v-icon>mdi-swap-horizontal</v-icon>
            </v-btn>

            <v-btn icon color="primary">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </div>
        </v-toolbar>
      </v-row>
      <!-- DIV CHAT PRINCIPAL -->
      <div v-if="selectedFile === null && fileurl === ''">
        <div
          :style="{
            'background-image':
              'url(' + require('@/assets/background_whatsapp.png') + ')',
          }"
          class="chat-background"
        >
          <v-row
            no-gutters
            class="overflow-y-auto flex-column background-image"
          >
            <v-col v-if="loadingChat" cols="12" class="pt-4">
              <div
                v-for="n in 6"
                :key="n"
                class="px-4 d-flex"
                :class="n % 2 === 0 ? 'justify-end' : 'justify-start'"
              >
                <v-skeleton-loader
                  :type="
                    n % 2 === 0 ? 'list-item-two-line' : 'list-item-three-line'
                  "
                  width="200"
                />
              </div>
            </v-col>
            <v-col v-else-if="messages.length" cols="12">
              <div
                v-for="message in messages"
                :key="message.id"
                class="d-flex mx-5 my-6"
                :class="message.ownMessage ? 'justify-end' : 'justify-start'"
              >
                <whatsapp-message :message="message" style="max-width: 100%" />
              </div>
            </v-col>
            <v-col
              v-else
              cols="12"
              class="d-flex flex-column justify-center align-center"
            >
              <v-icon size="100" color="success">mdi-whatsapp</v-icon>
              sin mensajes
            </v-col>
          </v-row>
        </div>
        <v-row
          v-if="selectedChat.sessionId !== undefined"
          no-gutters
          class="gray100 pa-2"
        >
          <div class="d-flex fill">
            <v-menu top offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                  <v-icon>mdi-paperclip</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn icon color="primary" @click="openThumbFile('any')">
                    <v-icon>mdi-lightning-bolt-circle</v-icon>
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    icon
                    color="primary"
                    @click="openThumbFile('fileimages')"
                  >
                    <v-icon>mdi-image-outline</v-icon>
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    icon
                    color="primary"
                    @click="openThumbFile('filedocs')"
                  >
                    <v-icon>mdi-file-document-outline</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu
              bottom
              left
              offset-y
              offset-x
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                  <v-icon>mdi-emoticon-happy-outline</v-icon>
                </v-btn>
              </template>
              <VEmojiPicker @select="selectEmoji" />
            </v-menu>
          </div>
          <v-textarea
            v-model="chatText"
            rows="1"
            rounded
            dense
            auto-grow
            outlined
            hide-details
            placeholder="Escribe un mensaje aquí"
          />
          <div>
            <v-btn
              v-if="chatText.length !== 0"
              icon
              color="primary"
              @click="sendTextMessage()"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>
          <div class="ml-1">
            <v-btn
              v-if="!recording"
              fab
              small
              color="primary"
              @click="record()"
            >
              <v-icon color="white">mdi-microphone-outline</v-icon>
            </v-btn>
            <v-btn v-else fab small class="stop" @click="stop()">
              <v-icon color="white">mdi-stop</v-icon>
            </v-btn>
          </div>
        </v-row>
        <!-- SESSION CERRADA PLANTILLA -->
        <div
          v-if="selectedChat.sessionId === undefined"
          class="d-flex justify-center align-center row-prueba"
        >
          <div
            class="d-flex justify-space-between align-center no-transform-button"
          >
            <v-btn text @click="templateDialog = true">
              <v-icon color="primary">mdi-send</v-icon>
              <div class="no-transform-button ml-2 primary--text">
                Enviar mensaje con plantilla
              </div>
            </v-btn>
          </div>
        </div>
        <!-- SESSION CERRADA PLANTILLA -->
      </div>
      <!-- DIV CHAT PRINCIPAL -->
      <!-- DIV SELECCIÓN IMAGEN -->
      <div v-if="showEditor" class="height: 100%">
        <div class="fileinput-background">
          <div class="fileinput-row-uno d-flex flex-column justify-center">
            <div class="fileinput-close">
              <v-btn icon color="gray300" @click="closePreview()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div
              class="d-flex justify-center"
              :class="windowWidth > 1366 ? 'mb-5' : 'mb-1'"
            >
              <v-btn icon color="accent" :disabled="docFound">
                <v-icon :large="windowWidth > 1366"> mdi-emoticon </v-icon>
              </v-btn>
              <v-btn icon color="accent" class="ml-1" :disabled="docFound">
                <v-icon :large="windowWidth > 1366">mdi-sticker-outline</v-icon>
              </v-btn>
              <v-btn icon color="accent" class="ml-1" :disabled="docFound">
                <v-icon :large="windowWidth > 1366">mdi-format-text</v-icon>
              </v-btn>
              <v-btn
                icon
                color="accent"
                class="ml-1"
                :disabled="docFound"
                @click="freeDrawing()"
              >
                <v-icon :large="windowWidth > 1366">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="accent" class="ml-1" :disabled="docFound">
                <v-icon :large="windowWidth > 1366">mdi-crop-rotate</v-icon>
              </v-btn>
              <v-btn icon color="accent" class="ml-1" disabled>
                <v-icon :large="windowWidth > 1366">
                  mdi-arrow-u-left-top
                </v-icon>
              </v-btn>
              <v-btn icon color="accent" class="ml-1" disabled>
                <v-icon :large="windowWidth > 1366">
                  mdi-arrow-u-right-top
                </v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-center">
              <div class="editor-style">
                <!-- TODO: Examinar posibilidad de no tener que usar un for para tener multiples canvas -->
                <!-- <div v-for="(file, index) in previewfilesarray" :key="index">
                  <Editor
                    v-show="imageFound && file.selected"
                    ref="editorComponent"
                    :canvas-width="screenWidth"
                    :canvas-height="screenWidth"
                    :editor-id="'1'"
                  />
                </div> -->
                <Editor
                  v-show="imageFound"
                  ref="editorComponent"
                  :canvas-width="screenWidth"
                  :canvas-height="screenWidth"
                  :editor-id="'1'"
                />
                <v-card
                  v-if="!imageFound && docFound"
                  :width="screenWidth"
                  :height="screenWidth"
                >
                  <v-icon :size="windowWidth > 1366 ? 400 : 200">
                    {{ selectedDoc.icon }}
                  </v-icon>
                  <div
                    class="d-flex flex-row custom-text-preview"
                    :class="windowWidth > 1366 ? 'mt-5' : 'mt-13 ml-n10'"
                    style="width: 400px"
                  >
                    <span>{{ selectedDoc.name }}</span>
                  </div>
                </v-card>
              </div>
            </div>
            <div
              class="d-flex justify-center mx-auto align-center"
              :class="windowWidth > 1366 ? 'mt-15' : 'mt-2 mr-15'"
              style="width: 800px"
            >
              <div
                v-for="(file, index) in previewfilesarray"
                :key="index"
                class="d-flex justify-center align-center ma-0 pa-0"
              >
                <v-text-field
                  v-if="file.selected"
                  v-model="file.caption"
                  outlined
                  :dense="windowWidth <= 1366"
                  hide-details=""
                  placeholder="Ingresa un mensaje..."
                  background-color="white"
                  style="border-radius: 10px; width: 400px"
                />
                <v-menu
                  v-if="file.selected"
                  bottom
                  left
                  offset-y
                  offset-x
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="primary" v-bind="attrs" v-on="on">
                      <v-icon>mdi-emoticon-happy-outline</v-icon>
                    </v-btn>
                  </template>
                  <VEmojiPicker @select="selectCaptionEmoji2($event, file)" />
                </v-menu>
              </div>
            </div>
          </div>
          <!-- SESSION CERRADA PLANTILLA -->
          <div v-if="selectedChat.sessionId === undefined" class="row-prueba">
            <div class="d-flex justify-space-between align-center mt-5">
              <v-btn text>
                <v-icon x-large>mdi-send</v-icon>
                <div>Enviar mensaje con plantilla</div>
              </v-btn>
            </div>
          </div>
          <!-- SESSION CERRADA PLANTILLA -->
          <div
            v-if="selectedChat.sessionId !== undefined"
            class="fileinput-row-dos"
          >
            <div class="d-flex justify-space-between align-center mt-5">
              <div
                class="d-flex justify-center align-center overflow-x-auto"
                style="width: calc(100% - 50px)"
              >
                <v-btn
                  v-for="(img, index) in previewfilesarray"
                  :key="index"
                  class="mx-2 pa-0"
                  text
                  style="width: auto; height: auto"
                  @click="showSelectedFile(img)"
                >
                  <v-img
                    v-if="img.maintype === 'image'"
                    class="px-0"
                    :class="{ 'active-file-border': img.selected }"
                    width="100"
                    max-width="100"
                    max-height="40"
                    :src="img.url"
                    style="border-radius: 10px"
                  />
                  <v-icon
                    v-if="img.maintype !== 'image'"
                    class="pa-0"
                    :class="{ 'active-file-border': img.selected }"
                    x-large
                  >
                    {{ img.icon }}
                  </v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  large
                  icon
                  class="ml-2"
                  @click="openThumbFile('any')"
                >
                  <v-icon large>mdi-plus-circle-outline</v-icon>
                </v-btn>
              </div>
              <div style="width: 50px" class="mr-5">
                <v-btn x-large icon color="success" @click="sendFiles()">
                  <v-icon x-large>mdi-send</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <assign-agent-dialog
        v-model="selectedAssignAgent"
        @assign-agents="assignAgents"
      />
    </div>
    <v-file-input
      id="fileimages"
      v-model="selectedFile"
      multiple
      class="d-none"
      :accept="IMG_TYPES"
      @change="uploadFile"
    />
    <v-file-input
      id="filedocs"
      v-model="selectedFile"
      class="d-none"
      multiple
      :accept="DOCUMENTS_TYPES"
      @change="uploadFile"
    />
    <v-file-input
      id="any"
      v-model="selectedFile"
      class="d-none"
      multiple
      @change="uploadFile"
    />
    <template-assign-dialog
      v-model="templateDialog"
      :selected-chat="selectedChat"
      @btn-active-action="openConversationWithTemplate"
    />
  </v-container>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import filesMixin from '@/mixins/util/filesMixin'
import { mapGetters } from 'vuex'
import WhatsappMessage from '@/components/modules/whatsapp/chats/WhatsappMessage.vue'
import AssignAgentDialog from '@/components/modules/whatsapp/chats/AssignAgentDialog.vue'
import Editor from 'vue-image-markup'
import TemplateAssignDialog from '@/components/modules/whatsapp/chats/TemplateAssignDialog.vue'
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'

export default {
  name: 'WhatsappChat',
  components: {
    VEmojiPicker,
    WhatsappMessage,
    TemplateAssignDialog,
    AssignAgentDialog,
    Editor,
  },
  mixins: [filesMixin, templateBffMixin, whatsappBffMixin],
  props: {
    selectedChat: {
      type: Object,
      default: () => ({}),
    },
    messages: {
      type: Array,
      default: () => [],
    },
    loadingChat: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    templateDialog: false,
    templateList: [
      {
        id: '1',
        name: 'holaaa',
        header: {
          id: '1',
        },
      },
      {
        id: '2',
        name: 'holaaa2',
        header: {
          id: '1',
        },
      },
    ],
    templateList2: [],
    chatText: '',
    canvasWidth: 400,
    canvasHeight: 400,
    filecaption: '',
    selectedAssignAgent: false,
    selectedFile: null,
    filetype: '',
    IMG_TYPES: 'image/*,video/*',
    DOCUMENTS_TYPES:
      'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf',
    fileurl: '',
    previewfilesarray: [],
    imageEditor: {
      text: {},
      circle: {},
      rect: {},
      selectMode: {},
      arrow: {},
      freeDrawing: {},
      crop: {},
    },
    editor: {
      mode: 'FreeDraw',
    },
    imageFound: false,
    showEditor: false,
    newAudio: null,
    recorder: null,
    recording: false,
    sendCategories: [],
    docFound: false,
    selectedDoc: null,
    windowWidth: window.innerWidth,
  }),
  computed: {
    ...mapGetters(['clientId', 'userRole']),
    newAudioURL() {
      return URL.createObjectURL(this.newAudio)
    },
    screenWidth() {
      if (this.windowWidth <= 1366) return '200'
      return '400'
    },
  },
  watch: {
    'selectedChat.id': {
      handler() {
        this.closePreview()
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
    this.populateTemplates()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    selectEmoji(emoji) {
      this.chatText += emoji.data
    },
    selectCaptionEmoji(emoji) {
      this.filecaption += emoji.data
    },
    selectCaptionEmoji2(emoji, file) {
      file.caption += emoji.data
    },
    async record() {
      this.newAudio = null
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
      const options = { mimeType: 'audio/webm;codecs=opus' }
      const recordedChunks = []
      this.recorder = new MediaRecorder(stream, options)
      this.recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data)
        }
      })
      this.recorder.addEventListener('stop', async () => {
        this.newAudio = new Blob(recordedChunks)
        const data = this.newAudio
        const fileAudio = window.URL.createObjectURL(data)
        const itemNewMessage = {
          clientId: this.clientId,
          ContactId: this.selectedChat.id,
          id: -1,
          audioData: await this.createBase64(data),
          text: '',
          type: 'audio',
          from: this.$auth.user.email,
          ownMessage: true,
          src: fileAudio,
          ext: 'opus',
        }
        console.log('array: ', itemNewMessage)
        const newMessage = await this.createMessageByclientIdContactId(
          itemNewMessage
        )
        this.messages.push(newMessage)
      })
      this.recorder.start()
      this.recording = true
      console.log('play: ', this.recording)
    },
    async stop() {
      this.recorder.stop()
      this.recorder = null
      this.recording = false
    },
    createBase64(blob) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, _) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    },
    async assignAgents(agent) {
      await this.assignAgenttoChat(agent.id, this.selectedChat.id)
    },
    async sendTextMessage() {
      const msgObject = {
        conversationId: this.selectedChat.id,
        typeSend: 'normal',
        type: 'text',
        content: this.chatText,
      }
      this.chatText = ''
      await this.sendWhatsappMessage(msgObject)
    },
    async openConversationWithTemplate(evt) {
      const msgObject = {
        conversationId: this.selectedChat.id,
        typeSend: 'normal',
        type: 'template',
        template: {
          id: evt.id,
          headerVars: evt.headVars,
          bodyVars: evt.bodyVars,
        },
      }
      await this.sendWhatsappMessage(msgObject)
      this.$emit('update-chat', this.selectedChat)
    },
    openThumbFile(filetype) {
      if (filetype !== 'any') document.getElementById(`${filetype}`).click()
      else document.getElementById('any').click()
    },

    getFileType(filetype) {
      return (
        filetype.substring(filetype.lastIndexOf('/') + 1, filetype.length) ||
        filetype
      )
    },
    getIconByFile(maintype) {
      if (maintype === 'application' || maintype === 'text') return 'mdi-file'
      return 'mdi-multimedia'
    },
    async previewArray() {
      this.previewfilesarray = []
      await this.selectedFile.forEach((file) => {
        const maintype = file.type.substring(0, file.type.indexOf('/'))
        this.previewfilesarray.push({
          name: file.name,
          type: file.type,
          caption: '',
          selected: false,
          maintype,
          icon: this.getIconByFile(maintype),
          url: URL.createObjectURL(file),
          event: {
            target: {
              files: [file],
            },
          },
        })
      })
    },
    closePreview() {
      this.selectedFile = null
      this.imageFound = false
      this.docFound = false
      this.fileurl = ''
      this.previewfilesarray = []
    },
    showSelectedFile(file) {
      // eslint-disable-next-line no-return-assign
      this.previewfilesarray.map((x) => (x.selected = false))
      file.selected = true
      if (file.maintype === 'image') {
        this.docFound = false
        this.imageFound = true
        this.fileurl = file.url
        this.$refs.editorComponent.uploadImage(file.event)
      } else {
        this.docFound = true
        this.imageFound = false
        this.selectedDoc = file
      }
    },
    async uploadFile(event) {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      if (event.length > 0) {
        await wait(await this.previewArray())
        this.docFound = false
        this.imageFound = false
        this.showEditor = true
        this.$nextTick(() => {
          if (event[0].type.includes('image')) {
            this.docFound = false
            this.imageFound = true
            if (this.$refs.editorComponent !== undefined) {
              const showevent = {
                target: {
                  files: [event[0]],
                },
              }
              this.$refs.editorComponent.uploadImage(showevent)
              this.previewfilesarray[0].selected = true
            }
          } else if (event[0].type.includes('application')) {
            this.showSelectedFile(this.previewfilesarray[0])
            this.imageFound = false
            this.docFound = true
          }
        })
      }
    },
    freeDrawing() {
      this.$nextTick(() => {
        if (this.$refs.editorComponent !== undefined)
          this.$refs.editorComponent.set('freeDrawing')
      })
    },
    async sendFiles() {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const filelist = []
      // eslint-disable-next-line no-restricted-syntax
      for (const file of this.previewfilesarray) {
        // eslint-disable-next-line no-await-in-loop
        await wait(file)
        // eslint-disable-next-line no-await-in-loop
        const base64aux = await this.fileToBase64(file.event.target.files[0])
        filelist.push({
          conversationId: this.selectedChat.id,
          typeSend: this.selectedChat.broadcast ? 'difusion' : 'normal',
          type: file.type,
          name: file.name,
          caption: file.caption,
          media: {
            base64: base64aux,
            mediaType: file.type,
            extension: this.getFileExtension(file.event.target.files[0]),
          },
        })
      }

      const filetosend = {
        messages: filelist,
      }
      await this.sendWhatsappMessage(filetosend)
      this.closePreview()
    },
    async populateTemplates() {
      const filterService = {
        clientId: this.clientId,
        page: -1,
        statusList: [1],
      }

      const templatesListTMP = await this.getTemplates(filterService)

      this.templateList2 = templatesListTMP.dataList
    },
  },
}
</script>

<style scoped>
.template-message-card {
  background-color: var(--v-whatsappgreen-base);
}
.template-message-time {
  color: var(--v-accent-base);
  font-weight: 400;
}
.template-message-number {
  color: var(--v-whatsappblue-base);
  font-weight: 600;
}
.template-message-header {
  font-weight: 600;
  color: var(--v-accent-base);
}
.template-message-footer {
  margin-top: 5px;
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--v-accent-base);
}
.dialog-template {
  background-size: 550px;
}
.row-prueba {
  height: 57px;
  width: 100%;
  /* text-transform: none; */
  /* height: calc(100vh - calc(100vh - 230px)); */
}
.no-transform-button {
  text-transform: none;
}
.header-text {
  font-weight: 400;
  font-size: 12px;
  color: var(--v-accent-base);
}
.header-text-small {
  font-weight: 400;
  font-size: 10px;
  color: var(--v-accent-base);
}
.custom-text-preview {
  width: 400px;
  max-width: 400px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.chat-background {
  position: relative;
  width: 100%;
  background-size: 550px;
  background-repeat: repeat;
  background-color: var(--v-lightcyan-base);
}
.fileinput-background {
  position: relative;
  width: 100%;
  height: calc(100vh - 175px) !important;
  /* min-height: 800px; */
  background-size: 550px;
  background-repeat: repeat;
  background-color: var(--v-gray-base);
}
.fileinput-row-uno {
  position: relative;
  height: calc(100% - 100px);
  width: 100%;
}
.fileinput-row-dos {
  height: 100px;
  width: 100%;
  border-top: 1px solid var(--v-gray300-base);
}
.fileinput-close {
  position: absolute;
  top: 20px;
  left: 20px;
}

.active-file-border {
  border: 2px solid var(--v-primary-base);
}

.background-image {
  height: calc(100vh - 230px);
  background-color: rgba(255, 255, 255, 0.5);
  overflow-x: hidden;
  padding: 0 10px;
}
.vue-audio-recorder {
  width: 38px !important;
  height: 38px !important;
}
.editor-style {
  border: 2px solid var(--v-primary-base);
}
.stop {
  animation-name: anim;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
@keyframes anim {
  0% {
    background-color: var(--v-secondary-base);
  }
  25% {
    background-color: #644305;
  }
  50% {
    background-color: var(--v-primary-base);
  }
  75% {
    background-color: #644305;
  }
  100% {
    background-color: var(--v-secondary-base);
  }
}
</style>
