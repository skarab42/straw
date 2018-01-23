<template>
  <v-list two-line>
    <v-container v-if="fileListLoading" fluid fill-height>
      <v-layout justify-center align-center column>
        <v-progress-circular :size="fullscreen ? 25 : 50" :width="fullscreen ? 3 : 5" color="primary" indeterminate />
        <p class="grey--text pt-2" :class="{ 'title': !fullscreen }">Loading...</p>
      </v-layout>
    </v-container>
    <slot v-else name="default" />
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'files-list-loading',

  computed: {
    ...mapGetters('app', ['fullscreen']),
    ...mapGetters('files', ['fileListLoading'])
  }
}
</script>
