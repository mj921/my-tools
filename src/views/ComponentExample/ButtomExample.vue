<template>
  <div>
    <mj-button type="primary">primary</mj-button>
    <mj-button type="default">default</mj-button>
    <mj-button type="dashed">dashed</mj-button>
    <mj-button type="outline">outline</mj-button>
    <mj-button type="text">text</mj-button>
    <br />
    <mj-button type="primary" disabled>primary(disabled)</mj-button>
    <mj-button type="default" disabled>default(disabled)</mj-button>
    <mj-button type="dashed" disabled>dashed(disabled)</mj-button>
    <mj-button type="outline" disabled>outline(disabled)</mj-button>
    <mj-button type="text" disabled>text(disabled)</mj-button>
    <br />
    <mj-button status="success" type="primary">success</mj-button>
    <mj-button status="success" type="default">default</mj-button>
    <mj-button status="success" type="dashed">dashed</mj-button>
    <mj-button status="success" type="outline">outline</mj-button>
    <mj-button status="success" type="text">text</mj-button>
    <br />
    <mj-button status="success" type="primary" disabled>success(disabled)</mj-button>
    <mj-button status="success" type="default" disabled>default(disabled)</mj-button>
    <mj-button status="success" type="dashed" disabled>dashed(disabled)</mj-button>
    <mj-button status="success" type="outline" disabled>outline(disabled)</mj-button>
    <mj-button status="success" type="text" disabled>text(disabled)</mj-button>
    <br />
    <mj-button status="warning" type="primary">warning</mj-button>
    <mj-button status="warning" type="default">default</mj-button>
    <mj-button status="warning" type="dashed">dashed</mj-button>
    <mj-button status="warning" type="outline">outline</mj-button>
    <mj-button status="warning" type="text">text</mj-button>
    <br />
    <mj-button status="warning" type="primary" disabled>warning(disabled)</mj-button>
    <mj-button status="warning" type="default" disabled>default(disabled)</mj-button>
    <mj-button status="warning" type="dashed" disabled>dashed(disabled)</mj-button>
    <mj-button status="warning" type="outline" disabled>outline(disabled)</mj-button>
    <mj-button status="warning" type="text" disabled>text(disabled)</mj-button>
    <br />
    <mj-button status="danger" type="primary">danger</mj-button>
    <mj-button status="danger" type="default">default</mj-button>
    <mj-button status="danger" type="dashed">dashed</mj-button>
    <mj-button status="danger" type="outline">outline</mj-button>
    <mj-button status="danger" type="text">text</mj-button>
    <br />
    <mj-button status="danger" type="primary" disabled>danger(disabled)</mj-button>
    <mj-button status="danger" type="default" disabled>default(disabled)</mj-button>
    <mj-button status="danger" type="dashed" disabled>dashed(disabled)</mj-button>
    <mj-button status="danger" type="outline" disabled>outline(disabled)</mj-button>
    <mj-button status="danger" type="text" disabled>text(disabled)</mj-button>
    <br />
    <mj-button type="primary" size="mini">primary(mini)</mj-button>
    <mj-button type="primary" size="small">primary(small)</mj-button>
    <mj-button type="primary" size="medium">primary(medium)</mj-button>
    <mj-button type="primary" size="large">primary(large)</mj-button>
    <br />
    <mj-button type="primary">primary</mj-button>
    <mj-button type="primary" shape="round">primary(round)</mj-button>
    <mj-button type="primary" shape="circle">PC</mj-button>
    <br />
    <mj-button type="primary" long>longlonglong</mj-button>
    <br />
    <mj-button type="primary" loading>loading</mj-button>
    <mj-button type="primary">loading</mj-button>
  </div>
</template>
<script lang="ts" setup>
import MjButton from '@/components/MjButton/MjButton.vue';
</script>
<style scoped lang="scss">
.mj-btn {
  margin: 4px;
}
</style>
