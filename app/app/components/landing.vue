<template>
  <div class="h-screen">
    <div
      class="grid grid-cols-1 md:grid-cols-3 space-y-2 place-items-center h-7/8 md:h-3/4"
    >
      <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
         <figure class="h-5/8">
             <img src="/flow-chart-svgrepo-com.svg" class="h-1/2 hidden md:block"/>
          </figure>
        <div class="card-body">
          <h2 class="card-title font-bold md:text-2xl">Visualizer</h2>
          <p>To be added.</p>
          <div
            class="card-actions justify-end underline font-semibold md:text-xl"
          >
            <NuxtLink to="/visualizer">Go To</NuxtLink>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
        <figure class="h-5/8">
               <img src="/student-card-svgrepo-com.svg" class="h-1/2 hidden md:block"/>
          </figure>
        <div class="card-body">
          <h2 class="card-title font-bold md:text-2xl">Submit Your Group</h2>
          <p>Students, go here to make your prom groups.</p>
          <div
            class="card-actions justify-end underline font-semibold md:text-xl"
          >
            <NuxtLink to="/groups">Go To</NuxtLink>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 w-7/8 h-11/12 shadow-sm">
        <figure class="h-5/8">
             <img src="/admin-svgrepo-com.svg" class="h-1/2 hidden md:block"/>
          </figure>
        <div class="card-body">
          <h2 class="card-title font-bold md:text-2xl">Admin View</h2>
          <p>Administrator, click here to go to the admin log in page.</p>
          <div
            class="card-actions justify-end underline font-semibold md:text-xl"
          >
            <NuxtLink to="/adminLogin">Go To</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
