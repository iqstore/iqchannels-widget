<style lang="sass" scoped>
.rating {}

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
    box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.2);
    z-index: 5;
    background: white;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    margin: auto 40px;
    display: flex;
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
        padding: 20px 0;
        padding-top: 10px;
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
</style>

<template lang="pug">

.rating
    .rated(v-if="rating.State === 'rated'")
        span Оценка оператора: {{ rating.Value }} из 5

    .backdrop(v-if="rating.State === 'pending'")
    .pending(v-if="rating.State === 'pending'")
        .title Пожалуйста, оцените качество консультации
        .stars(@mouseout="onMouseOut()")
            .star(v-for="n in 5",
                :class="{'star-selected': n <= rating.Value}",
                @mouseover="onMouseOver(n)",
                @click.prevent="setRating(n)")
                svg.star-background(aria-hidden="true" focusable="false"
                    class="svg-inline--fa fa-star fa-w-18" role="img"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
                    path(fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z")

                svg.star-outline(aria-hidden="true" focusable="false"
                    class="svg-inline--fa fa-star fa-w-18" role="img"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
                    path(fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z")
        .buttons
            .ignore(@click="ignoreRating")
                | Отмена
            .submit(@click="sendRating", :class="{'disabled': !value}")
                | Отправить

</template>

<script>
export default {
  props: {
    rating: Object
  },

  data: function() {
    return {
      value: null,
      comment: null
    };
  },

  methods: {
    setRating(value) {
      this.rating.Value = value;
      this.value = value;
    },

    sendRating() {
      this.rating.Comment = '';
      this.$emit("rate-rating", this.rating);

      console.log("SEND", this.rating);
    },

    ignoreRating() {
      this.rating.Value = 0;
      this.$emit("ignore-rating", this.rating);
    },

    onMouseOver(value) {
      this.rating.Value = value;
    },

    onMouseOut() {
      this.rating.Value = this.value;
    },

    onEnterPressed(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.sendRating();
      }
    }
  }
};
</script>
