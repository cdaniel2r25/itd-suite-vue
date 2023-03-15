<template>
  <div>
    <v-dialog
      v-model="show"
      width="500"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-center text-h6 gray300--text">
          Enviar encuesta
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-center gray300--text">
            Enviar a traves de:
          </div>
          <v-tabs style="border-bottom: 1px solid var(--v-primary-base)">
            <v-tab>
              <v-icon left color="primary">mdi-email</v-icon>
              campaña de email
            </v-tab>
          </v-tabs>
          <div class="mt-6 gray300--text mb-2">
            Para realizar el envío en Campaña de email, se debe
            <strong>'Insertar encuesta'</strong> en
            <strong>Paso 3 Diseño</strong>, en botón o enlace de plantilla.
          </div>
          <v-img max-width="100%" :src="require('@/assets/imageemail.png')" />
          <div class="mt-4 gray300--text mb-2">
            Durante la creación de plantilla podrás
            <strong>insertar encuesta</strong> en Propiedades de botón. Para
            insertar encuesta haz los siguientes pasos:
          </div>
          <v-list dense class="mt-1">
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <v-icon color="primary">mdi-numeric-1-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                Selecciona boton, texto o imagen donde deseas poner enlace hacia
                la encuesta.
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <v-icon color="primary">mdi-numeric-2-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                En 'Insertar encuesta' selecciona la encuesta a la que deseas
                dirigir.
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="d-flex justify-center pb-6">
          <v-btn outlined color="primary" @click="$emit('change-model', false)">
            cancelar
          </v-btn>
          <v-btn color="primary" @click="$emit('go-create-campaign')">
            ir a crear campaña
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SendSurveyDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
