<script>

export default {
    props: {
        msg: Object,
    },

    methods: {
        convertCreated() {
            return new Date(this.msg.CreatedAt)?.toLocaleTimeString({}, { timeStyle: 'short' })
        },
    }
}
</script>

<template lang="pug">
    .footer(:class="{ 'audio-time': (msg.File && msg.File.Type === 'audio') }")
        span.edited(v-if="msg.EditedAt" title="Изменено") изменено
        span.listened-flag(v-if="msg.Listened" title="Прослушано")
            svg(xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512")
                path(d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z")
        span(v-if="msg.Id && msg.CreatedAt") {{ convertCreated() }}
        span.received(v-if="msg.Id && !msg.Read" title="Доставлено" :class="{'blue': msg.Listened}")
            svg(width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg")
                path(d="M10.5 1L4 7.5L1 5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")
        span.read(v-if="msg.Read" title="Прочитано")
            svg(width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg")
                path(d="M10.5 1L4 7.5L1 5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")
                path(d="M15 1L8.5 7.5" stroke="#1C91D2" stroke-opacity="0.64" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")

        scale-loader.loader(v-if="!msg.Id" title="Отправляется" color="#999999" height="8px" width="1px")

</template>

<style lang="scss">
.footer {
    font-size: 10px;
    white-space: nowrap;
    clear: both;
    margin: auto 0 0 12px;
    position: relative;

    &.audio-time {
        text-align: end;
    }
}

.group {
    &.client {
        .footer {
            color: #456b84;
        }
    }

    &.user {
        .footer {
            color: #656565;
        }

        .received,
        .read {
            display: none;
        }
    }
}

.received,
.read {
    margin-left: 5px;
    color: #456b84;
}
</style>
