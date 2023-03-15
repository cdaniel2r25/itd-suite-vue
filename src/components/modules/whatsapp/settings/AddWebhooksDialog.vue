<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <v-form v-if="show" ref="form" v-model="valid">
        <v-card-title class="text-h5 lighten-2">
          <v-btn
            color="grey"
            plain
            class="btn-cancel"
            @click="$emit('change-model', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
            {{
              newWebhookItem.id === null
                ? 'Creación webhooks'
                : 'Edición webhooks'
            }}
          </div>
        </v-card-title>
        <v-card-text>
          <div class="mt-6 mx-6">
            <v-select
              v-model="newWebhookItem.eventType"
              :items="eventTypeList"
              label="Tipo evento"
              :rules="fieldRules"
              outlined
            />
            <div class="d-flex">
              <v-textarea
                v-model="newWebhookItem.url"
                rows="2"
                outlined
                label="URL webhook"
                :rules="templateUrlRules"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center py-6">
          <v-btn color="primary" outlined @click="$emit('change-model', false)">
            CANCELAR
          </v-btn>
          <v-btn
            class="ml-4 px-6"
            color="primary"
            :disabled="!valid"
            @click="$emit('btn-add-action')"
          >
            {{ newWebhookItem.id === null ? 'CREAR' : 'GUARDAR' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'AddWebhooksDialog',
  mixins: [validationMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    newWebhookItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      valid: false,
      eventTypeList: ['Estado mensaje', 'Mensaje entrante'],
    }
  },
  computed: {
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    templateUrlRules() {
      return [
        (v) => this.isRequired(v, 'Url'),
        (v) => this.minLength(v, 2),
        (v) => this.isValidHttpsUrl(v),
      ]
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
</style>
