<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">{{ viewTitle }}</span>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mt-5" no-gutters>
        <v-col cols="12" class="mb-5">
          <span class="subtitle-1">
            {{ viewSubtitle }}
          </span>
        </v-col>
      </v-row>
      <v-row class="mt-5" no-gutters>
        <v-col cols="4" class="mb-5">
          <v-select
            v-model="client"
            :items="userClientsList"
            :item-text="(item) => item.name + ' <' + item.legalName + '> '"
            item-value="id"
            outlined
          />
        </v-col>
      </v-row>
      <v-row class="mb-n6" no-gutters>
        <v-radio-group v-model="row" row :disabled="client === null">
          <v-radio
            v-for="radio in radioButtons"
            :key="radio.value"
            :label="radio.label"
            :value="radio.value"
          />
        </v-radio-group>
      </v-row>
      <v-row>
        <ftp-connector v-if="row === 'FTP'" :connector="ftpConnector" />
        <sftp-connector v-else-if="row === 'SFTP'" :connector="sftpConnector" />
        <api-connector
          v-else-if="row === 'API REST'"
          :connector="apiConnector"
        />
        <smtp-connector v-else-if="row === 'SMTP'" :connector="smtpConnector" />
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import connectorsMixin from '@/mixins/services/connectorsMixin'
import FtpConnector from '@/components/modules/settings/connectors/FtpConnector.vue'
import SftpConnector from '@/components/modules/settings/connectors/SftpConnector.vue'
import SmtpConnector from '@/components/modules/settings/connectors/SmtpConnector.vue'
import ApiConnector from '@/components/modules/settings/connectors/ApiConnector.vue'

export default {
  components: { FtpConnector, SftpConnector, ApiConnector, SmtpConnector },
  mixins: [connectorsMixin],
  data() {
    return {
      viewTitle: 'Creación de conector',
      viewSubtitle: 'Ingresa la información.',
      row: null,
      client: null,
      idConnector: '',
      connectorAux: {},
      ftpConnector: {
        id: null,
        name: '',
        user: '',
        password: '',
        server: '',
        port: '',
      },
      sftpConnector: {
        id: null,
        name: '',
        user: '',
        password: '',
        server: '',
        port: '',
      },
      apiConnector: {
        id: null,
        clientId: null,
        name: '',
        modality: '',
        ssl: false,
        waitResponse: false,
        sslValidation: false,
        selectedAuth: '',
        requestMethod: 'GET',
        url: '',
        params: [],
        auth: {
          user: '',
          password: '',
        },
        headers: [],
        body: [],
      },
      smtpConnector: {
        id: null,
        name: '',
        user: '',
        password: '',
        server: '',
        port: '',
        auth: false,
        ttls: false,
        retryPort: null,
      },
      radioButtons: [
        {
          label: 'FTP',
          value: 'FTP',
        },
        {
          label: 'SFTP',
          value: 'SFTP',
        },
        {
          label: 'API REST',
          value: 'API REST',
        },
        {
          label: 'SMTP',
          value: 'SMTP',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['userClientsList']),
  },
  async created() {
    this.idConnector = this.$route.params.id
    await this.getRecord()
  },
  methods: {
    async getRecord() {
      if (this.idConnector !== 'create') {
        this.connectorAux = await this.getConnectorById(this.idConnector)
        this.client = this.connectorAux.clientId
        this.row = this.connectorAux.type
        if (this.connectorAux.type === 'FTP') {
          this.ftpConnector = {
            id: `${this.connectorAux.id}`,
            name: `${this.connectorAux.name}`,
            user: `${this.connectorAux.user}`,
            password: `${this.connectorAux.password}`,
            server: `${this.connectorAux.server}`,
            port: `${this.connectorAux.port}`,
            clientId: `${this.connectorAux.clientId}`,
            paths: this.connectorAux.content,
          }
        }
        if (this.connectorAux.type === 'SFTP') {
          this.sftpConnector = {
            id: `${this.connectorAux.id}`,
            name: `${this.connectorAux.name}`,
            user: `${this.connectorAux.user}`,
            password: `${this.connectorAux.password}`,
            server: `${this.connectorAux.server}`,
            port: `${this.connectorAux.port}`,
            clientId: `${this.connectorAux.clientId}`,
            paths: this.connectorAux.content,
          }
        }
        if (this.connectorAux.type === 'API REST') {
          this.apiConnector = {
            id: `${this.connectorAux.id}`,
            clientId: `${this.connectorAux.clientId}`,
            type: `${this.connectorAux.type}`,
            name: `${this.connectorAux.name}`,
            modality: `${this.connectorAux.modality}`,
            ssl: this.connectorAux.ssl,
            waitResponse: this.connectorAux.waitResponse,
            sslValidation: this.connectorAux.sslValidation,
            selectedAuth: `${this.connectorAux.selectedAuth}`,
            requestMethod: `${this.connectorAux.requestMethod}`,
            url: `${this.connectorAux.url}`,
            params: this.connectorAux.params,
            auth: {
              user: `${this.connectorAux.auth.user}`,
              password: `${this.connectorAux.auth.password}`,
            },
            headers: this.connectorAux.headers,
            body: this.connectorAux.body,
          }
        }
        if (this.connectorAux.type === 'SMTP') {
          this.smtpConnector = {
            id: null,
            type: `${this.connectorAux.type}`,
            name: `${this.connectorAux.name}`,
            user: `${this.connectorAux.user}`,
            password: `${this.connectorAux.password}`,
            server: `${this.connectorAux.server}`,
            port: `${this.connectorAux.port}`,
            auth: this.connectorAux.auth,
            ttls: this.connectorAux.ttls,
            retryPort: this.connectorAux.retryPort,
            paths: this.connectorAux.headers,
          }
        }
      }
    },
  },
}
</script>
