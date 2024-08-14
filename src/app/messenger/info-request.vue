<script>
const MaxFieldLength = 25

const REGEXP = {
    "only_letters": new RegExp(/^([a-zA-Zа-яА-Я]+$).*$/).source,
    "letters_and_numbers": new RegExp(/^([a-zA-Zа-яА-Я0-9]+$).*$/).source,
    "latin_and_numbers": new RegExp(/^([a-zA-Z0-9]+$).*$/).source,
    "nickname": new RegExp(/^([a-zA-Z0-9_]+$).*$/).source,
    "only_cyrillic": new RegExp(/^([а-яА-Я]+$).*$/).source,
    "only_latin": new RegExp(/^([a-zA-Z]+$).*$/).source,
    "only_numbers": new RegExp(/^([0-9]+$).*$/).source,
    "phone": new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im).source,
    "date_of_birth": new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/i).source,
    "email": new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i).source,
    "custom": "",
};

export default {
    props: {
        request: Object,
        disableIgnore: Boolean,
        client: Object,
    },

    data: function () {
        return {
            value: null,
            comment: null,
            dataError: null,
        };
    },

    mounted() {
        if (!this.client?.Details) return;

        for (let f of this.request.Form.Fields) {
            switch (f.Name) {
                case 'Телефон':
                    f.CorrespondingField = this.client?.Details.Cellphone;
                    break;
                case 'Email':
                    f.CorrespondingField = this.client?.Details.Email;
                    break
                case 'Дата Рождения':
                    f.CorrespondingField = this.client?.Details.BirthDay;
                    break;
                case 'Имя':
                    f.CorrespondingField = this.client?.Details.FirstName;
                    break;
                case 'ИНН':
                    f.CorrespondingField = this.client?.Details.INN;
                    break;
                case 'Фамилия':
                    f.CorrespondingField = this.client?.Details.LastName
                    break;
                case 'Отчество':
                    f.CorrespondingField = this.client?.Details.MiddleName
                    break;
                default:
                    f.CorrespondingField = this.client?.Details.Fields.find((field) => field.Name == f.Label || field.Name === f.Name)?.Value;
            }
        }
    },

    methods: {
        sendInfo() {
            if (this.dataError === `Максимальная длина значения - ${MaxFieldLength} символов`) {
                return;
            }
            this.dataError = null;
            for (let f of this.request.Form.Fields) {
                if (f.CorrespondingField.length > MaxFieldLength) {
                    this.dataError = `Максимальная длина значения - ${MaxFieldLength} символов`
                    return;
                }
                if (f.Required) {
                    const val = f.CorrespondingField
                    if (val === '') {
                        this.dataError = "Вы не заполнили поле " + f.Label
                        document.getElementById(f.Label).style.borderColor = 'red';
                        return;
                    }
                }

                if (f.ValidationRegexp && f.ValidationRegexp?.length) {
                    const regexp = REGEXP[f.ValidationRegexp] ?? f.ValidationRegexp
                    if (!f.CorrespondingField.match(regexp)) {
                        this.dataError = "Неправильно значение в поле " + f.Label;
                        return;
                    }
                }

            }
            this.request.State = 'finished';
            this.$emit("send-info", this.request)
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
        },
        inputChange(e) {
            if (e.target.value.length > MaxFieldLength) {
                e.srcElement.style.borderColor = 'red'
                this.dataError = `Максимальная длина значения - ${MaxFieldLength} символов`
            } else {
                this.dataError = null;
                e.srcElement.style.borderColor = '#ced4da'
            }
        }
    }
};
</script>

<template lang="pug">

    .request

        .backdrop(v-if="request.State === 'pending'")
        .pending(v-if="request.State === 'pending'")
            .title Пожалуйста, укажите Ваши данные
            .data-error(v-if="dataError") {{ dataError }}
            .inner
                div(v-for="field in request.Form.Fields")
                    label(:for="field.Label").label-custom {{ field.Label }}
                    input.input-custom(:name="field.Label" :id="field.Label" @input="inputChange" v-model="field.CorrespondingField" )

                div.client-consent
                    input(type="checkbox" v-model="request.ClientConsent").checkbox-custom
                    span Согласие на обработку
                        a(style="text-decoration:underline" :href="request.ProcessingDataLink" target="_blank") &nbsp;персональных данных
            .buttons
                .ignore(v-if="!disableIgnore", @click="ignoreInfo") Отмена
                .submit(@click="sendInfo", :class="{'disabled': !request.ClientConsent}") Отправить

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

.inner {
    margin-top: 10px;
    padding: 10px;
}

.pending {
    border-radius: 15px;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
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

.label-custom {
    margin-left: 10px;
}

.input-custom {
    width: 80%;
    color: gray;
    height: 25px;
    background-color: #FFFFFF;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    margin: 5px 2px 10px 2px;
    padding: .375rem .75rem;

    &:focus {
        outline: none;
    }
}

.client-consent {
    font-size: 12px;
    margin: 15px;
    display: flex;
    align-items: center;
}

.checkbox-custom {
    margin-right: 5px;
}


.data-error {
    background-color: #FBE7E9;
    border-radius: 5px;
    text-align: center;
    color: red;
    padding: 10px 0;
}
</style>
