<template>
  <page-dialog v-if="$props.board" :open="open" @close="close">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" color="info">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <v-data-table slot="content" :items="version" hide-headers hide-actions>
          <template slot="items" slot-scope="props">
            <th class="text-xs-left">{{ props.item.key }}</th>
            <td><code>{{ props.item.value }}</code></td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" flat @click="close">close</v-btn>
      </v-card-actions>
    </page-card>
  </page-dialog>
</template>

<script>
export default {
  name: 'boards-info-dialog',

  data () {
    return {
      icon: 'help'
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
      return 'Info : ' + this.$props.board.name
    },

    version () {
      var version = Object.entries(this.$props.board.version).map(entry => {
        return { key: entry[0], value: entry[1] }
      })

      return [
        { key: 'name', value: this.$props.board.name },
        { key: 'address', value: this.$props.board.address },
        { key: 'selected', value: this.$props.board.selected },
        ...version
      ]
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
