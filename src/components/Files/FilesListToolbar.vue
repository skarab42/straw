<template>
  <v-toolbar dark :color="color" :flat="true">
    <v-icon v-if="icon" v-text="icon" />
    <v-toolbar-title v-if="title" v-text="title" />
    <v-spacer />
    <slot name="default" />
    <v-btn icon @click="openUploadDialog">
      <v-icon>file_upload</v-icon>
    </v-btn>
    <v-btn icon @click="refresh">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'files-list-toolbar',

  props: {
    icon: {
      type: String,
      default: null
    },

    title: {
      type: String,
      default: null
    },

    color: {
      type: String,
      default: 'primary'
    }
  },

  methods: {
    ...mapActions('upload', ['openUploadDialog']),
    ...mapActions('files', ['openFolder']),

    refresh () {
      this.openFolder({ refresh: true })
    }
  }
}
</script>
