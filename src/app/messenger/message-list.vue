
<style lang="scss">

.message-wrapper {
  display: flex;
  flex-flow: column;
  transition: all 0.3s;
  font-size: 14px;
  touch-action: pan-y !important;
}

.scroll_msg_animation_user {
  animation: 2s afterScrollAnimateUser ease-out forwards;
}

@keyframes afterScrollAnimateUser {
  0% {
    background: none;
  }
  50% {
    background: var(--color-after-scroll-animation_user);
  }
  100% {
    background: none;
  }
}

.scroll_msg_animation_client {
  animation: 2s afterScrollAnimateClient ease-out forwards;
}

.file_state-not_approved {
  text-align: center;

  .rejected {
    color: red;
  }

  .check_error {
    color: red;
  }

  .on_checking {
    color: #2D98F4;
  }

  .sent_for_checking {
    color: #2D98F4;
  }
}

@keyframes afterScrollAnimateClient {
  0% {
    background: none;
  }
  50% {
    background: var(--color-after-scroll-animation_client);
  }
  100% {
    background: none;
  }
}

</style>

<template lang="pug">
.message-wrapper(v-for="(msg, index) in group.Messages",
    v-hammer:pan="(event) => swipeRight(event, msg)",
    :class="{ scroll_msg_animation_client: msg.My && animateMsgIds[msg.Id], scroll_msg_animation_user: !msg.My && animateMsgIds[msg.Id] }",
    :id="msg.Id")

    message(
        :group="group",
        :groups="groups",
        :msg="msg"
    )    
</template>

<script>
import Message from "./message/message.vue";


export default {
    components: { Message },
    
    props: {
            searching: Boolean,
            group: Object,
            groups: Array
    },

    data: function() {
        return {
            animateMsgIds: {},
        }
    },

    methods: {
        swipeRight(event, msg) {
            this.$emit("swipe-rigth", event, msg)
        }
    }
}

</script>