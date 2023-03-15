<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            text
            color="primary"
            class="px-0"
            @click="$emit('btn-return-list')"
          >
            <v-icon color="primary"> mdi-arrow-left </v-icon>
            VOLVER A LISTADO
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters class="my-4">
        <v-col cols="12">
          <h1>{{ title }}</h1>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col sm="12" md="6" class="d-flex align-start">
          <v-text-field
            v-model="itemRestriction.name"
            label="Descripción"
            placeholder="Ingresar la descripción"
            type="text"
            outlined
            @change="validar()"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col sm="12" md="6">
          <P class="mt-2"> Seleccione días de la semana </P>
          <div class="d-flex align-start">
            <v-checkbox
              v-for="(dayItem, index) in weekDays"
              :key="index"
              v-model="itemRestriction[dayItem.value]"
              :label="dayItem.label"
              class="mt-0 mr-2"
              @change="validar()"
            />
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col sm="12" md="3" class="pr-2">
          <div>Horario desde</div>
          <vue-timepicker
            v-model="itemRestriction.scheduleFrom"
            value-type="hh:mm A"
            format="HH:mm"
            drop-direction="auto"
            hour-label="Hora"
            minute-label="Minutos"
            placeholder="Seleccione hora"
            close-on-complete
            input-width="100%"
            @change="validar()"
          />
        </v-col>
        <v-col sm="12" md="3" class="pl-2">
          <div>Horario hasta</div>
          <vue-timepicker
            v-model="itemRestriction.scheduleUntil"
            value-type="hh:mm A"
            format="HH:mm"
            drop-direction="auto"
            hour-label="Hora"
            minute-label="Minutos"
            placeholder="Seleccione hora"
            close-on-complete
            input-width="100%"
            @change="validar()"
          />
        </v-col>
      </v-row>
      <div v-if="!deactivateBtn" class="d-flex align-start mt-6">
        <v-btn color="primary" outlined @click="$emit('btn-return-list')">
          CANCELAR
        </v-btn>
        <v-btn
          :disabled="!validation"
          class="ml-4"
          color="primary"
          @click="$emit('btn-add-action')"
        >
          GUARDAR
        </v-btn>
      </div>
      <div v-if="deactivateBtn">
        <v-row v-if="activeWait" class="mt-2" no-gutters>
          <v-col cols="12">
            <v-card outlined class="mt-4">
              <v-card-text>
                Espera un momento.
                <div class="mt-7 warning--text">
                  AÑADIENDO DATOS
                  <v-progress-circular
                    width="2"
                    size="20"
                    color="warning"
                    indeterminate
                    class="ml-2"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="endProcess" class="mt-2" no-gutters>
          <v-col cols="12">
            <v-sheet outlined color="greencheck" rounded class="mt-4">
              <v-card outlined elevation="0">
                <v-card-text class="text-subtitle-1">
                  <v-icon color="greencheck" class="mr-2">
                    mdi-check-circle
                  </v-icon>
                  {{
                    itemRestriction.id === ''
                      ? 'Se han añadido con éxito la restricción a base de datos:'
                      : 'Se han guardado con éxito la restricción a base de datos:'
                  }}
                  <strong> {{ itemRestriction.name }}</strong>
                  .
                </v-card-text>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

export default {
  name: 'CreateRestriction',
  components: { VueTimepicker },
  props: {
    itemRestriction: {
      type: Object,
      default: () => {},
    },
    deactivateBtn: {
      type: Boolean,
      default: false,
    },
    activeWait: {
      type: Boolean,
      default: false,
    },
    endProcess: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      validation: false,
      weekDays: [
        {
          label: 'Domingo',
          value: 'sunday',
        },
        {
          label: 'Lunes',
          value: 'monday',
        },
        {
          label: 'Martes',
          value: 'tuesday',
        },
        {
          label: 'Miércoles',
          value: 'wednesday',
        },
        {
          label: 'Jueves',
          value: 'thursday',
        },
        {
          label: 'Viernes',
          value: 'friday',
        },
        {
          label: 'Sábado',
          value: 'saturday',
        },
      ],
    }
  },
  methods: {
    validar() {
      if (
        this.itemRestriction.name &&
        this.itemRestriction.scheduleFrom &&
        this.itemRestriction.scheduleUntil &&
        (this.itemRestriction.sunday ||
          this.itemRestriction.monday ||
          this.itemRestriction.tuesday ||
          this.itemRestriction.wednesday ||
          this.itemRestriction.thursday ||
          this.itemRestriction.friday ||
          this.itemRestriction.saturday)
      ) {
        this.validation = true
      } else {
        this.validation = false
      }
    },
  },
}
</script>
