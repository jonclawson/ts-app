import {
  Bindings,
  State,
  Component,
  Directive,
  Router,
  HrefHelper,
  ClickHelper,
  Injector,
  Injectable,
} from '.';

export class AppTs {
  router: Router;
  private helpers = [HrefHelper, ClickHelper];
  private services: Array<any> = [Injector];
  private injector: Injector;
  constructor(
    private components: Array<any>,
    private states: Array<State>,
    services: Array<any> = []
  ) {
    this.services = [...this.services, ...services];
    this.injector = new Injector(this.services);
    this.init();
  }

  init() {
    this.router = new Router(this.states);
    this.initElements();
    this.router.init(this.initElements.bind(this));
  }

  initElements(view: any = document) {
    this.components.forEach((Comp) => {
      const results = this.directElements(Comp, view);
    });
  }

  private directElements(Comp: any, view: any = document): Array<any> {
    const results = [];
    let { selector, template } = new Comp();
    if (!selector) {
      const state = this.states.find((s) => s.path == window.location.pathname);
      if (state && state.component == Comp) {
        selector = this.router.selector;
      }
    }
    if (selector) {
      const elements = [...view.querySelectorAll(selector)];
      elements.forEach((element: Element) => {
        // const comp = new Comp();
        const comp = this.injector.resolve(Comp);
        if (template) {
          this.setTemplate(template, element, comp);
        }
        this.setInputs(element, comp);
        this.applyHelpers(comp, element);
        this.applyBindings(comp, element);
        this.addEventListener(element, comp);
        if (comp.init) {
          comp.init(element);
          results.push(comp);
        }
      });
    }
    return results;
  }

  private applyBindings(comp: any, element: any): void {
    const bindings = this.directElements(Bindings, element);
    bindings.forEach((b) => {
      this.renderElement(comp, b.element);
      const app = this;
      b.eventMethod = b.eventMethod.bind({ comp, app, bindings });
    });
  }

  private applyHelpers(comp: any, element: any): void {
    this.helpers.forEach((Helper) => {
      const helper = this.directElements(Helper, element);
      helper.forEach((h) => {
        h.eventMethod = h.eventMethod.bind({ app: this, comp });
      });
    });
  }

  public renderComp(comp, bindings) {
    bindings.forEach((b) => {
      if (b.element) {
        this.renderElement(comp, b.element);
      }
    });
  }

  public renderElement(
    comp,
    e: Element | HTMLElement | HTMLInputElement | any
  ) {
    const bind = e && e.dataset ? e.dataset.bind : null;
    if (bind) {
      switch (e.type) {
        case 'text':
          e.value = comp[bind];
          break;
        default:
          e.textContent = comp[bind];
      }
    }
  }

  private setInputs(element: Element | any, comp: any): any {
    if (comp.dataset) {
      Object.keys(comp.dataset).forEach((i) => {
        comp.dataset[i] = element.dataset[i];
      });
    }
  }

  private addEventListener(element: Element, comp: any) {
    if (!comp.events) {
      return;
    }
    const eventsNames: Array<string> =
      typeof comp.events == 'string' ? [comp.events] : comp.events;
    eventsNames.forEach((eventName: string) => {
      element.addEventListener(eventName, (event: Event) => {
        comp.eventMethod(event, element);
      });
    });
  }

  private setTemplate(temp, element, comp) {
    const matches = temp.match(/\{\{.*?\}\}/g);
    if (matches) {
      matches.forEach((m) => {
        let prop = m.replace(/\{\{|\}\}/g, '');
        prop = prop.trim();
        const bind = `<span data-bind="${prop}">${comp[prop]}</span>`;
        temp = temp.replaceAll(m, bind);
      });
    }
    element.innerHTML = temp;
  }
}
