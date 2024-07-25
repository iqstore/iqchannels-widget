<script>
export default {
    name: "scroll-bottom",

    mounted() {
        document.getElementById('chat').addEventListener('scroll', ev => {
            setTimeout(() => {
                const height = document.getElementById('chat')?.offsetHeight;
                // add 3px because there is a difference for some reason
                this.isBottom = !((ev.target.scrollHeight - ev.target.scrollTop - 3) >= height);
            }, 300);
        });
        const elementToPosition = document.getElementById('scroll-bottom');
        const blockBelow = document.getElementById('composer');

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === blockBelow) {
                    const newBottom = blockBelow.offsetHeight - elementToPosition.offsetHeight + 40;
                    elementToPosition.style.bottom = newBottom + 'px';
                }
            }
        });

        resizeObserver.observe(blockBelow);
    },

    data: () => ({
        isBottom: true,
    }),

    methods: {
        onClick() {
            this.$emit("on-click");
        }
    },
}
</script>

<template lang="pug">
    .scrollBottom#scroll-bottom(:class="{ 'invisible': (isBottom || this.searching) }" @click="onClick()")
        svg(width='12' height='7' viewbox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg')
            path(d='M11 1L6.07071 5.92929C6.03166 5.96834 5.96834 5.96834 5.92929 5.92929L1 1' stroke='#767B81' stroke-width='1.5' stroke-linecap='round')
</template>

<style scoped lang="scss">
.scrollBottom {
    width: 32px;
    height: 32px;
    position: fixed;
    bottom: 60px;
    background: #EBEBEB;
    border-radius: 50%;
    display: flex;
    z-index: 2;
    right: 0;
    margin-right: 8px;
    margin-left: auto;
    cursor: pointer;

    svg {
        margin: auto;
    }

    &.invisible {
        visibility: hidden;
    }
}
</style>
