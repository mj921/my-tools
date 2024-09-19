import { Fragment, Teleport, defineComponent, reactive, ref } from 'vue';
import './MineClearancePopper.scss';

export default defineComponent({
  setup(props, { slots }) {
    const visible = ref(false);
    const styles = reactive({
      left: 0,
      top: 0,
    });
    const onClick = (e: Event) => {
      visible.value = !visible.value;
      e.stopPropagation();
    };
    const onWindowClick = (e: Event) => {
      visible.value = false;
    };

    const setRef = (el: unknown) => {
      const firstEle = (el as HTMLElement)?.nextElementSibling;
      if (firstEle) {
        firstEle.removeEventListener('click', onClick);
        window.removeEventListener('click', onWindowClick);
        firstEle.addEventListener('click', onClick);
        window.addEventListener('click', onWindowClick);
        const bcr = firstEle?.getBoundingClientRect();
        styles.top = bcr?.bottom || 0;
        styles.left = (bcr?.left || 0) + (bcr.width || 0) / 2;
      }
    };
    return () => {
      return (
        <Fragment ref={setRef}>
          {[
            ...(slots.default?.() || []),
            <Teleport to={document.body}>
              <div
                class="mine-clearance-popper-content"
                style={{
                  left: styles.left + 'px',
                  top: styles.top + 'px',
                  display: visible.value ? undefined : 'none',
                }}
              >
                {slots.content?.()}
              </div>
            </Teleport>,
          ]}
        </Fragment>
      );
    };
  },
});
