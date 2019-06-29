<template>
  <div class="q-slide-item q-item-type overflow-hidden">
    <div
      v-if="$slots.left"
      class="q-slide-item__left absolute-full row no-wrap items-center justify-start"
      :style="leftStyle"
      ref="left"
    >
      <div ref="leftContent">
        <slot name="left"></slot>
      </div>
    </div>
    <div
      v-if="$slots.right"
      class="q-slide-item__right absolute-full row no-wrap items-center justify-end"
      :style="rightStyle"
      ref="right"
    >
      <div ref="rightContent">
        <slot name="right"></slot>
      </div>
    </div>
    <div
      ref="content"
      class="q-slide-item__content"
      v-touch-pan.horizontal.prevent.mouse.stop="handlePan"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { colors } from 'quasar'
const { lighten } = colors
export default {
  name: 'SSlideItem',
  props: {
    leftColor: String,
    rightColor: String
  },
  data () {
    return {
      timer: null,
      leftOriginalColor: null,
      rightOriginalColor: null,
      leftBackgroundColor: null,
      rightBackgroundColor: null
    }
  },
  mounted () {
    this.leftOriginalColor = this.leftColor || '#4caf50'
    this.rightOriginalColor = this.rightColor || '#f44336'
    this.leftBackgroundColor = this.leftOriginalColor
    this.rightBackgroundColor = this.rightOriginalColor
  },
  computed: {
    leftStyle () {
      return this.leftBackgroundColor ? `background-color: ${this.leftBackgroundColor}` : ''
    },
    rightStyle () {
      return this.rightBackgroundColor ? `background-color: ${this.rightBackgroundColor}` : ''
    }
  },
  methods: {
    reset () {
      this.$refs.content.style.transform = `translate3d(0,0,0)`
    },

    handlePan (evt) {
      const node = this.$refs.content
      const dir = evt.direction === 'left' ? -1 : 1
      const dist = evt.distance.x

      if (
        (!this.$slots.left && dir === 1) ||
        (!this.$slots.right && dir === -1)) {
        return
      }

      let done = dist > node.getBoundingClientRect().width / 2

      this.leftBackgroundColor = done ? this.leftOriginalColor : lighten(this.leftOriginalColor, 30)
      this.rightBackgroundColor = done ? this.rightOriginalColor : lighten(this.rightOriginalColor, 30)

      if (evt.isFirst) {
        node.classList.add('no-transition')
      } else if (evt.isFinal) {
        node.classList.remove('no-transition')
        if (done) {
          node.style.transform = `translate3d(${dir * 100}%,0,0)`
          this.timer = setTimeout(() => {
            this.$emit(evt.direction, { reset: this.reset })
            this.$emit('action', { side: evt.direction, reset: this.reset })
          }, 230)
        } else {
          node.style.transform = `translate3d(0,0,0)`
        }
        return
      }

      if (dir === 1) {
        this.$refs.left && (this.$refs.left.style.visibility = 'visible')
        this.$refs.right && (this.$refs.right.style.visibility = 'hidden')
      } else {
        this.$refs.left && (this.$refs.left.style.visibility = 'hidden')
        this.$refs.right && (this.$refs.right.style.visibility = 'visible')
      }

      node.style.transform = `translate3d(${dist * dir}px,0,0)`
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
