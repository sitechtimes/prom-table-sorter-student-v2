<template>
  <div>
    <label
      :class="'text-' + color + ' text-xl font-bold text-center mb-6'"
      for="category"
      >{{ category }}:</label
    >
    <input
      :type="type"
      v-model="vModel"
      :placeholder="placeholder"
      class="input input-bordered w-full mb-4"
      required
    />
  </div>
</template>
<script setup lang="ts">
const vModel = defineModel<string>();
const props = defineProps<{
  category: string;
  type: string;
  color: string;
  placeholder: string;
}>();
</script>
