<template>
  <v-btn icon v-if="messages.length" @click="openDialog">
    <v-badge right :overlap="fullscreen" :color="badgeColor">
      <span slot="badge" style="font-size: 0.8em" v-text="messages.length" />
      <v-icon :color="iconColor" v-text="'notifications_active'" />
    </v-badge>
  </v-btn>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'logs-button',

  props: {
    iconColor: { type: String, default: 'secondary' },
    badgeColor: { type: String, default: 'primary' }
  },

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('logs', ['getFilteredMessages']),

    messages () {
      return this.getFilteredMessages('all')
    }
  },

  methods: {
    ...mapActions('logs', ['openDialog'])
  }
}
</script>
