<i18n>
  {
    "en-us": {
      "title": "Select board",
      "selectBoard": "Select board",
      "selectedBoard": "Selected board",
      "noBoards": "No boards in collection"
    },
    "fr-fr": {
      "title": "Selectioner une carte",
      "selectBoard": "Sélectionnez une carte",
      "selectedBoard": "Carte sélectionnée",
      "noBoards": "Aucunes cartes dans la collection"
    }
  }
</i18n>

<template>
  <s-card>
    <q-card-section>
      <div class="text-h6">{{ $t("title") }}</div>
    </q-card-section>
    <q-card-section>
      <q-select
      outlined
      v-model="selectedBoard"
      :options="collection"
      :option-label="opt => opt.name"
      :option-value="opt => opt.address"
      :label="$t(selectedBoard ? 'selectedBoard' : 'selectBoard')"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section>
              {{ $t("noBoards") }}
            </q-item-section>
          </q-item>
        </template>
        <template v-if="selectedBoard" v-slot:append>
          <q-btn round dense flat icon="create" @click.stop="openRenameDialog" />
          <q-btn round dense flat icon="delete_forever" @click.stop="openRemoveDialog" />
        </template>
      </q-select>
    </q-card-section>
    <q-dialog v-model="renameDialog">
      <rename-board :board="selectedBoard" @done="closeRenameDialog" />
    </q-dialog>
    <q-dialog v-model="removeDialog">
      <remove-board :board="selectedBoard" @done="closeRemoveDialog" />
    </q-dialog>
  </s-card>
</template>

<script>
import SCard from 'components/SCard.vue'
import RenameBoard from 'components/RenameBoard.vue'
import RemoveBoard from 'components/RemoveBoard.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'SelectBoard',
  components: {
    's-card': SCard,
    'rename-board': RenameBoard,
    'remove-board': RemoveBoard
  },
  data () {
    return {
      renameDialog: false,
      removeDialog: false
    }
  },
  computed: {
    ...mapState({
      boards: 'boards'
    }),
    ...mapGetters({
      _selectedBoard: 'boards/selectedBoard',
      collection: 'boards/getSortedCollectionByName'
    }),
    selectedBoard: {
      get () {
        return this._selectedBoard || ''
      },
      set (board) {
        this.$store.commit('boards/select', board)
      }
    }
  },
  methods: {
    openRenameDialog: function (event) {
      this.renameDialog = true
    },
    closeRenameDialog: function (event) {
      this.renameDialog = false
    },
    openRemoveDialog: function (event) {
      this.removeDialog = true
    },
    closeRemoveDialog: function (event) {
      this.removeDialog = false
    }
  }
}
</script>
