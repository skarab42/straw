<template>
  <v-breadcrumbs divider="/" :large="!fullscreen" class="grey lighten-4 pl-0 pt-0 pb-0">
    <v-btn icon @click="navigate(breadcrumbs.length - 2)" :disabled="breadcrumbs.length < 2" color="grey--text">
      <v-icon>keyboard_return</v-icon>
    </v-btn>
    <v-breadcrumbs-item
      v-for="(item, key) in breadcrumbs"
      :key="key"
      :disabled="item.disabled"
      @click.native="!item.disabled && navigate(key)"
      class="white--text"
    >
      {{ item.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'files-list-breadcrumbs',

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('files', ['currentBoardPath']),

    currentBoardPathArray () {
      return this.currentBoardPath.split('/').filter(d => d.length)
    },

    breadcrumbs () {
      return this.currentBoardPathArray.map((path, i, self) => {
        return { text: path, disabled: i === (self.length - 1) }
      })
    }
  },

  methods: {
    ...mapActions('files', ['openFolder']),

    navigate (key) {
      this.openFolder({
        path: this.currentBoardPathArray.slice(0, key + 1).join('/')
      })
    }
  }
}
</script>
