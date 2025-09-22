<template>
    <div class="bg-base-200 h-dvh">
    <h1 class="text-center bg-base-100 p-4 font-semibold">Prom Table Sorter</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 space-y-2 place-items-center h-7/8 md:h-3/4 mt-2">
        <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
    <div class="card-body">
    <h2 class="card-title">Visualizer</h2>
    <p>To be added</p>
    <div class="card-actions justify-end underline font-semibold">
       <NuxtLink to="/visualizer">Go To</NuxtLink>
    </div>
  </div>
      </div>
      <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
    <div class="card-body">
    <h2 class="card-title">Submit Your Group</h2>
    <p>Students, go here to make your groups</p>
    <div class="card-actions justify-end underline font-semibold">
       <NuxtLink to="/groups">Go To</NuxtLink>
    </div>
  </div>
      </div>
      <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
    <div class="card-body">
    <h2 class="card-title">Admin View</h2>
    <p>Administrator, click here to go to the admin log in page. </p>
    <div class="card-actions justify-end underline font-semibold hover:opacity-50">
      <NuxtLink to="/login">Go To</NuxtLink>
    </div>
  </div>
      </div>
    </div>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>