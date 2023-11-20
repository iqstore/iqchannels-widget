<style lang="sass" scoped>
.rating {}

.rated {
  padding: 3px;
  margin: 10px 10px 20px;

  font-size: 13px;
  font-weight:bold;
  font-style:italic;
  text-align:center;

}

.pending {
  border-radius: 15px;
  box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
  z-index: 5;
  background:white;
  position:fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  margin:auto 40px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  height:fit-content;

  .title {
    color:black;
    padding: 20px 20px 5px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align:center; }

    .stars {
      text-align:center;
      padding: 20px 0;
      padding-top: 10px;

  }

    .star {
      display:inline-block;
      height: 34px;
      width: 1.8rem;
      line-height: 32px;
      position:relative;
      vertical-align:middle;
      margin: 0 5px;

      svg {
        width: 28px;
        height: 34px;

    }

      .star-background, .star-outline {
        left: 0;
        position:absolute;
        text-align:center;
        width: 100%;

    }

      .star-background {
        color: #ffffff;

    }

      .star-outline {
        color: #2EB8FE;

    }

      &:hover {
        cursor:pointer;

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
        box-sizing:border-box;
        margin: 0;
        padding: 3px;
        font-size: 14px;

    }

  }

    .buttons {
      text-align:center;
      border-top: 1px solid #C8C7CC;
      display:flex;
      justify-content:space-between;

      div {
        color: #2EB8FE;
        width: 100%;

        font-weight: 400;
        font-size: 1rem;
        text-align:center;
        text-decoration:none;
        padding: 15px;

        border:none;
        background:none;

        &:hover {
          cursor:pointer;
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
          cursor:pointer;
          color: #2EB8FE; }

    }

  }

}

.backdrop {
  background:black;
  position:fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  opacity: 0.3;

}

.disabled {
  opacity: 0.4;
  pointer-events:none;

}

.check-label {
  padding-left: 10px;
}

.box-check {
  margin: 5px 15px;
  display: flex;
  align-items: center;
}
.mt {
  margin-top: 20px;
}

.poll_text {
  width: 85%;
  border: 1px solid #C8C7CC;
  resize: none;
  padding: 10px;
  outline: none;
  border-radius: 10px;
}
.input {
  display: flex;
  justify-content: center;
  width: 100%;
}

.color-thanks {
  color: #2D98F4 !important;
  font-size: 18px !important;
  margin-top: 5px !important;
}

.thanks-feedback {
  margin: 25px 0;
  text-align: center;
}

.buttons-fcr, .buttons-one-of-list {
  display: flex;
  margin: 10px;
  justify-content: center;
}

.buttons-one-of-list {
  flex-flow: column;
  .button {
    width: inherit;
  }
}

.button {
  padding: 10px 15px;
  background-color: #cccccc;
  color: #000;
  margin: 5px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  width: 100%;
  cursor: pointer;
  transition: 0.5s ease;

  &:hover {
    background-color: #dadada;
  }
}

</style>

<template lang="pug">

    .rating
        .rated(v-if="rating.State === 'rated' && rating.Value")
            span Оценка оператора: {{ rating.Value }} из 5

        .backdrop(v-if="(rating.State === 'poll' || thanksFeedback) && this.poll")
        .backdrop(v-if="(rating.State === 'pending')")
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

        .pending(v-if="rating.State === 'poll' && !start && this.poll")
            .title.mt Желаете пройти опрос?
            .buttons.mt
                .ignore(@click="finishRating")
                    | Нет
                .submit(@click="startPoll")
                    | Да

        .pending(v-if="start")
            .title.mt {{ poll.Questions[index].Text }}
            .stars(@mouseout="onMouseOutPoll()", v-if="poll.Questions[index].Type === 'stars'")
                .star(v-for="n in 5",
                    :class="{'star-selected': n <= pollResult.AnswerStars}",
                    @mouseover="onMouseOverPoll(n)",
                    @click.prevent="setPollStars(n)")
                    svg.star-background(aria-hidden="true" focusable="false"
                        class="svg-inline--fa fa-star fa-w-18" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
                        path(fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z")

                    svg.star-outline(aria-hidden="true" focusable="false"
                        class="svg-inline--fa fa-star fa-w-18" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512")
                        path(fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z")
            .one_of_list.mt(v-if="poll.Questions[index].Type === 'one_of_list'")
                .buttons-one-of-list.mt(v-for="(answer, i) in poll.Questions[index].Answers",
                    @click.prevent="setPollVariant(answer)"
                )
                    .button(@click.prevent="setPollVariant(answer)")
                      | {{ poll.Questions[index].Answers[0].Text }}
            .fcr.mt(v-if="poll.Questions[index].Type === 'fcr'")
              .buttons-fcr.mt
                .button(@click.prevent="setPollVariantFCR(poll.Questions[index].Answers[0])")
                    | {{ poll.Questions[index].Answers[0].Text }}
                .button(@click.prevent="setPollVariantFCR(poll.Questions[index].Answers[1])")
                    | {{ poll.Questions[index].Answers[1].Text }}

            .input(v-if="poll.Questions[index].Type === 'input'")
                textarea.poll_text.mt(type="text", v-model="inputText", @change="changeText($event)", placeholder="Ваш ответ", maxlength="4000", rows="5")
            .buttons.mt(v-if="poll.Questions[index].Type !== 'fcr' && poll.Questions[index].Type !== 'one_of_list'")
                .submit(@click="sendRatingPoll")
                    | Отправить ответ

        .pending(v-if="thanksFeedback")
            .thanks-feedback
                svg(xmlns="http://www.w3.org/2000/svg" height="3em" fill="#2D98F4" viewBox="0 0 512 512")
                    path(d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z")
                .title.color-thanks {{ thanksFeedbackText }}


</template>

<script>
import client from "../../client";

export default {
    props: {
        rating: Object,
        client: Object,
        channel: String,
        ticket: Object,
    },

    mounted() {
      this.poll = this.rating.RatingPoll;
      if (this.poll && this.rating.State === 'poll') {
        this.start = !this.poll.ShowOffer;
      }
    },

    data: function () {
        return {
            value: null,
            comment: null,
            poll: null,
            pollResult: Object,
            index: 0,
            start: false,
            inputText: "",
            thanksFeedback: false,
            thanksFeedbackText: "",
        };
    },

    methods: {

        startPoll() {
            this.start = true;
        },

        setPollStars(value) {
            this.setRating(value);
            this.pollResult = {
                Type: "stars",
                AnswerStars: value,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
        },

        changeText($event) {
            this.pollResult = {
                Type: "input",
                AnswerInput: $event.target.value,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
        },

        setPollVariant(answer) {
            this.pollResult = {
                Type: "one_of_list",
                RatingPollAnswerId: answer.Id,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            console.log(this.pollResult);
            this.sendRatingPoll();
        },

        setPollVariantFCR(answer) {
          this.pollResult = {
            Type: "fcr",
            RatingPollAnswerId: answer.Id,
            RatingPollQuestionId: this.poll.Questions[this.index].Id,
            FCR: answer.FCR,
            RatingId: this.rating.Id,
            ClientId: this.client.Id,
            ProjectId: this.client.ProjectId,
          };
          this.sendRatingPoll();
        },

        sendRatingPoll() {
            if (this.index === this.poll.Questions.length - 1) {
                if (this.poll.Questions[this.index].AsTicketRating) {
                    this.sendRating();
                    this.finishPoll();
                    return;
                }
                client.sendPoll(this.pollResult);
                this.finishPoll();
            } else {
                if (this.poll.Questions[this.index].AsTicketRating) {
                    this.sendRating();
                    this.index++;
                    return;
                }
                client.sendPoll(this.pollResult);
                this.index++;
            }
        },

        setRating(value) {
            this.rating.Value = value;
            this.value = value;
        },

        finishPoll() {
            client.finishPoll(this.rating.Id, this.poll.Id, true).then(res => {
                if (res.OK) {
                    this.rating.State = "finished";
                    if (this.poll.FeedbackThanks) {
                        this.thanksFeedback = true;
                        this.thanksFeedbackText = this.poll.FeedbackThanksText;
                    }
                    this.start = false;
                    if (this.poll.FeedbackThanks) {
                        const bye = setTimeout(() => {
                            this.thanksFeedback = false;
                            clearTimeout(bye);
                        }, 1000)
                    }
                }
            });
        },

        sendRating() {
            this.rating.Comment = '';
            this.$emit("rate-rating", this.rating);
        },

        finishRating() {
            client.finishPoll(this.rating.Id, this.poll.Id, false).then(res => {
                if (res.OK) {
                    this.rating.State = "finished";
                }
            });
        },

        ignoreRating() {
            this.rating.Value = 0;
            this.$emit("ignore-rating", this.rating);
        },

        onMouseOver(value) {
            this.rating.Value = value;
        },

        onMouseOverPoll(value) {
            this.pollResult.AnswerStars = value;
        },

        onMouseOut() {
            this.rating.Value = this.value;
        },

        onMouseOutPoll() {
            this.pollResult.AnswerStars = this.value;
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
