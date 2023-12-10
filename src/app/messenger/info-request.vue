<style lang="scss" scoped>
.request {}

.rated {
  padding: 3px;
  margin: 10px 10px 20px;

  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  text-align: center;
}

.pending {
  border-radius: 15px;
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  z-index: 5;
  background: white;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  margin: auto 40px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
  height: fit-content;

  .title {
    color: black;
    padding: 20px 20px 5px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
  }

    .stars {
      text-align: center;
      padding: 10px 0 20px;
    }

    .star {
      display: inline-block;
      height: 34px;
      width: 1.8rem;
      line-height: 32px;
      position: relative;
      vertical-align: middle;
      margin: 0 5px;

      svg {
        width: 28px;
        height: 34px;
    }

      .star-background, .star-outline {
        left: 0;
        position: absolute;
        text-align: center;
        width: 100%;
    }
      .star-background {
        color: #ffffff;
    }
      .star-outline {
        color: #2EB8FE;
    }

      &:hover {
        cursor: pointer;
    }

      &:hover, &.star-selected {
        .star-background {
          color: #2EB8FE;
      }
        .star-outline {
          color: #2EB8FE;
      }
    }
  }

    .text {
      margin: 10px 5px 0;

      textarea {
        border: 1px solid #f1f1f1;
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 3px;
        font-size: 14px;
    }
  }

    .buttons {
      text-align: center;
      border-top: 1px solid #C8C7CC;
      display: flex;
      justify-content: space-between;

      div {
        color: #2EB8FE;
        width: 100%;

        font-weight: 400;
        font-size: 1rem;
        text-align: center;
        text-decoration: none;
        padding: 15px;

        border: none;
        background: none;

        &:hover {
          cursor: pointer;
          color: #2EB8FE;
      }

        &:disabled {
          color: #2EB8FE;
      }
    }

      .ignore {
        color: #2EB8FE;
        border-right: 1px solid #C8C7CC;

        &:hover {
          cursor: pointer;
          color: #2EB8FE;
        }
    }
  }
}

.backdrop {
  background: black;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  opacity: 0.3;
}

.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.label-custom{
    margin-left: 10px;
  }

.input-custom{
  width: 80%;
  color: gray;
  height: 25px;
  background-color: #FFFFFF;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  margin: 5px 2px 10px 2px;
  padding: .375rem 3rem .375rem .75rem;

  &:focus{
    outline: none;
}
}

.client-consent{
  font-size: 12px;
  margin: 15px;
  display: flex;
  align-items: center;
}

.checkbox-custom{
  margin-right: 5px;
}


.data-error{
  text-align: center;
  color: red;
  margin: 10px;
}
</style>

<template lang="pug">

.request

  .backdrop(v-if="request.State === 'pending'")
  .pending(v-if="request.State === 'pending'")
    .title Пожалуйста, укажите Ваши данные
    .data-error(v-if="dataError") {{ dataError }}
    .div(style="margin-top:10px")
        label(for="firstname").label-custom Введите имя:
        input.input-custom(name="firstname" id="firstname" v-model="request.FirstName" )

        label(for="surname").label-custom Введите фамилию
        input.input-custom(name="surname" id="surname" v-model="request.SurName")

        label(for="phone").label-custom Введите телефон:
      input(name="phone", id="phone", type="tel", v-model="request.Phone", pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}").input-custom

      label(for="email").label-custom Введите email:
      input(name="email", id="email", type="email", v-model="request.Email" ).input-custom

      div.client-consent
        input(type="checkbox" v-model="request.ClientConsent" ).checkbox-custom
        span Согласие на обработку
          a(style="text-decoration:underline" :href="request.ProcessingDataLink" target="_blank") &nbsp;персональных данных
    .buttons
      .ignore(@click="ignoreInfo") Отмена
      .submit(@click="sendInfo", :class="{'disabled': !request.FirstName || !request.ClientConsent}") Отправить

</template>

<script>
export default {
  props: {
    request: Object
  },

  data: function() {
    return {
      value: null,
      comment: null,
      dataError: null,
    };
  },

  methods: {

    sendInfo() {
      if (this.dataError) {
        this.dataError = null;
      }
      let phone = this.request.Phone;
      if (!phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
        this.dataError = "Неправильно введён телефон";
        return;
      }
      const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!this.request.Email.match(re)){
        this.dataError = "Неправильно введён email";
        return;
      }
      this.$emit("send-info", this.request)
      this.request.State = 'finished';
    },

    ignoreInfo() {
      this.request.State = 'ignored';
      this.$emit("ignore-info", this.request);
    },

    onEnterPressed(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.sendInfo();
      }
    }
  }
};
</script>
