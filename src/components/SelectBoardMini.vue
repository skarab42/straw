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
  <q-select
  dark
  filled
  color="white"
  bg-color="primary"
  style="max-width: 300px"
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
      <q-btn round dense flat icon="clear" @click.stop="unselect" />
    </template>
  </q-select>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'SelectBoardMini',
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
    unselect: function (event) {
      this.$store.commit('boards/unselect', this.selectedBoard)
    }
  }
}
</script>
