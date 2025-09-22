<template>
  <div>
    <input
      type="`{{props.type}}"
      v-model="props.vModel"
      placeholder="{{props.placeholder}}"
      class="input input-bordered w-full mb-4"
      required
    />
  </div>
</template>
<script setup lang="js">
const props = defineProps({
    type: string,
    vModel: string,
    placeholder: string
})
</script>
