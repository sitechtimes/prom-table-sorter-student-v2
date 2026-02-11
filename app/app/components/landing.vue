<template>
  <div class="">
    <h1 class="text-9xl font-semibold p-4 max-md:hidden">PROM TABLE SORTER</h1>
    <div
      class="flex flex-col md:flex-row items-center h-7/8 sm:h-3/4 max-w-7xl mx-auto px-6 pt-6 space-y-4"
    >
      <div
        class="card bg-base-100 shadow-sm w-72"
      >
        <figure class="h-1/3 flex items-center justify-center">
          <img src="/student-card-svgrepo-com.svg" class="h-24 md:h-1/2" />
        </figure>
        <div class="card-body">
          <h2 class="card-title font-bold sm:text-2xl">Submit Your Group</h2>
          <p>Students, go here to make your prom groups.</p>
          <div
            class="card-actions justify-end underline font-semibold sm:text-xl"
          >
            <NuxtLink to="/studentForm">Go To</NuxtLink>
          </div>
        </div>
      </div>
      <div
        class="card bg-base-100 shadow-sm w-72"
      >
        <figure class="h-1/3 flex items-center justify-center">
          <img src="/admin-svgrepo-com.svg" class="h-24 md:h-1/2" />
        </figure>

        <div class="card-body">
          <h2 class="card-title font-bold sm:text-2xl">Admin View</h2>
          <p>Administrator, click here to go to the admin log in page.</p>
          <div
            class="card-actions justify-end underline font-semibold sm:text-xl"
          >
            <NuxtLink to="/adminLogin">Go To</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
