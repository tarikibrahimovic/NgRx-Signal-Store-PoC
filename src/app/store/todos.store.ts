import {computed, inject} from '@angular/core';
import {Todo} from '../model/todo.model';
import {patchState, signalStore, withComputed, withMethods, withProps, withState} from '@ngrx/signals';
import {TodosService} from '../services/todoService';

export type TodosFilter = 'all' | 'pending' | 'completed';

type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'all',
};

export const TodosStore = signalStore(
  {providedIn: 'root'},// singleton, global store
  withState(initialState),
  withProps(() => ({
    todosService : inject(TodosService)
  })),
  withMethods(
    (store) => ({

      async loadAll(){
        patchState(store, {loading: true});
        const todos = await store.todosService.getTodos();
        patchState(store, {todos, loading: false});
      },

      async addTodo(title: string){
        const todo = await store.todosService.addTodo({title, completed: false});
        patchState(store, (state) => ({
          todos: [...state.todos, todo]
        }));
      },

      async deleteTodo(id: number){
        await store.todosService.deleteTodo(id);

        patchState(store, (state) => ({
          todos: state.todos.filter(todo => todo.id !== id)
        }));
      },

      async updateTodo(id: number, completed: boolean){
        await store.todosService.updateTodo(id, completed);

        patchState(store, (state) => ({
          todos: state.todos.map(todo => {
            if (todo.id === id) {
              return {...todo, completed}
            }
            return todo;
          })
        }));
      },

      updateFilter(filter: TodosFilter){
        patchState(store, {filter});
      }

    })
  ),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      const todos = state.todos();

      switch (state.filter()) {
        case 'pending':
          return todos.filter(todo => !todo.completed);
        case 'completed':
          return todos.filter(todo => todo.completed);
        default:
          return todos;
      }
    })
  }))
)
