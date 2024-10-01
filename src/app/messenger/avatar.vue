<script>
const COLORS = [
    "#c28eae",
    "#92a194",
    "#45acb0",
    "#f87755",
    "#de8394",
    "#00b1d2",
    "#00b3a7",
    "#e1828f",
    "#af9a88",
    "#00b3ae",
    "#4eb15d",
    "#ad8ee3",
    "#9d9f8b",
    "#75ac41",
    "#c19651",
    "#b594a8",
    "#59a1f1",
    "#58a7c7",
    "#cb7fe9",
    "#00acd6",
    "#8fa47b",
    "#c48cb5",
    "#b593ae",
    "#00b1be",
    "#7da697",
    "#b29b66",
    "#4ba9c0",
    "#8c99df",
    "#8e96f0",
    "#b594a8",
    "#00b2bc",
    "#00aecb"
];

export default {
    data() {
        return {
            styleObject: {
                backgroundColor: COLORS[this.user.Id || 1 % COLORS.length],
            }
        }
    },
    props: {
        user: Object,
    },

    computed: {
        'color': function () {
            return COLORS[this.user.Id || 1 % COLORS.length];
        },
        'initials': function () {
            if (this.user.DisplayName) {
                return this.user.DisplayName.split(' ').slice(0, 2).map(s => s ? s[0].toUpperCase() : '').join('')
            }
            return '';
        },
        'url': function () {
            return this.user.AvatarURL
        }
    }
}
</script>

<template lang="pug">
    .circle(:style="styleObject")
        span(v-if="!url") {{ initials }}
        .img(v-else :style="{ 'background-image': 'url(' + url + ')' }")

</template>

<style lang="scss" scoped>
.circle {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: white;

    .img {
        border-radius: 500px;
        width: 100%;
        height: 100%;
        background-size: 40px 40px;
    }
}
</style>
