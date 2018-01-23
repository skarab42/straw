<template>
  <div v-if="showNotifications && notifications.length" class="logs-notifications white" :class="{ 'drawer-mini': mini, 'drawer-open': open, 'pa-2': !fullscreen }">
    <v-alert
      v-for="message in notifications"
      :value="!message.deleted"
      :key="message.key"
      :color="filters[message.type].color"
      :icon="fullscreen ? null : message.icon"
      :class="{ 'ma-0' : fullscreen }"
      class="pt-0 pb-0 mb-0 elevation-2"
      transition="slide-y-transition"
    >
      <v-layout col align-center>
        <v-flex xs10>
          <div class="text">{{ message.text }}</div>
        </v-flex>
        <v-flex xs2 class="text-xs-right">
          <v-btn icon @click="removeMessage(message)">
            <v-icon class="remove-button">cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-alert>
    <v-switch hide-details label="Show notifications" v-model="notificationsModel" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'logs-notifications',

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('drawer', ['mini', 'open']),
    ...mapGetters('logs', ['filters', 'showNotifications', 'notifications']),

    notificationsModel: {
      get () { return this.showNotifications },
      set (value) { this.setShowNotification(value) }
    }
  },

  methods: {
    ...mapActions('logs', ['removeMessage', 'setShowNotification'])
  }
}
</script>

<style scoped>
.logs-notifications {
  right: 0;
  bottom: 0;
  width: 320px;
  position: fixed;
}

.alert {
  border-radius: 2px;
}

.text {
  word-wrap: break-word;
  word-break: break-all;
}

.logs-notifications.drawer-open {
  right: 300px;
}

.logs-notifications.drawer-open.drawer-mini {
  right: 80px;
}

.remove-button {
  cursor: pointer;
  color: rgba(0,0,0,0.3) !important;
}
</style>
