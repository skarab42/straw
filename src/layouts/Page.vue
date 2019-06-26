<i18n>
{
  "en-us": {
    "boards": "Boards",
    "files": "Files"
  },
  "fr-fr": {
    "boards": "Cartes",
    "files": "Fichiers"
  }
}
</i18n>

<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat dense round
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          <select-board-mini />
        </q-toolbar-title>
        <div v-if="!$q.screen.xs">Straw v0.1.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="leftDrawerMini"
      @mouseover="leftDrawerMini = false"
      @mouseout="leftDrawerMini = true"
      content-class="bg-grey-2"
      :breakpoint="500"
      :width="200"
      show-if-above
      bordered
    >
      <q-list>

        <q-item clickable tag="a" to="/boards">
          <q-item-section avatar>
            <q-icon name="settings_ethernet" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("boards") }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" to="/files">
          <q-item-section avatar>
            <q-icon name="folder_open" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("files") }}</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>

</template>

<script>
import SelectBoardMini from 'components/SelectBoardMini.vue'
export default {
  name: 'Page',
  components: {
    'select-board-mini': SelectBoardMini
  },
  data () {
    return {
      leftDrawerOpen: !this.$q.platform.is.mobile,
      leftDrawerMini: true
    }
  }
}
</script>
