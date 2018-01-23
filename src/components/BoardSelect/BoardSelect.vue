<template>
  <div>
    <v-alert v-if="!boardsCollection.length" :value="true" color="warning" icon="warning">
      Board list empty, go to the <router-link to="boards">board manager</router-link> to find some.
    </v-alert>
    <page-card v-else flat dark square color="secondary">
      <v-select
      class="pa-1"
      return-object
      persistent-hint
      :items="boardsCollection"
      v-model="board"
      item-text="name"
      item-value="address"
      :error-messages="errorMessages" />
    </page-card>
    <slot name="default" v-if="board" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'board-select',

  computed: {
    ...mapGetters('boards', ['boardsCollection', 'selectedBoardAddress']),

    board: {
      get () {
        return this.selectedBoardAddress
      },

      set (board) {
        this.selectBoard(board)
      }
    },

    errorMessages () {
      return this.board ? [] : ['Please select a board']
    }
  },

  methods: {
    ...mapActions('boards', ['selectBoard'])
  }
}
</script>
