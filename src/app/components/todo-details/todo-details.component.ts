import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { BaseSearch } from 'src/app/dto/base.search';
import { SearchCriteria } from 'src/app/dto/search.criteria';
import { ToDo } from 'src/app/dto/todo';
import { TodoService } from 'src/app/services/todo.service';
import { TodoDeleteDialogComponent } from '../todo-delete-dialog/todo-delete-dialog.component';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit, OnDestroy {

  sunscriber: any;
  id: number;
  todoSearch: BaseSearch;
  todo: ToDo;
  searchName: string;

  constructor(private route: Router, private router: ActivatedRoute, private todoService: TodoService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sunscriber = this.router.params.subscribe(params => {
      this.search(+params['id']); //Converts to Number
    });
  }

  private search(id: number) {
    this.id = id;
    if (this.id > 0) {
      this.todoSearch = BaseSearch.populateDefaultSearch();
      let searchCriteria: Array<SearchCriteria> = [];
      searchCriteria.push(new SearchCriteria("id", this.id, "EQUALS"));
      this.todoSearch.searchCriteria = searchCriteria;
      this.loadData();
    } else {
      this.todo = new ToDo();
      this.todo.id = this.id;
    }
  }

  private loadData() {
    this.todoService.getToDoList(this.todoSearch).subscribe(pageData => {
      this.todo = pageData.content[0];
      this.searchName = this.todo.name;
    });
  }

  toggleComplete(id: number, completed: string) {
    this.todoService.toggleComplete(id, completed).subscribe(todoResponse => {
      let markCompleteSnackBar = this.snackBar.open("Item status toggled successfully", "Undo", { duration: 4000 });
      markCompleteSnackBar.onAction().subscribe(() => {
        this.todoService.toggleComplete(id, completed === 'Y' ? 'N' : 'Y').subscribe(todoResponse => {
          this.loadData();
        });
      });
      this.loadData();
    });
  }

  openDeleteToDoDialog(todo: ToDo) {
    let deleteDialog = this.dialog.open(TodoDeleteDialogComponent, { data: todo });
    deleteDialog.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteItem(todo.id).subscribe(todoResponse => {
          this.route.navigateByUrl('/todo');
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sunscriber.unsubscribe();
  }

  populateSearchForAutoPopulate(value: string): BaseSearch {
    let search = BaseSearch.populateDefaultSearch();
    let searchCriteria: Array<SearchCriteria> = [];
    searchCriteria.push(new SearchCriteria("name", value, "LIKE"));
    search.searchCriteria = searchCriteria;
    return search;
  }

  searchMoviesCtrl = new FormControl();
  filteredValue: any;
  isLoading = false;

  ngAfterViewInit() {
    this.searchMoviesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredValue = [];
          this.isLoading = true;
        }),
        switchMap(value => this.todoService.getToDoList(this.populateSearchForAutoPopulate(value))
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredValue = data.content;
        if (this.filteredValue.length == 1)
          this.search(this.filteredValue[0].id);
        else
          this.todo = new ToDo();
      });
  }

}
