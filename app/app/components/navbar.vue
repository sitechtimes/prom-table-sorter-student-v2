<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <!-- 1. Added @click="closeDropdown" here -->
        <ul
          tabindex="0"
          @click="closeDropdown"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/student/form">Make Groups</NuxtLink></li>
          <li><NuxtLink to="/student/edit">Edit Groups</NuxtLink></li>
          <li><NuxtLink to="/admin/login">Admin Login</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <NuxtLink to="/" class="btn btn-ghost text-xl"
        >SITHS Prom Table Sorter</NuxtLink
      >
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle opacity-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
// Function to remove focus and close the menu
const closeDropdown = () => {
  if (process.client && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}
</script>