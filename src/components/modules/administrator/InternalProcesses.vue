<template>
  <div>
    <v-row>
      <v-col
        v-for="connectionItem in connectionList"
        :key="connectionItem.processId"
        cols="6"
        sm="4"
      >
        <v-sheet
          outlined
          :color="connectionItem.initiated ? 'primary' : 'gray300'"
          rounded
        >
          <v-card
            elevation="0"
            outlined
            :color="connectionItem.initiated ? 'lightcyan' : 'white'"
          >
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="9">
                  <div class="caption font-weight-bold">
                    {{ connectionItem.processName }}
                  </div>
                  <div class="caption">
                    {{ connectionItem.lastInitiatedDate }}
                  </div>
                </v-col>
                <v-col cols="3" class="d-flex justify-end">
                  <v-switch
                    v-model="connectionItem.initiated"
                    color="primary"
                    class="pt-0 mt-0"
                    @change="$emit('change-connection-item', connectionItem)"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <div v-if="connectionItem.initiated">
              <v-divider color="primary" class="color-border"></v-divider>
              <v-card-text class="pa-0">
                <div
                  v-if="connectionItem.processReference == 'process'"
                  class="lds-ellipsis"
                >
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div
                  v-else
                  class="caption text-center py-1"
                  style="min-height: 27px"
                >
                  {{ connectionItem.processReference }}
                </div>
              </v-card-text>
            </div>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'InternalProcesses',
  props: {
    connectionList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      switch1: true,
    }
  },
}
</script>

<style scoped>
.color-border {
  border-color: var(--v-primary-base);
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 28px;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
.lds-ellipsis div {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--v-primary-base);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
