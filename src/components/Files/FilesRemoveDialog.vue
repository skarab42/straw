<template>
  <page-dialog v-if="file" :open="open" @close="close">
    <page-card>
      <page-card-toolbar :color="color" :icon="icon" :title="title">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        The file at <strong>{{ file.path }}/{{ file.name }}</strong> will be removed from the sd card.
      </v-card-text>
      <v-card-actions>
        <v-btn :color="color" flat @click="confirm">confirm</v-btn>
        <v-spacer />
        <v-btn color="grey" flat @click="close">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'files-remove-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    },

    file: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      color: 'error',
      icon: 'delete_forever',
      title: 'Remove file'
    }
  },

  methods: {
    ...mapActions('files', ['removeFile']),

    close () {
      this.$emit('close')
    },

    confirm () {
      this.removeFile(this.file)
      this.close()
    }
  }
}
</script>
