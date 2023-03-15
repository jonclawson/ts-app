export declare interface Directive {
  selector: string;
  events: Array<string>;
  dataset: any;
  init(element: Element): void;
  eventMethod(event: Event, element: Element): void;
}
