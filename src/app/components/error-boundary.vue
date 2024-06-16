<script>

export default {
  name: 'error-boundary',
  props: {
    error: null
  }
};

</script>

<template lang="pug">
  div(v-if="error && error.retryAttempt > 2")
    .full-screen
      .center
        .app-error
          svg(width="64px" height="64px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg")
            g(stroke-width="0")
            g(stroke-linecap="round" stroke-linejoin="round")
            g
              path(d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#d50f3b" stroke-width="0.768" stroke-linecap="round" stroke-linejoin="round")
          b Чат временно не доступен
          span.small Мы уже все исправляем. Обновите страницу или попробуйте позже
  div(v-else)
    slot
</template>
