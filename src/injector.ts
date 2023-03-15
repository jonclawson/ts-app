import { cName, Injectable } from '.';

export class Injector implements Injectable {
  private injections: any;
  constructor(private injectables: Array<any>) {
    this.injections = { injector: this };
  }
  resolve(C: any) {
    let c = new C();

    if (this.injections[cName(C.name)]) {
      c = this.injections[cName(C.name)];
    }

    // store injections once
    if (
      this.injectables.find((P) => P === C) &&
      !this.injections[cName(C.name)]
    ) {
      this.injections[cName(C.name)] = c;
    }

    if (c.inject) {
      Object.entries(c.inject).forEach((o) => {
        const [p, T]: any = o;
        if (this.injections[cName(T.name)]) {
          // find injection
          c.inject[p] = this.injections[cName(T.name)];
        } else {
          const PR: any = this.injectables.find((P) => P === T);
          if (PR) {
            const pr = new PR();
            // store injection if not already
            this.injections[cName(PR.name)] = pr;
            c.inject[p] = pr;
          }
        }
      });
    }
    return c;
  }
}
