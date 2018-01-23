<template>
  <page-dialog v-if="$props.board" :open="open" @close="close">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" color="error">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        The board <strong>{{ $props.board.name }}</strong> <template v-if="$props.board.name !== $props.board.address">at <strong>{{ $props.board.address }}</strong></template> will be removed from the list.
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
import { mapActions } from 'vuex'

export default {
  name: 'boards-remove-dialog',

  data () {
    return {
      icon: 'delete_forever'
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
    title () {
      return 'Remove : ' + this.$props.board.name
    }
  },

  methods: {
    ...mapActions('boards', ['removeBoard']),

    close () {
      this.$emit('close')
    },

    confirm () {
      this.removeBoard(this.$props.board)
      this.close()
    }
  }
}
</script>
