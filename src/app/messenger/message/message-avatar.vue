<script>

import avatar from '../avatar.vue';

export default {
    components: { avatar },

    props: {
        user: Object,
        showEmpty: Boolean,
        showAvatar: Boolean
    }
}
</script>

<template lang="pug">
    .avatar(v-if="showAvatar")
        avatar(:user="user")

    .avatar-empty(v-if="showEmpty")
</template>

<style>
.avatar {
    margin-left: 8px;
    display: flex;
    align-items: end;
}

.avatar-empty {
    width: 40px;
    height: 40px;
    margin-left: 8px;
}
</style>
