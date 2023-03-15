export declare interface Component {
  selector: string;
  template: string;
  dataset: any;
  init(element: Element): void;
}