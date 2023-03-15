import './style.css';
import { TsApp, Component, Directive, Injectable, State } from './src';

class AppComponent implements Component {
  selector = '#app';
  template = `
    <h1 data-click="shout">{{name}}</h1>


    <a href="/">Home</a>
    <a href="/test">Test</a>
    <div data-view="content"></div>
  `;
  dataset: {};
  name = 'TS-APP';
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
  <p>{{description}}</p>
  <input name="name" data-bind="name"/>
  {{ name }}
  `;
  dataset: any;
  description = 'This is a router component';
  name = 'content';
  init() {}
}

class TestComponent implements Component {
  selector: string;
  template = `
   <p> {{name}}</p>
    <button data-color="white" data-background="black" data-message="Hello"></button>
    <button data-message="Come back soon"></button>
  `;
  name = 'Test';
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
  [AppComponent, ContentComponent, TestComponent, ButtonDirective],
  [MyService],
  states
);
