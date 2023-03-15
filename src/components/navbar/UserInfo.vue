<template>
  <v-container fluid fill-height class="pt-0">
    <div class="d-flex">
      <div class="mt-1">
        <v-row :class="showName ? 'v-row-name' : ''">
          <v-menu offset-y>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip right transition="fade-transition">
                <template v-slot:activator="{ on: tooltip }">
                  <v-card
                    :class="
                      showName ? 'v-card-user-name' : 'v-card-user-no-name'
                    "
                    outlined
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                  >
                    <!-- TODO: -->
                    <!-- Por definir si imagenes son entregadas por servicios como un blob o estaran en un bucket de amazon -->
                    <!-- URL para mostrar el placeholder "https://bad.src/not/valid" -->
                    <v-img
                      :class="
                        showName ? 'v-img-user-name' : 'v-img-user-no-name'
                      "
                      contain
                      :src="require('@/assets/logo_itd_oficial.png')"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          :class="showName ? 'mt-0' : 'mt-1'"
                          align="center"
                          justify="center"
                        >
                          <v-avatar color="primary" rounded>
                            <span class="white--text text-h5">
                              {{ selectedClient.abbreviation }}
                            </span>
                          </v-avatar>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                </template>
                <span class="white--text" outlined>
                  <v-container fluid>
                    <v-row class="pb-2"><h4>Cuenta de ITD</h4></v-row>
                    <v-row class="pb-1">
                      {{ user.firstname }} {{ user.lastname }}
                    </v-row>
                    <v-row class="pb-2">{{ user.email }}</v-row>
                    <v-row>
                      <v-chip color="grey" :class="`rounded-lg`" dense>
                        {{ user.cargo }}
                      </v-chip>
                    </v-row>
                  </v-container>
                </span>
              </v-tooltip>
            </template>
            <user-info-modal :user="user" />
          </v-menu>
        </v-row>
      </div>
      <div class="ml-2">
        <div v-if="showName" class="ml-4" style="width: 85%">
          <span class="v-user-text mb-3" text>Hola {{ user.firstname }}</span>
        </div>

        <div class="m-2" style="width: 85%">
          <client-list
            :class="showName ? 'v-select-name' : 'v-select-no-name'"
            class="mx-4"
            style="width: 100%"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import UserInfoModal from '@/components/navbar/UserInfoModal.vue'
import ClientList from '@/components/navbar/ClientList.vue'

export default {
  name: 'UserInfo',
  components: { UserInfoModal, ClientList },
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    showName: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedClient: { name: '', abbreviation: '' },
    }
  },
}
</script>

<style scoped>
.v-row-name {
  margin-top: 0px;
}

.v-card-user-name {
  height: 76px;
  width: 76px;
  border: 2px solid #dedbdb;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 1%;
  display: flex;
  padding-left: 4px;
  padding-right: 4px;
}

.v-card-user-no-name {
  width: 66.52px;
  height: 57px;
  margin: 1%;

  border: 1px solid #979797;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  padding-left: 4px;
  padding-right: 4px;
}

.v-img-user-name {
  width: 100%;
}

.v-img-user-no-name {
  width: 100%;
}

.v-user-text {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 33px;
  letter-spacing: 0.15px;

  color: #0093b1;
}

.v-select-name {
  width: 140px;

  font-style: normal;
  font-size: 15px;
  line-height: 24px;

  letter-spacing: 0.15px;

  color: #747474;
}

.v-select-name :deep(.v-label) {
  /* ✏️ Label */
  font-weight: bold;
}

.v-select-no-name {
  width: 153px;
  height: 40px;
  margin: 2%;

  font-style: normal;
  font-size: 15px;
  line-height: 24px;

  letter-spacing: 0.15px;

  color: #747474;
}

.v-select-no-name :deep(.v-label) {
  /* ✏️ Label */
  font-weight: bold;
}

.v-tooltip__content {
  font-size: 100%;
  padding: 3%;
  background-color: black;
}
</style>
