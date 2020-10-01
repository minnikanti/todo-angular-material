import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { ToDo } from '../dto/todo';
import { BaseSearch } from '../dto/base.search';
import { environment } from 'src/environments/environment';
import { ToDoResponse } from '../dto/todo.response';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoUrl = environment.localUrl+"todo";

  httpHeaders = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET ToDo List from the server */
  /** POST: add a new hero to the server */
  getToDoList(search: BaseSearch): Observable<any> {
    const url = `${this.todoUrl}/list`;
    return this.http.post(url, search, this.httpHeaders);
    /*.pipe(
      tap((todoList: ToDo[]) => console.log(todoList)),
      catchError(this.handleError<ToDo>('addHero'))
    );*/
  }

  /** GET ToDo by id. Return `undefined` when id not found */
  getToDoNo404<Data>(id: number): Observable<ToDo> {
    const url = `${this.todoUrl}/complete?id=${id}`;
    return this.http.get<ToDoResponse>(url)
      .pipe(
        map(ToDoes => ToDoes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`${outcome} ToDo id=${id}`);
        }),
        catchError(this.handleError<ToDo>(`getToDo id=${id}`))
      );
  }

  saveTodo(todo: ToDo): Observable<ToDoResponse> {
    const url = `${this.todoUrl}/save`;
    return this.http.post<ToDoResponse>(url, todo, this.httpHeaders);
  }

  toggleComplete(id: number, completed: string): Observable<ToDoResponse> {
    const url = `${this.todoUrl}/complete?id=${id}&completed=${completed}`;
    return this.http.get<ToDoResponse>(url)
  }

  deleteItem(id: number): Observable<ToDoResponse> {
    const url = `${this.todoUrl}/delete/${id}`;
    return this.http.get<ToDoResponse>(url);
  }

  downloadAsFile(search: BaseSearch) {
    const url = `${this.todoUrl}/download`;
    return this.http.post(url, search, {responseType: 'blob'}).subscribe(data => {
      var blob = new Blob([data], {type: 'text/csv'});
      if(blob.size > 0) {
        saveAs(blob, 'ToDoList.csv');
      }
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
