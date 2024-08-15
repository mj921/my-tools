<template>
  <component :is="props.tag" :class="className">
    <slot></slot>
  </component>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjColProps } from './interface';

const props = withDefaults(defineProps<MjColProps>(), {
  tag: 'div',
  span: 24,
});

const className = computed(() => {
  const arr = ['mj-col', `mj-col-${props.span}`];
  if (props.xs) {
    arr.push(`mj-col-xs-${props.xs}`);
  }
  if (props.sm) {
    arr.push(`mj-col-sm-${props.sm}`);
  }
  if (props.md) {
    arr.push(`mj-col-md-${props.md}`);
  }
  if (props.lg) {
    arr.push(`mj-col-lg-${props.lg}`);
  }
  if (props.xl) {
    arr.push(`mj-col-xl-${props.xl}`);
  }
  return arr;
});
</script>
<style scoped lang="scss">
@use 'sass:math';
@for $span from 1 through 24 {
  .mj-col-#{$span} {
    width: math.div(100%, 24) * $span;
    flex: 0 0 math.div(100%, 24) * $span;
  }
}

@media only screen and (max-width: 767px) {
  @for $span from 1 through 24 {
    .mj-col-xs-#{$span} {
      width: math.div(100%, 24) * $span;
      flex: 0 0 math.div(100%, 24) * $span;
    }
  }
}
@media only screen and (min-width: 768px) {
  @for $span from 1 through 24 {
    .mj-col-sm-#{$span} {
      width: math.div(100%, 24) * $span;
      flex: 0 0 math.div(100%, 24) * $span;
    }
  }
}
@media only screen and (min-width: 992px) {
  @for $span from 1 through 24 {
    .mj-col-md-#{$span} {
      width: math.div(100%, 24) * $span;
      flex: 0 0 math.div(100%, 24) * $span;
    }
  }
}
@media only screen and (min-width: 1200px) {
  @for $span from 1 through 24 {
    .mj-col-lg-#{$span} {
      width: math.div(100%, 24) * $span;
      flex: 0 0 math.div(100%, 24) * $span;
    }
  }
}
@media only screen and (min-width: 1920px) {
  @for $span from 1 through 24 {
    .mj-col-xl-#{$span} {
      width: math.div(100%, 24) * $span;
      flex: 0 0 math.div(100%, 24) * $span;
    }
  }
}
</style>
