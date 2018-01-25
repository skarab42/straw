<template>
  <v-tooltip top>
    <v-btn slot="activator" icon v-if="firmwareIndex" @click.stop="click">
      <v-icon :color="color">update</v-icon>
    </v-btn>
    <span v-text="tooltip" />
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'firmware-update-button',

  props: {
    board: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters('firmware', ['getFirmwareCommitIndex']),

    firmwareIndex () {
      return this.getFirmwareCommitIndex(this.$props.board.version.hash)
    },

    color () {
      return this.firmwareIndex > 10 ? 'red' : 'orange'
    },

    tooltip () {
      let i = this.firmwareIndex
      return 'Firmware update available (' + (i > 99 ? '> 99' : i) + ')'
    }
  },

  methods: {
    click () {
      this.$emit('click', this.$props.board)
    }
  }
}
</script>
