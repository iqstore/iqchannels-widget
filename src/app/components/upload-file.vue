<script>

import { humanSize } from "../../lib/filters";

export default {
  props: {
    currentFile: null,
  },
  methods: {
    humanSize,
    resetUploadFile(file) {
      this.$emit("reset-upload", file);
    }
  },
}

</script>

<template lang="pug">
  .upload_file(v-if="currentFile")
    .upload_file__data
      svg(xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512")
        path(d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z")
      div
        a.file
          .filename {{ currentFile.name }}
          .filesize {{ humanSize(currentFile.size) }}
    svg(width='9' height='9' viewbox='0 0 9 9' fill='none' xmlns='http://www.w3.org/2000/svg' style="cursor: pointer;" @click="resetUploadFile(currentFile)")
      path(d='M8.79063 0.209373C8.65653 0.0753116 8.47467 0 8.28505 0C8.09543 0 7.91357 0.0753116 7.77947 0.209373L4.5 3.48884L1.22053 0.209373C1.08643 0.0753116 0.904572 0 0.714952 0C0.525332 0 0.343475 0.0753116 0.209373 0.209373C0.0753116 0.343475 0 0.525332 0 0.714952C0 0.904572 0.0753116 1.08643 0.209373 1.22053L3.48884 4.5L0.209373 7.77947C0.0753116 7.91357 0 8.09543 0 8.28505C0 8.47467 0.0753116 8.65653 0.209373 8.79063C0.343475 8.92469 0.525332 9 0.714952 9C0.904572 9 1.08643 8.92469 1.22053 8.79063L4.5 5.51116L7.77947 8.79063C7.91357 8.92469 8.09543 9 8.28505 9C8.47467 9 8.65653 8.92469 8.79063 8.79063C8.92469 8.65653 9 8.47467 9 8.28505C9 8.09543 8.92469 7.91357 8.79063 7.77947L5.51116 4.5L8.79063 1.22053C8.92469 1.08643 9 0.904572 9 0.714952C9 0.525332 8.92469 0.343475 8.79063 0.209373Z' fill='#C6E39F')

</template>

<style scoped lang="scss">
.upload_file {
  flex-direction: row;
  display: flex;
  white-space: nowrap;
  font-size: 13px;
  margin: 10px 14px 10px 45px;

  &__data {
    display: flex;

    svg {
      width: 24px !important;
      height: 24px !important;
      opacity: 25%;
      margin-right: 5px !important;
    }
  }

  &-text {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &-author {
    font-weight: 600;
  }

  svg {
    width: 12px;
    height: 12px;
    margin: auto 2px auto auto;
  }
}

</style>
