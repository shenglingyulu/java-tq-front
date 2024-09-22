<template>
  <div class="hello">
    <CodeEditor :value="codevalue" :handleChange="codehandleChange" />
    <MdEditor :value="mdvalue" :handleChange="mdhandleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "./MdEditor.vue";
import CodeEditor from "./CodeEditor.vue";
const codevalue = ref("");
const mdvalue = ref("");
const codehandleChange = (v: string) => {
  codevalue.value = v;
};
const mdhandleChange = (v: string) => {
  mdvalue.value = v;
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
