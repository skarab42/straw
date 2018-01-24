<template>
  <page-card>
    <page-card-toolbar :icon="icon" :title="title" />

      <v-card-text v-if="!boardsCount">
        <v-alert :value="true" color="warning" icon="warning">
          Sorrry, empty collection :( Use the "Finder" to add some boards.
        </v-alert>
      </v-card-text>

      <v-list v-else>
        <v-list-tile v-for="board in boardsCollection" :key="board.address" @click="selectBoard(board)">
          <v-list-tile-action>
            <v-icon :color="board.selected ? 'primary' : 'grey'">check_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="board.name" />
            <v-list-tile-sub-title>
              {{ getFirmwareCommitIndex(board.version.hash) }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar @click.stop>
            <v-menu bottom left transition="scale-transition">
              <v-btn icon slot="activator">
                <v-icon color="grey">more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-for="action in actions" :key="action.title" @click="openDialog(action.dialog, board)">
                  <v-list-tile-action>
                    <v-icon>{{ action.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>{{ action.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>

      <boards-rename-dialog :board="tempBoard" :open="dialogs.rename" @close="dialogs.rename = false" />
      <boards-remove-dialog :board="tempBoard" :open="dialogs.remove" @close="dialogs.remove = false" />
      <boards-info-dialog :board="tempBoard" :open="dialogs.info" @close="dialogs.info = false" />

  </page-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BoardsRenameDialog from './BoardsRenameDialog'
import BoardsRemoveDialog from './BoardsRemoveDialog'
import BoardsInfoDialog from './BoardsInfoDialog'

export default {
  name: 'boards-collection',

  components: {
    BoardsRenameDialog,
    BoardsRemoveDialog,
    BoardsInfoDialog
  },

  data () {
    return {
      icon: 'dashboard',
      title: 'Collection',
      tempBoard: null,
      actions: [
        { dialog: 'rename', title: 'Rename', icon: 'mode_edit' },
        { dialog: 'remove', title: 'Remove', icon: 'delete_forever' },
        { dialog: 'info', title: 'Info', icon: 'help' }
      ],
      dialogs: {
        rename: false,
        remove: false,
        info: false
      }
    }
  },

  computed: {
    ...mapGetters('boards', ['boardsCount', 'boardsCollection']),
    ...mapGetters('firmware', ['getFirmwareCommitIndex'])
  },

  methods: {
    ...mapActions('boards', ['selectBoard']),

    openDialog (name, board) {
      if (this.dialogs[name] !== undefined) {
        this.tempBoard = board
        this.dialogs[name] = true
      }
    }
  }
}
</script>
