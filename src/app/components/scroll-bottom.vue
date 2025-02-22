<script>
export default {
    name: "scroll-bottom",

    props: {
        unreadCount: Number,
    },

    mounted() {
        const chat = document.getElementById('chat');

        chat.addEventListener('scrollend', ev => {
            this.checkIsBottom(ev);
        });
        chat.addEventListener('wheel', event => {
            const container = event.currentTarget;
            const delta = event.deltaY;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            const atTop = delta < 0 && scrollTop === 0;
            const atBottom = delta > 0 && scrollTop + clientHeight >= scrollHeight;

            if (atTop || atBottom) {
                event.preventDefault();
            }
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
        isBottom: false,
    }),

    methods: {
        checkIsBottom(event) {
            const height = document.getElementById('chat')?.offsetHeight;

            // add 3px because there is a difference for some reason
            this.isBottom = !((event.target.scrollHeight - event.target.scrollTop - 3) >= height);
            if (this.isBottom) {
                this.onReachedBottom();
            }

            this.$emit("is-bottom-chaned", this.isBottom);
        },

        onClick() {
            this.$emit("on-click");
        },

        onReachedBottom() {
            this.$emit("on-reached-bottom");
        }
    },
}
</script>

<template lang="pug">
    .scrollWrapper(:class="{ 'invisible': (isBottom || this.searching) }")
        .scrollBottom#scroll-bottom(@click="onClick()")
            .unreadCount(v-if="unreadCount") {{  unreadCount }}
            svg(width='12' height='7' viewbox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg')
                path(d='M11 1L6.07071 5.92929C6.03166 5.96834 5.96834 5.96834 5.92929 5.92929L1 1' stroke='#767B81' stroke-width='1.5' stroke-linecap='round')
</template>

<style scoped lang="scss">
.scrollWrapper {
    position: fixed;
    bottom: 60px;
    right: 0;
    display: flex;
    justify-content: flex-end;
    margin-right: 8px;

    transition: 0.2s ease;

    &.invisible {
        pointer-events: none;
        opacity: 0;
    }
}

.scrollBottom {
    width: 32px;
    height: 32px;
    position: fixed;

    background: #EBEBEB;
    border-radius: 50%;
    display: flex;
    z-index: 2;
    cursor: pointer;

    svg {
        margin: auto;
    }
}

.unreadCount {
    background: #8b8b8b;
    color: #fff;

    width: 15px;
    height: 15px;
    border-radius: 15px;

    position: absolute;
    z-index: 3;
    top: -5px;
    right: -2px;

    font-size: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
