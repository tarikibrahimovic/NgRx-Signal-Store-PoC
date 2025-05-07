import {Component, inject, OnInit} from '@angular/core';
import {TodosStore} from './store/todos.store';
import {TodosListComponent} from './components/todos-list/todos-list.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [TodosListComponent, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  store = inject(TodosStore)

  ngOnInit() {
    this.loadTodos().then(() => console.log('Todos loaded'));
  }

  async loadTodos() {
    await this.store.loadAll();
  }
}
