import {Component, effect, viewChild} from '@angular/core';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {inject} from '@angular/core';
import {TodosFilter, TodosStore} from '../../store/todos.store';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-todos-list',
  imports: [MatFormField, MatIcon, MatInput, MatIcon, MatSuffix, MatLabel, MatButtonToggleGroup, MatButtonToggle, MatSelectionList, MatListOption, NgStyle],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {
  store = inject(TodosStore);

  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {

    effect(() => {
      const filter = this.filter();

      filter.value = this.store.filter();
    });
  }


  async onAddTodo(title: string) {
      await this.store.addTodo(title);
  }

  async onDeleteTodo(id: number, event: MouseEvent) {
    event.stopPropagation()
    await this.store.deleteTodo(id);

  }

  async onTodoToggle(id: number, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  onFilterTodos(event: MatButtonToggleChange) {
    const filter = event.value as TodosFilter;

    this.store.updateFilter(filter);
  }
}
