import './style.css';
import { TsApp, Component, Directive, Injectable, State } from './src';

class AppComponent implements Component {
  selector = '#app';
  template = `
    <h1 data-click="shout">TS-APP</h1>

    <button data-color="white" data-background="black" data-message="Hello"></button>
    <button data-message="Come back soon"></button>
    <a href="/">Home</a>
    <a href="/test">Test</a>
    <div data-view="content"></div>
  `;
  dataset: {};
  init() {}
  shout() {
    alert('hey ya');
  }
}

class ButtonDirective implements Directive {
  selector = 'button';
  events = ['click'];
  element: Element;
  dataset = {
    color: '',
    background: '',
    message: '',
  };
  init(element) {
    this.element = element;
    element.innerHTML = 'Click Here';
    element.style.color = this.dataset.color;
    element.style.background = this.dataset.background;
  }
  eventMethod(event, element) {
    alert(this.dataset.message);
  }
}

class ContentComponent implements Component {
  selector: string;
  template = `
  This is my view
  <input name="name" data-bind="name"/>
  {{ name }}
  `;
  dataset: any;
  name = 'Bob';
  init() {}
}

class TestComponent implements Component {
  selector: string;
  template = `
    Test
  `;
  dataset: any;
  inject: any = {
    myService: MyService,
  };

  init() {
    this.inject.myService.init();
  }
}

class MyService implements Injectable {
  count = 0;
  init() {
    this.count++;
    console.log(this.count);
  }
}

const states: Array<State> = [
  {
    name: 'home',
    path: '/',
    component: ContentComponent,
  },
  {
    name: 'test',
    path: '/test',
    component: TestComponent,
  },
];

new TsApp(
  [AppComponent, ButtonDirective, ContentComponent, TestComponent],
  states,
  [MyService]
);
