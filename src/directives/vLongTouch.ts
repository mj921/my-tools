import { type DirectiveBinding } from 'vue';

interface DirectiveTouchData {
  onTouchStart: () => void;
  onTouchEnd: (e: TouchEvent) => void;
  flag: boolean;
  mouseDownTime: number;
}

export default {
  mounted: (
    el: HTMLElement & { directiveData: DirectiveTouchData },
    { value }: DirectiveBinding,
  ) => {
    const { handler = () => {}, triggerTime = 600 } = value || {};
    el.directiveData = {
      mouseDownTime: 0,
      flag: false,
      onTouchStart: () => {
        el.directiveData.mouseDownTime = Date.now();
      },
      onTouchEnd: (e: TouchEvent) => {
        if (triggerTime <= Date.now() - el.directiveData.mouseDownTime) {
          handler(e.changedTouches[0]);
        }
        el.directiveData.mouseDownTime = 0;
      },
    };
    el.addEventListener('touchstart', el.directiveData.onTouchStart);
    el.addEventListener('touchend', el.directiveData.onTouchEnd);
  },
  beforeUnmount: (el: HTMLElement & { directiveData?: DirectiveTouchData }) => {
    el.removeEventListener('touchstart', el.directiveData!.onTouchStart);
    el.removeEventListener('touchend', el.directiveData!.onTouchEnd);
    el.directiveData = undefined;
  },
};
