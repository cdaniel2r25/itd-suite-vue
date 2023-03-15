<template>
  <div class="pa-6">
    <div class="mb-6">Ajustes de ejecución</div>
    <v-select
      v-model="selectedActivity.config.type"
      dense
      :items="conditions"
      label="Tipo"
      placeholder="Selecciona tipo"
      outlined
      @change="$emit('change-element')"
    />
    <div v-if="selectedActivity.config.type === 'Minutos'">
      <v-form ref="form" v-model="validMinutes" lazy-validation>
        <v-select
          v-model="selectedActivity.config.countMinutes"
          dense
          :items="minutes"
          item-text="text"
          item-value="value"
          :rules="fieldRules"
          label="¿Cada cuántos minutos?"
          placeholder="Ingresar minutos"
          outlined
          @change="$emit('change-element')"
        />
      </v-form>
      <div class="mt-2 d-flex">
        <v-icon color="primary" class="mr-2">mdi-alert-circle</v-icon>
        El disparador ejecutará cada
        {{ selectedActivity.config.countMinutes }} minutos.
      </div>
    </div>
    <div v-if="selectedActivity.config.type === 'Cada hora'">
      <v-form ref="form" v-model="validHours" lazy-validation>
        <v-radio-group
          v-model="selectedActivity.config.hourlyOrStartTo"
          @change="$emit('change-element')"
        >
          <v-radio label="¿Cada cuántas horas?" value="0" />
          <v-select
            v-if="selectedActivity.config.hourlyOrStartTo === '0'"
            v-model="selectedActivity.config.countHours"
            dense
            :items="hours"
            item-text="text"
            item-value="value"
            :rules="fieldRules"
            label="¿Cada cuántas horas?"
            placeholder="Ingresar horas"
            outlined
            @change="$emit('change-element')"
          />
          <v-radio label="Empieza a" value="1" />
          <div
            v-if="selectedActivity.config.hourlyOrStartTo === '1'"
            class="d-flex"
          >
            <v-select
              v-model="selectedActivity.config.hours"
              dense
              :items="hours"
              item-text="text"
              item-value="value"
              :rules="fieldRules"
              label="Horas"
              placeholder="Ingresar horas"
              outlined
              @change="$emit('change-element')"
            />
            <span class="mt-2 px-1">:</span>
            <v-select
              v-model="selectedActivity.config.minutes"
              dense
              :items="minutes"
              item-text="text"
              item-value="value"
              :rules="fieldRules"
              label="Minutos"
              placeholder="Ingresar minutos"
              outlined
              @change="$emit('change-element')"
            />
          </div>
        </v-radio-group>
      </v-form>
      <div class="mt-2 d-flex">
        <v-icon color="primary" class="mr-2">mdi-alert-circle</v-icon>
        <span v-if="selectedActivity.config.hourlyOrStartTo === '0'">
          El disparador ejecutará cada
          {{ selectedActivity.config.countHours }} horas.
        </span>
        <span v-else>
          Se ejecutará en
          {{ selectedActivity.config.hours }}
          :
          {{ selectedActivity.config.minutes }}
        </span>
      </div>
    </div>
    <div v-if="selectedActivity.config.type === 'Diario'">
      <v-radio-group
        v-model="selectedActivity.config.allDaysOrMondayFriday"
        @change="$emit('change-element')"
      >
        <v-radio label="Todos los días" value="0" />
        <v-radio label="De lunes a viernes" value="1" />
        <div class="mt-6 mb-1">Empieza a:</div>
        <v-form ref="form" v-model="validDaily" lazy-validation>
          <div class="d-flex">
            <v-select
              v-model="selectedActivity.config.hours"
              dense
              :items="hours"
              item-text="text"
              item-value="value"
              :rules="fieldRules"
              label="Horas"
              placeholder="Ingresar horas"
              outlined
              @change="$emit('change-element')"
            />
            <span class="mt-2 px-1">:</span>
            <v-select
              v-model="selectedActivity.config.minutes"
              dense
              :items="minutes"
              item-text="text"
              item-value="value"
              :rules="fieldRules"
              label="Minutos"
              placeholder="Ingresar minutos"
              outlined
              @change="$emit('change-element')"
            />
          </div>
        </v-form>
        <div class="mt-2 d-flex">
          <v-icon color="primary" class="mr-2">mdi-alert-circle</v-icon>
          El disparador ejecutará cada
          {{ selectedActivity.config.hours }}:{{
            selectedActivity.config.minutes
          }}
          horas.
        </div>
      </v-radio-group>
    </div>
    <div v-if="selectedActivity.config.type === 'Semanal'">
      <div class="d-flex justify-space-between">
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.monday"
            hide-details
            @change="$emit('change-element')"
          />
          LUN
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.tuesday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          MAR
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.wednesday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          MIE
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.thursday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          JUE
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.friday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          VIE
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.saturday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          SAB
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.sunday"
            hide-details
            @change="$emit('change-element')"
          ></v-checkbox>
          DOM
        </div>
      </div>
      <div class="mt-6 mb-1">Empieza a:</div>
      <v-form ref="form" v-model="validWeekly" lazy-validation>
        <div class="d-flex">
          <v-select
            v-model="selectedActivity.config.hours"
            dense
            :items="hours"
            item-text="text"
            item-value="value"
            :rules="fieldRules"
            label="Horas"
            placeholder="Ingresar horas"
            outlined
            @change="$emit('change-element')"
          />
          <span class="mt-2 px-1">:</span>
          <v-select
            v-model="selectedActivity.config.minutes"
            dense
            :items="minutes"
            item-text="text"
            item-value="value"
            :rules="fieldRules"
            label="Minutos"
            placeholder="Ingresar minutos"
            outlined
            @change="$emit('change-element')"
          />
        </div>
      </v-form>
      <div class="mt-2 d-flex">
        <v-icon color="primary" class="mr-2">mdi-alert-circle</v-icon>
        Se ejecutará a las
        {{ selectedActivity.config.hours }}:{{
          selectedActivity.config.minutes
        }}
        horas los días {{ runDays() }}
      </div>
    </div>
    <div>
      <v-btn
        v-if="!showCronExpression"
        text
        color="primary"
        class="mt-6 justify-start"
        @click="showCronExpression = !showCronExpression"
      >
        Mostrar expresión Cron
      </v-btn>
      <v-btn
        v-if="showCronExpression"
        text
        color="primary"
        class="mt-6 justify-start"
        @click="showCronExpression = !showCronExpression"
      >
        Ocultar expresión cron
      </v-btn>
      <div v-if="showCronExpression" class="mt-6">
        Expresión: {{ createExpression(selectedActivity.config.type) }}
      </div>
    </div>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'TriggerConfiguration',
  mixins: [validationMixin],
  props: {
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      conditions: ['Minutos', 'Cada hora', 'Diario', 'Semanal'],
      hours: [],
      minutes: [],
      validMinutes: true,
      validHours: true,
      validWeekly: true,
      validDaily: true,
      showCronExpression: false,
    }
  },
  computed: {
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
  },
  created() {
    this.createHoursMinutes()
  },
  methods: {
    createHoursMinutes() {
      for (let i = 0; i <= 23; i += 1) {
        let worth = null
        if (i < 10) {
          worth = {
            text: `0${i.toString()}`,
            value: i.toString(),
          }
        } else {
          worth = {
            text: i.toString(),
            value: i.toString(),
          }
        }
        this.hours.push(worth)
      }
      for (let i = 0; i <= 59; i += 1) {
        let worth = null
        if (i < 10) {
          worth = {
            text: `0${i.toString()}`,
            value: i.toString(),
          }
        } else {
          worth = {
            text: i.toString(),
            value: i.toString(),
          }
        }
        this.minutes.push(worth)
      }
    },
    validate() {
      this.$refs.form.validate()
    },
    runDays() {
      let week = ''
      if (this.selectedActivity.config.monday) {
        week = 'Lunes '
      }
      if (this.selectedActivity.config.tuesday) {
        week += 'Martes '
      }
      if (this.selectedActivity.config.wednesday) {
        week += 'Miércoles '
      }
      if (this.selectedActivity.config.thursday) {
        week += 'Jueves '
      }
      if (this.selectedActivity.config.friday) {
        week += 'Viernes '
      }
      if (this.selectedActivity.config.saturday) {
        week += 'Sábado '
      }
      if (this.selectedActivity.config.sunday) {
        week += 'Domingo '
      }
      return week
    },
    runDaily() {
      if (this.selectedActivity.config.allDaysOrMondayFriday === '0') {
        return '1/1 * ?'
      }
      return ' ? * 1-5'
    },
    weekday() {
      let day = ''
      if (this.selectedActivity.config.sunday) {
        day += '1'
      }
      if (this.selectedActivity.config.monday) {
        if (day !== '') {
          day += ','
        }
        day += '2'
      }
      if (this.selectedActivity.config.tuesday) {
        if (day !== '') {
          day += ','
        }
        day += '3'
      }
      if (this.selectedActivity.config.wednesday) {
        if (day !== '') {
          day += ','
        }
        day += '4'
      }
      if (this.selectedActivity.config.thursday) {
        if (day !== '') {
          day += ','
        }
        day += '5'
      }
      if (this.selectedActivity.config.friday) {
        if (day !== '') {
          day += ','
        }
        day += '6'
      }
      if (this.selectedActivity.config.saturday) {
        if (day !== '') {
          day += ','
        }
        day += '7'
      }
      return day
    },
    createExpression(type) {
      let text = ''
      if (type === 'Minutos') {
        text = `0 0/${this.selectedActivity.config.countMinutes} * ? * *`
      }
      if (type === 'Cada hora') {
        if (this.selectedActivity.config.hourlyOrStartTo === '1') {
          text = `0 ${this.selectedActivity.config.minutes} ${this.selectedActivity.config.hours} ? * *`
        } else {
          text = `0 * 0/${this.selectedActivity.config.countHours} * * *`
        }
      }
      if (type === 'Diario') {
        text = `0 ${this.selectedActivity.config.minutes} ${this.selectedActivity.config.hours}`
        text += this.runDaily()
      }
      if (type === 'Semanal') {
        text = `0 ${this.selectedActivity.config.minutes} ${
          this.selectedActivity.config.hours
        } ? * ${this.weekday()}`
      }
      this.selectedActivity.config.expression = text
      return text
    },
  },
}
</script>
