'use strict';

import HyperHTMLElement from 'hyperhtml-element';
import { Observable} from 'rxjs-es/Observable';
import 'rxjs-es/add/observable/fromPromise';
import 'rxjs-es/add/operator/map';

class FakeData extends HyperHTMLElement {

  static get observedAttributes() { return ['items']; }

  created(){
    this.attachShadow({mode: 'open'});
    this.endpoint = 'https://jsonplaceholder.typicode.com/users';
    this.items = [];

    this.render();
  }

  attributeChangedCallback(name, prev, curr) {
    console.log(name, prev, curr);
    this.render();
  }

  printItems(items){
    if(items !== ''){
      const json: array = JSON.parse(items);
      return json.map((e,i) => `<li>${e.name} | ${e.username}</li>` );
    } else {
      return '';
    }
  }

  render(){
    return this.html`<ul>${this.printItems(this.items)}</ul>`;
  }


  connectedCallback(){
    const getData = fetch(this.endpoint).then(r => r.json());

    Observable.fromPromise(getData)
      .subscribe(data => {
        console.log(data);
        this.items = JSON.stringify(data);
      });
  }

}

FakeData.define('fake-data');