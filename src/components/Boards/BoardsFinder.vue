<template>
  <page-card>

    <page-card-toolbar :icon="icon" :title="title">
      <v-spacer />
      <v-btn icon @click="helpDialog = true">
        <v-icon>help</v-icon>
      </v-btn>
    </page-card-toolbar>

    <v-card-title primary-title>
      Scan the network to find some smoothie boards...
    </v-card-title>

    <v-card-text v-if="!scanning && !done">
      <v-text-field autofocus label="Input" placeholder="192.168.1.*" :rules="[validateInput]" v-model="input" />
    </v-card-text>

    <v-card-text v-if="scanning || done">
      <v-progress-linear v-model="progress.percent" :indeterminate="progress.percent === 0" />
      <p>{{ progress.scanned }} / {{ progress.total }} ({{ progress.percent }}%) - online: {{ progress.online }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn v-if="!scanning && !done" flat color="primary" :disabled="disabled" @click="startScan">Scan</v-btn>
      <v-btn v-if="scanning && !done" flat color="primary" @click="stopScan">Stop</v-btn>
      <v-btn v-if="scanning && !done && !paused" flat color="green" @click="pauseScan">Pause</v-btn>
      <v-btn v-if="scanning && !done && paused" flat color="green" @click="resumeScan">Resume</v-btn>
      <v-btn v-if="done" flat color="primary" @click="clearScan">clear</v-btn>
    </v-card-actions>

    <boards-finder-help-dialog :open="helpDialog" @close="helpDialog = false" />

  </page-card>
</template>

<script>
import { mapActions } from 'vuex'
import HTTPNetworkScanner from '@/libs/http-network-scanner'
import BoardsFinderHelpDialog from './BoardsFinderHelpDialog'

const scanner = new HTTPNetworkScanner()

export default {
  name: 'boards-finder',

  components: {
    BoardsFinderHelpDialog
  },

  created: function () {
    scanner.on('start', p => this.onProgress(p))
    scanner.on('progress', p => this.onProgress(p))
    scanner.on('board', p => this.onBoard(p))
    scanner.on('pause', p => this.onProgress(p))
    scanner.on('resume', p => this.onProgress(p))
    scanner.on('stop', p => this.onProgress(p))
    scanner.on('done', p => this.onProgress(p))
  },

  data () {
    return {
      title: 'Finder',
      icon: 'search',
      input: '192.168.1.120-121',
      disabled: false,
      scanning: false,
      paused: false,
      done: false,
      progress: {
        percent: 0,
        scanned: 0,
        online: 0,
        total: 0
      },
      helpDialog: false
    }
  },

  methods: {
    ...mapActions('boards', ['addBoard']),

    validateInput (input) {
      try {
        HTTPNetworkScanner.parseInput(input)
        this.disabled = false
      } catch (e) {
        this.disabled = true
        return e.message
      }

      return true
    },

    startScan () {
      scanner.start(this.input)
    },

    onProgress (scannerState) {
      Object.assign(this, scannerState)
    },

    onBoard (board) {
      this.addBoard(board)
    },

    pauseScan () {
      scanner.pause()
      this.paused = true
    },

    resumeScan () {
      scanner.resume()
      this.paused = false
    },

    stopScan () {
      scanner.stop()
    },

    clearScan () {
      this.done = false
    }
  }
}
</script>
