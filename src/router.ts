import { State, StateParams } from '.';

export class Router {
  public selector = '[data-view="content"]';
  public view: Element;
  public state: State;
  public params = {};
  updater: Function;
  constructor(private states: Array<State>) {}

  init(updater): void {
    this.view = document.querySelector(this.selector);
    this.updater = updater;
    this.goTo(window.location.pathname);
  }

  goTo(url: string): StateParams | false {
    history.replaceState(history.state, '', url);
    const { state, params }: StateParams = this.matchState(url);
    if (params) {
      this.params = params;
    }
    if (state) {
      this.state = state; //console.log('thst', state)
      this.updater(document);
      return { state, params };
    } else {
      return false;
    }
  }

  matchState(url: string): { state: State; params: any } {
    const params: any = {};
    const state = this.states.find((state: State) => {
      const sParts = state.path.split('/');
      const lParts = url.split('/');
      const pathname = url + '/';
      // const params: any = {};
      sParts.forEach((sp: string, i) => {
        if (sp.startsWith(':')) {
          params[sp.replace(':', '')] = lParts[i];
        }
      });
      let mPath = '';
      sParts.forEach((sp: string, i: number) => {
        mPath += (sp.startsWith(':') ? lParts[i] : sp) + '/';
      });
      if (mPath == pathname) {
        // this.params = params;
        return true;
      }
      return false;
    });
    return { state, params };
  }
}
