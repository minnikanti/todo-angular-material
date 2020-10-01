import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BaseSearch } from 'src/app/dto/base.search';
import { ToDo } from 'src/app/dto/todo';
import { TodoService } from 'src/app/services/todo.service';
import { TodoAddDialogComponent } from '../todo-add-dialog/todo-add-dialog.component';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoDeleteDialogComponent } from '../todo-delete-dialog/todo-delete-dialog.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoSearch: BaseSearch;
  todoList: ToDo[];
  resultsLength = 0;
  isLoadingResults = true;
  displayedColumns: string[] = ['id', 'name', 'description', 'expireDate', 'actions'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private todoService: TodoService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.todoSearch = BaseSearch.populateDefaultSearch();
  }

  downloadToDoList() {
    this.todoService.downloadAsFile(this.todoSearch);
  }

  private updateSearchCriteria(): void {
    this.todoSearch.sortField = this.sort.active;
    this.todoSearch.sortType = this.sort.direction;
    this.todoSearch.pageIndex = this.paginator.pageIndex;
  }

  toggleComplete(id: number, completed: string) {
    this.todoService.toggleComplete(id, completed).subscribe(todoResponse => {
      let markCompleteSnackBar = this.snackBar.open("Item status toggled successfully", "Undo", {duration: 4000});
        markCompleteSnackBar.onAction().subscribe(() => {
          this.todoService.toggleComplete(id, completed === 'Y' ? 'N' : 'Y').subscribe(todoResponse => {
          this.refreshTable();
        });
      });
      this.refreshTable();
    });
  }

  openAddToDoDialog(todo: any, action: string) {
    if(todo == null) todo = new ToDo();
    let editDialog = this.dialog.open(TodoAddDialogComponent, { data: {"todo": todo, "action":action }});
    editDialog.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }

  openDeleteToDoDialog(todo: ToDo) {
    let deleteDialog = this.dialog.open(TodoDeleteDialogComponent, {data: todo});
    deleteDialog.afterClosed().subscribe(result => {
      if(result) {
        this.todoService.deleteItem(todo.id).subscribe(todoResponse => {
          this.refreshTable();
        });
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.updateSearchCriteria();
          return this.todoService.getToDoList(this.todoSearch);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.totalElements;

          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.todoList = data);
  }
}
