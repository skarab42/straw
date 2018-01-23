<template>
  <page-dialog v-if="$props.board" :open="open" @open="onOpen" @close="close">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" color="success">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <v-alert type="info" :value="true" class="mb-4" outline>Useless if the card does not have a fixed IP.</v-alert>
        <v-text-field autofocus label="Board name" v-model="name" :placeholder="this.$props.board.name" :rules="[validate]" @keyup.13="confirm" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" flat @click="confirm" :disabled="!valid">confirm</v-btn>
        <v-btn color="warning" flat @click="reset">reset</v-btn>
        <v-spacer />
        <v-btn color="grey" flat @click="close">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'boards-rename-dialog',

  data () {
    return {
      icon: 'mode_edit',
      valid: false,
      name: ''
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
    ...mapGetters('boards', ['boardsCollection']),

    title () {
      return 'Rename : ' + this.$props.board.name
    }
  },

  methods: {
    ...mapActions('boards', ['setBoardName']),

    onOpen () {
      this.reset()
    },

    close () {
      this.$emit('close')
    },

    validate (name) {
      this.valid = false

      if (name.length < 3) {
        return 'Too short (min: 3).'
      }

      let unique = true

      this.boardsCollection.forEach(b => {
        if (b.name.toLowerCase() === name.toLowerCase() && b.address !== this.board.address) {
          unique = false
        }
      })

      if (!unique) {
        return 'Board name must be unique.'
      }

      this.valid = true

      return true
    },

    clear () {
      this.name = ''
    },

    reset () {
      this.name = this.$props.board.name
    },

    confirm () {
      this.setBoardName({ ...this.$props.board, name: this.name })
      this.clear()
      this.close()
    }
  }
}
</script>
