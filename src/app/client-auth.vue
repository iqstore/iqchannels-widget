<template lang="pug">
.full-screen
    .center(v-if="authorizing")
        p Подключение
        //scale-loader(color="#ee5c13")
    .center(v-if="error")
        p
            strong Извините, произошла ошибка.
        p В настоящий момент, чат недоступен, попробуйте войти позже.
</template>

<script>
import client from "../client";

export default {
  props: {
    credentials: String,
    project: String,
    channel: String
  },

  data() {
    return {
      authorizing: null,
      error: null
    };
  },

  mounted() {
    let auth = client.authorize(this.credentials, this.channel);
    this.authorizing = auth
      .then(client => {
        this.$emit("on-client-authorized", client);
      })
      .catch(error => {
        this.error = error;
        this.authorizing = null;
      });
  }
};
</script>
