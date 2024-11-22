export type ShapeEventTriggerHandle = (e: { type: string; target: ShapeEventTrigger }) => void;

class ShapeEventTrigger {
  private eventHandleList: Record<string, ShapeEventTriggerHandle[]> = {};
  addEventListener(eventName: string, eventHandle: ShapeEventTriggerHandle) {
    if (!this.eventHandleList[eventName]) {
      this.eventHandleList[eventName] = [];
    }
    this.eventHandleList[eventName].push(eventHandle);
  }
  emitEvent(eventName: string) {
    (this.eventHandleList[eventName] || []).forEach((handle) =>
      handle({
        type: eventName,
        target: this,
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
}

export default ShapeEventTrigger;
