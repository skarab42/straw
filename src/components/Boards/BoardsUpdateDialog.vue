<template>
  <page-dialog v-if="$props.board" :open="open" @close="close">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" :color="color">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <p>Update the firmware on <strong>{{ $props.board.name}}</strong> that is <strong>{{ backwardCommits }}</strong> {{ commits }} backward.</p>
        <v-divider class="mt-4 mb-4" />
        <h1 class="title">What does straw after confirming the update.</h1>
        <ul class="ml-4 mr-4">
          <li>Download the latest <code>firmware.bin</code> file from the official GitHub repository.</li>
          <li>Make a backup of your current <code>firmware.bin</code> and <code>config[.txt]</code>.</li>
          <li>Upload the fresh downloaded <code>firmware.bin</code> to the board.</li>
          <li>Reset the board and wait until the board is online again.</li>
        </ul>
        <v-divider class="mt-4 mb-4" />
        <h1 class="title">What should you do after the update?</h1>
        <ul class="ml-4 mr-4">
          <li>Download the latest <code>config[.txt]</code> file from the official GitHub repository.</li>
          <li>Edit the new <code>config[.txt]</code> to match your old config.</li>
          <li>Upload the new edited <code>config[.txt]</code> to the board.</li>
          <li>Reset the board and wait until the board is online again.</li>
          <li>Enjoy your fresh smoothie :)</li>
        </ul>
        <v-alert class="mt-4" outline color="info" icon="priority_high" :value="true">
          If you are not sure how things work, please read <a href="http://smoothieware.org/getting-smoothie" target="_blank">the official manual</a>.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" flat @click="confirm">confirm</v-btn>
        <v-spacer />
        <v-btn color="grey" flat @click="close">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'boards-update-dialog',

  data () {
    return {
      icon: 'update',
      color: 'error'
    }
  },

  props: {
    open: {
      type: Boolean,
      default: false
    },

    board: {
      type: Object,
      default: null
    }
  },

  computed: {
    ...mapGetters('firmware', ['getFirmwareCommitIndex']),

    title () {
      return 'Update firmware : ' + this.$props.board.name
    },

    firmwareIndex () {
      return this.getFirmwareCommitIndex(this.$props.board.version.hash)
    },

    commits () {
      return 'commit' + (this.firmwareIndex > 1 ? 's' : '')
    },

    backwardCommits () {
      return this.firmwareIndex > 99 ? '> 99' : this.firmwareIndex
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },

    confirm () {
      console.log('update firmware...')
    }
  }
}
</script>
