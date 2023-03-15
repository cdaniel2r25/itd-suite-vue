<template>
  <div
    :class="
      message.ownMessage ? 'white position-left' : 'green100 position-right'
    "
  >
    <v-card-text>
      <div v-if="message.messageType === 'text'" class="">
        {{ message.content }}
      </div>
      <div v-if="message.messageType === 'image'" class="">
        <img :src="message.otherInfo.media.medias.link" />
        {{ message.otherInfo.media.medias.caption }}
      </div>
      <div v-if="message.messageType === 'audio'">
        <audio :src="message.otherInfo.media.medias.link" controls />
      </div>
      <div v-if="message.messageType === 'video'">
        <video width="100%" height="240" controls>
          <source
            :src="message.otherInfo.media.medias.link"
            :type="message.otherInfo.media.medias.link.mimeType"
          />
          Your browser does not support the video tag.
        </video>
        {{ message.otherInfo.media.medias.caption }}
      </div>
      <div v-if="message.messageType === 'template'" class="">
        {{ message.content }}
      </div>
      <span class="inline">{{ message.createdAt }}</span>
    </v-card-text>
    <div
      v-if="message.status === 'ERROR'"
      :class="message.ownMessage ? 'position-left' : 'position-right'"
    >
      <v-tooltip
        bottom
        color="accent"
        nudge-bottom="6"
        content-class="custom-tooltip"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="pt-1" color="secondary" v-bind="attrs" v-on="on">
            mdi-alert-circle
          </v-icon>
        </template>
        <div>
          <div class="py-2 white--text font-weight-bold help-text">
            {{ message.otherInfo.message }}
          </div>
        </div>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WhatsappMessage',
  props: {
    message: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style scoped>
.inline {
  display: inline-block;
}
.position-right,
.position-left {
  position: relative;
  border-radius: 10px !important;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 70% !important;
}
.position-right::after {
  position: absolute;
  top: 15px;
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid var(--v-green100-base);
  border-left: 15px solid transparent;
  left: -15px;
}
.position-left::after {
  position: absolute;
  top: 15px;
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid white;
  border-right: 15px solid transparent;
  right: -15px;
}
</style>
