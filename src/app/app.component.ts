import { Component, OnInit, DoCheck } from '@angular/core';
import { Todo } from "./todo";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: Todo[] = JSON.parse(window.localStorage.getItem('todos')) || [];

  public currentEditing = null;

  public filter = 'all';

  ngOnInit() {
    this.hashChange();
    window.onhashchange = this.hashChange.bind(this);
  }

  ngDoCheck() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  addTodo(e): void {
    const titleText = e.target.value;
    if(titleText.length) {
      this.todos.push({
        id: this.todos.length + 1,
        title: titleText,
        done: false
      })
      e.target.value = '';
    }
  }

  get toggleAll() {
    return this.todos.every(t => t.done == true);
  }

  set toggleAll(value) {
    this.todos.forEach(t => t.done = value);
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1)
  }

  saveEdit(todo, e) {
    todo.title = e.target.value;
    this.currentEditing = null;
  }

  detectEsc(e) {
    const {keyCode, target} = e;
    if(keyCode === 27) {
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }

  get remain() {
    return this.todos.filter(t => !t.done);
  }

  clearDone() {
    this.todos = this.todos.filter(t => !t.done);
  }

  get filteredTodos() {
    if(this.filter == "all") {
      return this.todos;
    } else if(this.filter == "active") {
      return this.todos.filter(t => !t.done);
    } else if(this.filter == "completed") {
      return this.todos.filter(t => t.done);
    }
  }

  hashChange() {
    const hash = location.hash.substr(1);
    switch(hash) {
      case '/':
        this.filter = 'all';
        break;
      case '/active':
        this.filter = 'active';
        break;
      case '/completed':
        this.filter = 'completed';
        break;
    }
  }
}
