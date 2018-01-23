<template>
  <v-list-tile-sub-title>
    <span v-if="isFile">{{ file.humanSize }}</span>
    <span v-if="isFile && file.hasError"> - </span>
    <span v-if="file.hasError" v-html="errors" class="error--text" />
  </v-list-tile-sub-title>
</template>

<script>
export default {
  name: 'files-info',

  props: {
    file: {
      type: Object,
      required: true
    }
  },

  computed: {
    isFile () {
      return !!this.$props.file.humanSize
    },

    errors () {
      let errors = []
      let file = this.file
      let invalidChars = file.invalidChars

      if (file.empty) {
        errors.push('Empty file.')
      }

      if (invalidChars) {
        errors.push(
          invalidChars.length +
          ' invalid char' + (invalidChars.length > 1 ? 's' : '') +
          ' : [' + invalidChars.join(', ') + '].'
        )
      }

      if (file.duplicate) {
        errors.push('File already in upload queue.')
      }

      if (file.uploadError) {
        errors.push(file.uploadError)
      }

      return errors.join(' + ')
    }
  }
}
</script>
