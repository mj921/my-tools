<template>
  <svg viewBox="0 0 128 128">
    <g transform="translate(0, -48)">
      <path id="topLine" stroke="currentColor" d="M0,64T128,64Z" transform-origin="center">
        <animateTransform
          begin="menu.mouseover"
          dur="0.3"
          attributeName="transform"
          type="rotate"
          from="0"
          to="45"
          repeatCount="1"
          fill="freeze"
          @ended="console.log"
          @end="console.log"
        />
        <animateTransform
          begin="menu.mouseout"
          dur="0.3"
          attributeName="transform"
          type="rotate"
          from="45"
          to="0"
          repeatCount="1"
          fill="freeze"
        />
      </path>
      <animateTransform
        begin="menu.mouseover"
        additive="replace"
        dur="0.3"
        attributeName="transform"
        type="translate"
        from="0 -48"
        to="0 0"
        repeatCount="1"
        fill="freeze"
      />
      <animateTransform
        begin="menu.mouseout"
        additive="replace"
        dur="0.3"
        attributeName="transform"
        type="translate"
        from="0 0"
        to="0 -48"
        repeatCount="1"
        fill="freeze"
      />
    </g>
    <path stroke="currentColor" d="M0,64T128,64Z" transform-origin="center">
      <animate
        begin="menu.mouseover"
        attributeName="opacity"
        values="1;0"
        dur="0.3"
        fill="freeze"
      />
      <animate begin="menu.mouseout" attributeName="opacity" values="0;1" fill="freeze" dur="0.3" />
    </path>
    <g transform="translate(0, 48)">
      <path id="topLine" stroke="currentColor" d="M0,64T128,64Z" transform-origin="center">
        <animateTransform
          begin="menu.mouseover"
          additive="replace"
          dur="0.3"
          attributeName="transform"
          type="rotate"
          values="0;-45"
          repeatCount="1"
          fill="freeze"
        />
        <animateTransform
          begin="menu.mouseout"
          additive="replace"
          dur="0.3"
          attributeName="transform"
          type="rotate"
          values="-45;0"
          repeatCount="1"
          fill="freeze"
        />
      </path>
      <animateTransform
        begin="menu.mouseover"
        additive="replace"
        dur="0.3"
        attributeName="transform"
        type="translate"
        values="0 48;0 0"
        repeatCount="1"
        fill="freeze"
      />
      <animateTransform
        begin="menu.mouseout"
        additive="replace"
        dur="0.3"
        attributeName="transform"
        type="translate"
        values="0 0;0 48"
        repeatCount="1"
        fill="freeze"
      />
    </g>
    <rect id="menu" x="0" y="0" width="100%" height="100%" fill="transparent" opacity="0" />
  </svg>
</template>
<script lang="ts" setup></script>
<style scoped lang="scss"></style>
