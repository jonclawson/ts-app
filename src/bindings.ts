import { AppTs, Directive } from ".";

export class Bindings implements Directive {
  element: Element;
  selector = '[data-bind]';
  events = ['change', 'keyup', 'drop', 'focusout']
  dataset = {}
  app: AppTs;
  comp: any;
  bindings: Array<Bindings>
  constructor() {}
  init(element: Element) {
    this.element = element;
  }
  eventMethod(event: Event, element: HTMLInputElement) {
    const prop = element.getAttribute('name');
    if (this.comp[prop]) {
      this.comp[prop] = element.value;
    }
    this.app.renderComp(this.comp, this.bindings);
  }
}