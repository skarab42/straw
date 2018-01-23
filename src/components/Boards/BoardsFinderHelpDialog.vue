<template>
  <page-dialog :open="open" @close="close">
    <page-card>
      <page-card-toolbar :icon="icon" :title="title" color="info">
        <v-spacer />
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </page-card-toolbar>
      <v-card-text>
        <v-data-table :items="allowedInputs" hide-headers hide-actions>
          <template slot="items" slot-scope="props">
            <th class="text-xs-left">{{ props.item.name }}</th>
            <td><code>{{ props.item.example }}</code></td>
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
  name: 'boards-finder-help-dialog',

  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      icon: 'help',
      title: 'Allowed inputs',
      allowedInputs: [
        { name: 'Wildcard', example: '192.168.1.*' },
        { name: 'Single IP', example: '192.168.1.100' },
        { name: 'IP Range', example: '192.168.1.100-120' },
        { name: 'Hostname', example: 'my.smoothie.board' },
        { name: 'Mixed inputs', example: '192.168.1.100, my.smoothie.board' }
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
