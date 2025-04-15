<template>
  <div>
    <dl>人口： {{ country.people }}</dl>
    <dl>人口上限： {{ country.peopleMax }}</dl>
    <dl>国库： {{ country.money }}</dl>
    <dl>军团： {{ country.armyNum }}</dl>
    <dl>腐败度： {{ country.corruptPercent }}</dl>
  </div>
  <div>
    <dl>人口： {{ country1.people }}</dl>
    <dl>人口上限： {{ country1.peopleMax }}</dl>
    <dl>国库： {{ country1.money }}</dl>
    <dl>军团： {{ country1.armyNum }}</dl>
    <dl>腐败度： {{ country1.corruptPercent }}</dl>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Country from './country';

const country = ref(new Country());
const country1 = ref(new Country({ isWar: true }));
const loop = () => {
  country.value.update();
  country1.value.update();
  setTimeout(loop, 1000);
};
loop();
</script>
<style scoped lang="scss"></style>
