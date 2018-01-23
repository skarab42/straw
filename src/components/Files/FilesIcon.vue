<template>
  <v-icon v-text="icon.name" :color="icon.textColor" :class="icon.backgroundColor" />
</template>

<script>
export default {
  name: 'files-icon',

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

    icon () {
      let name = 'folder'
      let textColor = 'white'
      let backgroundColor = 'grey lighten-1'

      if (!this.isFile) {
        return { name, textColor, backgroundColor }
      }

      name = 'insert_drive_file'
      let filename = this.$props.file.name
      let extension = this.$props.file.extension

      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        name = 'archive'
        backgroundColor = 'green'
      } else if (['txt', 'ini', 'cfg'].includes(extension)) {
        name = 'format_align_left'
        backgroundColor = 'blue'
      } else if (extension === 'pdf') {
        name = 'picture_as_pdf'
        backgroundColor = 'red'
      } else if (['gcode', 'gc', 'nc'].includes(extension)) {
        name = 'code'
        backgroundColor = 'primary'
      } else if (['cur', 'old', 'backup'].includes(extension)) {
        name = 'backup'
        backgroundColor = 'teal'
      } else if (['config', 'config.txt'].includes(filename)) {
        name = 'settings'
        backgroundColor = 'amber'
      } else if (['exe', 'bin', 'dmg', 'deb'].includes(extension)) {
        name = 'apps'
        backgroundColor = 'blue-grey'
      } else if (['stl', 'obj', 'scad'].includes(extension)) {
        name = 'language'
        backgroundColor = 'deep-orange'
      } else if (['jpg', 'jpeg', 'gif', 'png', 'svg', 'ico'].includes(extension)) {
        name = 'image'
        backgroundColor = 'cyan'
      }

      return { name, textColor, backgroundColor }
    }
  }
}
</script>
