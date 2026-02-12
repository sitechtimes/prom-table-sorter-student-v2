<template>
  <div class="">
    <h1 class="text-9xl font-semibold m-4 max-md:hidden md:max-w-11/12 xl:max-w-3/5 text-shadow-lg text-base-300">SITHS Prom Table Sorter</h1>
    <div
      class="flex flex-col items-center h-7/8 sm:h-3/4 max-w-9xl px-6 pt-6 space-y-4"
    >
      <div
        class="card bg-base-100 shadow-sm w-full"
      >
        <figure class="h-1/3 flex items-center place-self-center">
          <img src="/student-card-svgrepo-com.svg" class="h-24 md:h-1/2 md:hidden" />
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
        class="card bg-base-100 shadow-sm w-full"
      >
        <figure class="h-1/3 flex items-center place-self-center">
          <img src="/admin-svgrepo-com.svg" class="h-24 md:h-1/2 md:hidden" />
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
