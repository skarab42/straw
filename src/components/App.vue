<template>
  <v-app>
    <v-toolbar app fixed :flat="appFullscreen">
      <v-icon color="primary" v-text="pageIcon" />
      <v-toolbar-title v-text="pageTitle" />
      <v-spacer />
      <logs-button />
      <v-toolbar-side-icon @click="toggleDrawerOpen" />
    </v-toolbar>

    <v-navigation-drawer app fixed right v-model="drawerModel" :mini-variant="drawerMini">
      <v-toolbar dark color="primary" :flat="appFullscreen">
        <v-btn icon @click="toggleDrawerMini">
          <v-icon v-text="drawerMini ? 'chevron_left' : 'chevron_right'" />
        </v-btn>
        <v-toolbar-title v-if="!drawerMini" v-text="appTitle" />
      </v-toolbar>
      <v-list>
        <v-list-tile v-for="(route, i) in drawerRoutes" :key="route.path" :to="route.path">
          <v-list-tile-action>
            <v-icon v-html="route.meta.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="route.meta.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content app>
      <transition name="slide">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </v-content>

    <logs-dialog />
    <logs-notifications />

  </v-app>
</template>

<script>
import LogsButton from '@/components/Logs/LogsButton'
import LogsDialog from '@/components/Logs/LogsDialog'
import LogsNotifications from '@/components/Logs/LogsNotifications'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',

  components: {
    LogsButton,
    LogsDialog,
    LogsNotifications
  },

  computed: {
    ...mapGetters('app', {
      appName: 'name',
      appVersion: 'version',
      appFullscreen: 'fullscreen'
    }),

    appTitle () {
      return this.appName + ' -v' + this.appVersion
    },

    ...mapGetters('page', {
      pageIcon: 'icon',
      pageTitle: 'title'
    }),

    ...mapGetters('drawer', {
      drawerOpen: 'open',
      drawerMini: 'mini'
    }),

    drawerModel: {
      get () { return this.drawerOpen },
      set (value) { this.setDrawerOpen(value) }
    },

    drawerRoutes () {
      return this.$router.options.routes.filter(r => r.meta && r.meta.drawer)
    }
  },

  methods: {
    ...mapActions('app', {
      setAppFullscreen: 'setFullscreen'
    }),

    ...mapActions('drawer', {
      setDrawerOpen: 'setOpen',
      toggleDrawerOpen: 'toggleOpen',
      toggleDrawerMini: 'toggleMini'
    })
  },

  watch: {
    '$vuetify.breakpoint.name' (breakpoint) {
      this.setAppFullscreen(['xs', 'sm'].includes(breakpoint))
    }

  }
}
</script>

<style>
/* fix material icon */
.material-icons {
  display: inline-flex;
}

/* navigation drawer */
.navigation-drawer {
  padding-bottom: 0;
}

.navigation-drawer__border {
  display: none;
}

.navigation-drawer {
  min-height: calc(100% - 64px);
  border-left: 1px rgba(0,0,0,0.12) solid;
}

.navigation-drawer--mini-variant {
  overflow: auto;
}
.navigation-drawer--mini-variant .toolbar__content {
  justify-content: center !important;
}

.navigation-drawer--mini-variant .list__tile {
  padding: 0;
}

.navigation-drawer--mini-variant .list__tile__action {
  min-width: 100%;
}

/* slide transition */
.slide-enter-active, .slide-leave-active {
  position: absolute;
}

.slide-enter-active {
  left: 100%;
  opacity: 0;
  transition-duration: .5s;
}

.slide-enter-to {
  left: 0;
  opacity: 1;
}

.slide-leave-active {
  display: none;
}
</style>
