<template>
  <div>
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
  type: string;
  placeholder: string;
}>();
</script>
