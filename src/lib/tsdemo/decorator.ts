function first() {
  console.log('first(): factory evaluated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('first(): called');
    console.log(target, propertyKey, descriptor);
  };
}

function second() {
  console.log('second(): factory evaluated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('second(): called');
    console.log(target, propertyKey, descriptor);
  };
}

function classD() {
  console.log('classD(): factory evaluated');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('classD(): called');
    console.log(target, target.prototype);
  };
}

// @classD()
export class ExampleClass {
  method() {}
}
