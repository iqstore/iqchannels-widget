<template lang="pug">
  .full-screen
    .center(v-if="authorizing")
      p Подключение
      scale-loader(color="#ee5c13")
    .center(v-if="error")
      p
        strong Извините, произошла ошибка.
      p {{ error ?? 'В настоящий момент, чат недоступен, попробуйте войти позже.' }}
</template>

<script>
import client from "../client";

export default {
  props: {
    credentials: String,
    project: String,
    channel: String,
    multiChatData: Array,
  },

  data() {
    return {
      authorizing: null,
      error: null
    };
  },

  mounted() {
    if (this.multiChatData) {
      if (this.multiChatData.map(e => e.credentials !== null).length !== this.multiChatData.length) {
        this.error = "Чат недоступен для неавторизованных клиентов.";
      }
      const resultData = {};
      let auth = Promise.all(this.multiChatData.reduce((acc, el) => {
        acc.push(client.authorize(el.credentials, el.channel).then(data => {
          resultData[el.channel] = data;
        }));
        return acc;
      }, []));
      this.authorizing = auth
          .then(result => {
            this.$emit("on-client-multiple-authorized", resultData);
          })
          .catch(error => {
                this.error = error;
                this.authorizing = null;
              }
          );
    } else {
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
  },
};
</script>
