<style lang="scss" scoped>
.error {
  color: #d92426;
  font-size: 80%;
}

input[type="text"] {
  height: 42px;
  border: 1px solid #d8d8d8;
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
  margin: 16px 0 5px 0;
  display: inline-block;

  &:disabled {
        background-color: gray;
        color: white;
    }
}
.close-button{
  position: absolute;
  top: 16px;
  font-size: 1.8rem;
  cursor: pointer;
  right: 16px;
}
.loader {
  margin-top: 4px;
}

.client-consent{
  font-size: 12px;
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-custom{
  margin-right: 5px;
}
</style>

<template lang="pug">
.full-screen
  div.close-button(href="#" @click.prevent="onCloseClicked()" title="Закрыть")
      svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
        path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")
  .center(v-if="checking")
      p.text Подключение
        scale-loader(color="#ee5c13")

  .center(v-else="checking")
    div
        p.text
            strong {{ this.greetings?.GreetingBold  ? this.greetings.GreetingBold : "Представьтесь, пожалуйста,"  }}
            br
            span {{ this.greetings?.Greeting ? this.greetings.Greeting : "желательно указать" }}
            br
            span {{ !this.greetings?.Greeting ? "фамилию и имя:" : "" }}
        input(type="text" placeholder="Ваше имя" ref="name" :disabled="creating" @keydown.enter="create" v-model="clientName")
        div.client-consent
            input(type="checkbox" v-model="personalDataConsent").checkbox-custom
            span Согласие на обработку
                a(style="text-decoration:underline" :href="processDataLink" target="_blank") &nbsp;персональных данных
    button.button(v-if="!creating" :disabled="!personalDataConsent || !clientName || clientName === ''" @click.prevent="create" href="#") Начать чат
    a.button(v-if="creating" @click.prevent="" href="#")
        scale-loader.loader(v-if="creating" color="#ffffff" height="24px")

    p.error &nbsp;{{ error }}
</template>

<script>
import client from "../client";

export default {
  props: {
    channel: String,
    greetings: Object,
    requireName: true
  },

  data() {
    return {
        clientName: null,
        personalDataConsent: false, 
        processDataLink: null,
        checking: true,
        creating: null,
        error: null
    };
  },

  mounted() {
    client.getInfoLinkByChannel(this.channel).then((link) => {
        this.processDataLink = link.Data
    })
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

      this.creating = client
        .anonymousSignup(this.clientName, this.channel)
        .then(client => {
          this.$emit("on-client-created", client);
        })
        .catch(error => {
          this.creating = null;
          this.error = error.text;
        });
    },
    onCloseClicked () {
      this.$emit("on-close-clicked");
    },


    onEnterPressed(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.create();
      }
    },
  },
};
</script>
