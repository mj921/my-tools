import type Shape from './Shape';

export type ShapeEventTriggerHandle<T = any> = (e: {
  type: string;
  target: ShapeEventTrigger;
  data?: T;
}) => void;

class ShapeEventTrigger {
  private eventHandleList: Record<string, ShapeEventTriggerHandle[]> = {};
  addEventListener(eventName: string, eventHandle: ShapeEventTriggerHandle) {
    if (!this.eventHandleList[eventName]) {
      this.eventHandleList[eventName] = [];
    }
    this.eventHandleList[eventName].push(eventHandle);
  }
  emitEvent(eventName: string, data?: any) {
    (this.eventHandleList[eventName] || []).forEach((handle) =>
      handle({
        type: eventName,
        target: this,
        data,
      }),
    );
  }
  removeEventListener(eventName: string, eventHandle?: ShapeEventTriggerHandle) {
    if (eventHandle) {
      const index = this.eventHandleList[eventName].indexOf(eventHandle);
      if (index > -1) {
        this.eventHandleList[eventName].splice(index, 1);
      }
    } else {
      delete this.eventHandleList[eventName];
    }
  }
  removeAllEventListener() {
    this.eventHandleList = {};
  }
  hasEventListener(eventName: string) {
    return !!this.eventHandleList[eventName];
  }
}

export default ShapeEventTrigger;

export interface ShapeMouseEvent extends MouseEvent {
  shape: Shape;
}
