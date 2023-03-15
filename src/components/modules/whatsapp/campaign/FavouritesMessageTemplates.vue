<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="5">
          <v-text-field label="Plantilla" outlined style="width: 320px" />
        </v-col>
        <v-col cols="5">
          <v-text-field label="Fecha" outlined style="width: 320px" />
        </v-col>
        <v-col cols="2">
          <v-btn color="primary">Buscar </v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="12">
          Una vez seleccionadas las plantillas podras agregar tus variables en
          editar.
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="item in templates" :key="item.id" cols="3">
          <hover-card-animation
            hover-text="SELECCIONAR Y CONFIGURAR"
            :content-text="item.value"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import HoverCardAnimation from '@/components/util/HoverCardAnimation.vue'

export default {
  components: { HoverCardAnimation },
  mixins: [validationMixin, whatsappBffMixin],
  props: {
    campaign: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    valid: true,
    templates: [
      {
        id: '1',
        value: 'Lorem ipsum',
      },
      {
        id: '2',
        value: 'Lorem ipsum',
      },
      {
        id: '3',
        value: 'Lorem ipsum',
      },
      {
        id: '4',
        value: 'Lorem ipsum',
      },
      {
        id: '5',
        value: 'Lorem ipsum',
      },
      {
        id: '6',
        value: 'Lorem ipsum',
      },
    ],
  }),
  methods: {
    validate() {},
    copy(str) {
      navigator.clipboard.writeText(str)
    },
  },
}
</script>
<style scoped>
.hover-template-container {
  background-color: #fff;
  color: #0093b1 !important;
  border: 2px solid #0093b1;
  font-weight: bold;
  height: 100%;
  position: absolute;
}
</style>
