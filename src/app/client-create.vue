<style lang="sass" scoped>
    .error {
        color: #d92426;
        font-size: 80%;
    }

    input[type="text"] {
        height: 32px;
        border: 1px solid #d8d8d8;
        border-radius: 3px;
        outline: none;
        padding-left: 8px;
        padding-right: 8px;
        width: 230px;
        margin: 0;
    }

    .button {
        height: 36px;
        line-height: 36px;
        text-decoration: none;
        border: none;
        border-radius: 3px;
        background-color: #ee5c13;
        color: white;
        width: 246px;
        margin: 20px 0 5px 0;
        display: inline-block;
    }

    .loader {
        margin-top: 4px;
    }
</style>

<template lang="pug">
    .full-screen

        .center(v-if="checking")
            p.text Подключение
                scale-loader(color="#ee5c13")

        .center(v-else="checking")
            div(v-if="requireName")
              p.text
                strong Представьтесь пожалуйста,
                br
                | желательно указать
                br
                | фамилию и имя:
              input(type="text" placeholder="Ваше имя" ref="name" v-bind:disabled="creating" @keydown.enter="create")
            a.button(v-if="!creating" @click.prevent="create" href="#") Начать чат
            a.button(v-if="creating" @click.prevent="" href="#")
                scale-loader.loader(v-if="creating" color="#ffffff" height="24px")

            p.error &nbsp;{{ error }}
</template>

<script>
import client from "../client";

export default {
  props: {
    channel: String,
    requireName: true
  },

  data() {
    return {
      checking: true,
      creating: null,
      error: null
    };
  },

  created() {
    client
      .anonymousAuth()
      .then(client => {
        this.$emit("on-client-created", client);
      })
      .catch(error => {
        this.checking = false;
      });
  },

  methods: {
    create() {
      this.error = null;
      var name = "";
      if (this.requireName) {
        name = this.$refs.name.value.trim();
        if (name.length < 1) {
          this.error = "Не менее 3-х букв, пожалуйста.";
          return;
        }
      }

      this.creating = client
        .anonymousSignup(name, this.channel)
        .then(client => {
          this.$emit("on-client-created", client);
        })
        .catch(error => {
          this.creating = null;
          this.error = error.text;
        });
    }
  }
};
</script>
