<script>
import client from "../client";
import { isYoungerVersion } from "../lib/version";

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

    async mounted() {
        if (!client.iQVersion) {
            client.iQVersion = (await client.version())?.Data?.Version
        }
        if (this.channel && isYoungerVersion("4.2.0", client.iQVersion)) {
            client.getBlocker(this.channel).then((blocker) => {
                if (blocker.Data.Enabled) {
                    this.error = blocker.Data.Text;
                } else {
                    this.authClients();
                }
            }).catch(err => {
                if (err.text.includes("404")) {
                    this.authClients();
                }
            });
        } else {
            this.authClients();
        }
    },

    methods: {
        authClients() {
            if (!this.multiChatData) {
                this.authSingleChat();
                return;
            }

            this.authMultiChat();
        },


        authMultiChat() {
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
        },

        authSingleChat() {
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
    }

};
</script>

<template lang="pug">
    .full-screen#client_auth
        .center(v-if="authorizing")
            p Подключение
            scale-loader(color="#ee5c13")
        .center(v-if="error")
            p
                strong Извините, произошла ошибка.
            p {{ error ?? 'В настоящий момент, чат недоступен, попробуйте войти позже.' }}
</template>
