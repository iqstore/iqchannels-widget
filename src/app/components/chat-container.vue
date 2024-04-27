<style lang="scss">
.circle-chat {
  width: 35px;
  height: 35px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-top: 2px;

    &.light-svg {
      color: white;
    }

    &.dark-svg {
      color: black;
    }
  }
}

.chat-container {
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
  }
}
</style>

<template lang="pug">
  .chat-container
    .circle-chat(:style="{backgroundColor: chat.MultiChatsInfo.ChannelIconColor ?? '#0096F7'}")
      font-awesome-icon(:icon="isWithPersonalManager ? ['fas', 'fa-user'] : ['fas', 'fa-message']", :class="{'dark-svg': isDarkSvg(), 'light-svg': !isDarkSvg()}")
    span {{ chat.MultiChatsInfo.ChannelName }}
</template>

<script>
import { hexToHSL } from "../../lib/ui";

export default {
  name: 'chat-container',

  props: {
    chat: Object,
    isWithPersonalManager: Boolean,
  },

  methods: {
    isDarkSvg() {
      const HSL = hexToHSL((this.chat.MultiChatsInfo.ChannelIconColor ?? '#0096F7').slice(1));
      return HSL.l > 0.65;
    },
  }
}
</script>
