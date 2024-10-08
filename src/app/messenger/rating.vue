<script>
import client from "../../client";

const DEFAULT_RATING_MAX_VALUE = 5;

export default {
    props: {
        rating: Object,
        client: Object,
        channel: String,
        ticket: Object,
    },

    mounted() {
        this.poll = this.rating.RatingPoll;
        if (this.poll) {
            this.pollResult = new Array(this.poll.Questions.length).fill({});
        }
        if (this.poll && this.rating.State === 'poll') {
            this.start = !this.poll.ShowOffer;
        }
    },

    data() {
        return {
            value: null,
            comment: null,
            poll: null,
            pollResult: [],
            index: 0,
            start: false,
            inputText: "",
            ratingComment: "",
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
            let temp = [...this.pollResult];
            temp[this.index] = {
                Type: "stars",
                AnswerStars: value,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            this.pollResult = temp;
        },

        changeText($event) {
            let temp = [...this.pollResult];
            temp[this.index] = {
                Type: "input",
                AnswerInput: $event.target.value,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            this.pollResult = temp;
        },

        setPollVariant(answer) {
            let temp = [...this.pollResult];
            temp[this.index] = {
                Type: "one_of_list",
                RatingPollAnswerId: answer.Id,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            this.pollResult = temp;
        },

        setPollVariantFCR(answer) {
            let temp = [...this.pollResult];
            temp[this.index] = {
                Type: "fcr",
                RatingPollAnswerId: answer.Id,
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                FCR: answer.FCR,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            this.pollResult = temp;
        },

        getScaleItems(scale) {
            const res = [];
            for (let i = scale.FromValue; i <= scale.ToValue; i++) {
                res.push(i);
            }
            return res;
        },

        getScaleStyle(scale) {
            const itemsCount = scale.ToValue - scale.FromValue + 1;
            const widthPercentage = 100 / itemsCount;

            return {
                gridTemplateColumns: `repeat(${itemsCount}, ${widthPercentage}%)`
            };
        },

        setPollVariantScale(value) {
            let temp = [...this.pollResult];
            temp[this.index] = {
                Type: "scale",
                RatingPollQuestionId: this.poll.Questions[this.index].Id,
                AnswerScale: value,
                RatingId: this.rating.Id,
                ClientId: this.client.Id,
                ProjectId: this.client.ProjectId,
            };
            this.pollResult = temp;
        },

        isRatingPollAnswerEmpty() {
            for (const arg of this.pollResult) {
                if (Object.keys(arg).length <= 1) {
                    return true;
                }
            }
            return false;
        },

        sendRatingPoll() {
            for (const arg of this.pollResult) {
                if (Object.keys(arg).length <= 1) {
                    return;
                }
            }

            client.sendPoll(this.pollResult);
            this.finishPoll();
        },

        prevQuestion() {
            if (this.index === 0) {
                return;
            }
            this.index--;
        },

        nextQuestion() {
            if (this.index === this.poll.Questions.length - 1) {
                this.sendRatingPoll();
                return;
            }
            this.index++;
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
            this.rating.Comment = this.ratingComment;
            this.$emit("rate-rating", this.rating);
        },

        finishRating() {
            client.finishPoll(this.rating.Id, this.poll.Id, false).then(res => {
                if (res.OK) {
                    this.rating.State = "finished";
                    this.start = false;
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
            this.pollResult[this.index].AnswerStars = value;
        },

        onMouseOut() {
            this.rating.Value = this.value;
        },

        onMouseOutPoll() {
            this.pollResult[this.index].AnswerStars = this.value;
        },

        onEnterPressed(event) {
            if (!event.shiftKey) {
                event.preventDefault();
                this.sendRating();
            }
        },

        isRated() {
            return (this.rating.State === "rated" || this.rating.State === "finished") && this.rating.Value;
        },

        getRatingScaleMaxValue() {
            let maxValue = DEFAULT_RATING_MAX_VALUE;
            if (this.rating.State === "finished" && this.rating.RatingPoll) {
                for (const question of this.rating.RatingPoll?.Questions) {
                    if (question.AsTicketRating && question.Type === "scale") {
                        maxValue = question.Scale.ToValue
                    }
                }

            }

            return maxValue
        }
    }
};
</script>

<template lang="pug">
    .rating
        .rated(v-if="rating.State === 'ignored'")
            span Без оценки оператора
        .rated(v-if="isRated()")
            span Оценка оператора: {{ rating.Value }} из {{ getRatingScaleMaxValue() }}

        .pending(v-if="rating.State === 'pending'")
            .button-close(@click="ignoreRating")
                svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                    path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")

            .title.mt Пожалуйста, оцените качество консультации
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
            .input
                textarea.poll_text(type="text", v-model="ratingComment", placeholder="Ваш комментарий", maxlength="400", rows="5")
            .buttons-answer.mt
                button.button(@click="sendRating", :class="{'disabled': !value}") Отправить

        .pending(v-if="rating.State === 'poll' && !start && this.poll")
            .title.mt Желаете пройти опрос?
            .buttons.mt
                .ignore(@click="ignoreRating") Нет
                .submit(@click="startPoll") Да

        .pending(v-if="start")
            .button-close(@click="finishRating")
                svg(xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512")
                    path(d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")

            .title.mt {{ poll.Questions[index].Text }}
            .stars(@mouseout="onMouseOutPoll()", v-if="poll.Questions[index].Type === 'stars'")
                .star(v-for="n in 5",
                    :class="{'star-selected': n <= pollResult[index].AnswerStars}",
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
                .buttons-one-of-list.m-b(v-for="(answer, i) in poll.Questions[index].Answers",
                    @click.prevent="setPollVariant(answer)"
                )
                    button.button.button_one_of_list(@click.prevent="setPollVariant(answer)", :class="{'button_active': answer.Id === pollResult[index].RatingPollAnswerId }") {{ answer.Text }}
            .fcr.mt(v-if="poll.Questions[index].Type === 'fcr'")
                .buttons-fcr.mt
                    button.button.button_one_of_list(@click.prevent="setPollVariantFCR(poll.Questions[index].Answers[0])", :class="{'button_active': poll.Questions[index].Answers[0].Id === pollResult[index].RatingPollAnswerId}") {{ poll.Questions[index].Answers[0].Text }}
                    button.button.button_one_of_list(@click.prevent="setPollVariantFCR(poll.Questions[index].Answers[1])", :class="{'button_active': poll.Questions[index].Answers[1].Id === pollResult[index].RatingPollAnswerId}") {{ poll.Questions[index].Answers[1].Text }}

            .input(v-if="poll.Questions[index].Type === 'input'")
                textarea.poll_text.mt(type="text", v-model="inputText", @change="changeText($event)", placeholder="Ваш ответ", maxlength="4000", rows="5")

            .scale(v-if="poll.Questions[index].Type === 'scale'")
                .buttons-scale.mt(:style="getScaleStyle(poll.Questions[index].Scale)")
                    template(v-for="idx in getScaleItems(poll.Questions[index].Scale)")
                        .buttons-scale_inner
                            button.button.button_one_of_list(
                                @click.prevent="setPollVariantScale(idx)",
                                :class="{'button_active': idx === pollResult[index].AnswerScale}"
                            ) {{ idx }}
                            span(v-if="poll.Questions[index].Scale.Items[idx]") {{ poll.Questions[index].Scale.Items[idx] }}

            .buttons-next-prev.mt(v-if="this.poll.Questions.length !== 1")
                button.button(@click.prevent="prevQuestion()", :disabled="index === 0") Назад
                button.button(@click.prevent="nextQuestion()", :disabled="isRatingPollAnswerEmpty() && index === poll.Questions.length - 1") Далее

            .buttons-answer.mt(v-if="this.poll.Questions.length === 1")
                button.button(@click="sendRatingPoll()") Отправить ответ

        .pending(v-if="thanksFeedback")
            .thanks-feedback
                svg(xmlns="http://www.w3.org/2000/svg" height="3em" fill="#2D98F4" viewBox="0 0 512 512")
                    path(d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z")
                .title.color-thanks {{ thanksFeedbackText }}

</template>

<style lang="scss" scoped>
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
    //box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 5;
    background: white;
    position: relative;
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

        .star-background,
        .star-outline {
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

        &:hover,
        &.star-selected {
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

.m-b {
    margin: 0 10px 10px 10px !important;
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

.buttons-fcr,
.buttons-one-of-list,
.buttons-next-prev,
.buttons-answer,
.buttons-scale {
    display: flex;
    margin: 10px;
    justify-content: center;
}

.buttons-scale {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7%, 1fr));
}

.buttons-scale_inner {
    display: flex;
    flex-flow: column;
    align-items: center;

    &:first-child {
        align-items: start;

        button.button {
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
            border-left: 1px #2EB8FE solid;
        }
    }

    &:last-child {
        align-items: end;

        button.button {
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            border-right: 1px #2EB8FE solid;
        }
    }

    span {
        margin-top: 5px;
        display: inline-block;
        text-align: center;
    }

    button.button {
        margin: 0;
        padding: 0;
        aspect-ratio: 1/1;
        box-sizing: border-box;
        max-height: 50px;
        border-radius: 0;
        border-left: 0;
        border-right: 0;
    }
}

.buttons-one-of-list {
    flex-flow: column;

    .button {
        width: inherit;
        margin: 0;
    }
}

.button {
    padding: 10px 15px;
    background-color: #cccccc;
    color: #000;
    margin: 5px;
    border: 0;
    border-radius: 5px;
    text-align: center;
    font-size: 16px;
    width: 100%;
    cursor: pointer;
    transition: 0.5s ease;

    &.button_one_of_list {
        background-color: white;
        border: 1px #2EB8FE solid;
        color: #2EB8FE;

        &:hover {
            background-color: #3cbdff;
            color: white;
        }
    }

    &.button_active {
        background-color: #2EB8FE;
        color: white;
    }

    &:hover {
        background-color: #dadada;
    }
}

.hidden {
    visibility: hidden;
}

.button-close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    opacity: 0.6;
}
</style>
