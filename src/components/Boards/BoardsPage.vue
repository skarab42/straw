<template>
  <page-container>
    <v-layout row wrap>
      <v-flex md4 xs12>
        <boards-finder />
      </v-flex>
      <v-flex md8 xs12>
        <boards-collection />
      </v-flex>
    </v-layout>
  </page-container>
</template>

<script>
import BoardsFinder from './BoardsFinder'
import BoardsCollection from './BoardsCollection'

export default {
  name: 'boards-page',

  components: {
    BoardsFinder,
    BoardsCollection
  }
}
</script>
