<template>
  <v-dialog lazy scrollable v-model="dialogModel" :fullscreen="fullscreen" max-width="768">
    <v-card>

      <v-card-title :class="{ 'pa-1': fullscreen }">
        <v-select
          auto
          single-line
          hide-details
          class="pt-1 pb-1"
          v-model="filterModel"
          :items="Object.values(filters)"
          item-text="name"
          item-value="name"
          :color="filters[filterModel].color"
          :prepend-icon="filters[filterModel].icon"
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name }} ({{ getFilteredMessages(data.item.name).length }})
          </template>
          <template slot="item" slot-scope="data">
            <v-list-tile-avatar>
              <v-icon :color="data.item.color" >{{ data.item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              {{ data.item.name }} ({{ getFilteredMessages(data.item.name).length }})
            </v-list-tile-content>
          </template>
        </v-select>
      </v-card-title>

      <v-card-text :class="{ 'pa-1': fullscreen }" class="pt-0 pb-0">
        <v-divider />
        <div v-if="!filteredMessages.length" class="subheading grey--text pa-2 ma-0">
          No more item to display here
        </div>
        <v-alert
          v-for="message in filteredMessages"
          :key="message.key"
          :value="!message.deleted"
          :color="filters[message.type].color"
          :icon="fullscreen ? null : message.icon"
          transition="slide-x-transition"
          :class="{ 'ma-0' : fullscreen }"
        >
          <v-layout col align-center>
            <v-flex sm11 xs10>
              <div class="text">{{ message.text }}</div>
              <div class="time">{{ relativeHumanTime(message.time) }}</div>
            </v-flex>
            <v-flex sm1 xs2 class="text-xs-right">
              <v-btn icon @click="removeMessage(message)">
                <v-icon class="remove-button">cancel</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-alert>
        <v-divider />
      </v-card-text>

      <v-card-actions>
        <v-btn v-if="filteredMessages.length" @click="removeMessages(filteredMessages)" color="error" flat>
          remove {{ filteredMessages.length }} message{{ filteredMessages.length > 1 ? 's' : '' }}
        </v-btn>
        <v-switch hide-details label="Show notifications" v-model="notificationsModel" />
        <v-spacer />
        <v-btn color="grey" flat @click="closeDialog">close</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { relativeHumanTime } from '@/libs/utils'

export default {
  name: 'logs-dialog',

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('logs', [
      'dialog',
      'filter',
      'filters',
      'getFilteredMessages',
      'filteredMessages',
      'showNotifications'
    ]),

    dialogModel: {
      get () { return this.dialog },
      set (value) { this.setDialog(value) }
    },

    filterModel: {
      get () { return this.filter },
      set (value) { this.setFilter(value) }
    },

    notificationsModel: {
      get () { return this.showNotifications },
      set (value) { this.setShowNotification(value) }
    }
  },

  methods: {
    ...mapActions('logs', [
      'setDialog',
      'setFilter',
      'closeDialog',
      'removeMessage',
      'removeMessages',
      'setShowNotification'
    ]),

    relativeHumanTime (time) {
      return relativeHumanTime(time)
    }
  }
}
</script>

<style scoped>
.time {
  opacity: .4;
  font-size: 0.8em;
}

.text {
  word-wrap: break-word;
  word-break: break-all;
}

.remove-button {
  cursor: pointer;
  color: rgba(0,0,0,0.3) !important;
}

.dialog--scrollable .card__title, .dialog--scrollable .card__actions {
  flex: 0 0 auto;
}

.dialog--scrollable .card__text {
  flex: 1 1 auto;
}
</style>
