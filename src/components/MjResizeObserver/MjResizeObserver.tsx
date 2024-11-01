import { Fragment, defineComponent, onBeforeUnmount } from 'vue';

export default defineComponent({
  setup(props, { emit, slots }) {
    let resizeObserver: ResizeObserver | null;
    let firstEle: HTMLElement | null;

    const setRef = (el: unknown) => {
      firstEle = (el as HTMLElement)?.nextElementSibling as HTMLElement;
      if (firstEle) {
        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          emit('resize', entry);
        });
        resizeObserver.observe(firstEle);
      }
    };
    onBeforeUnmount(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    });
    return () => {
      return <Fragment ref={setRef}>{[...(slots.default?.() || [])]}</Fragment>;
    };
  },
});
