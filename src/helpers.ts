import { AppTs, Directive, Router } from '.';

export class HrefHelper implements Directive {
  selector = 'a[href]';
  events = ['click'];
  element: Element;
  router: Router;
  dataset = {};
  app: AppTs;
  init(element) {
    this.element = element;
  }
  eventMethod(e, el): void {
    e.preventDefault();
    const url = el.getAttribute('href');
    const stateParams = this.app.router.goTo(url);
    if (!stateParams) {
      window.location.href = url;
    }
  }
}

export class ClickHelper implements Directive {
  selector = '[data-click]';
  events = ['click'];
  element: Element;
  dataset = {};
  comp: any;
  constructor() {}
  init(element) {
    this.element = element;
  }
  eventMethod(event: Event, element: HTMLInputElement) {
    const clickMethod = element.dataset.click;
    if (this.comp[clickMethod]) {
      this.comp[clickMethod]();
    }
  }
}
