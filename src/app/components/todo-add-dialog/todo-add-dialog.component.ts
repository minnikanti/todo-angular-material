import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToDo } from 'src/app/dto/todo';
import { TodoService } from 'src/app/services/todo.service';
import { DateHelper } from 'src/app/utils/date.helper';

@Component({
  selector: 'app-todo-add-dialog',
  templateUrl: './todo-add-dialog.component.html',
  styleUrls: ['./todo-add-dialog.component.css']
})
export class TodoAddDialogComponent implements OnInit {

  public todoForm: FormGroup;
  wasFormChanged = false;
  todo: ToDo;
  action: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private formBuilder: FormBuilder, private todoService: TodoService){ }

  public ngOnInit(): void {
    this.todo = this.data.todo;
    this.action = this.data.action;
    if(this.todo.id != null) {
    console.log(this.todo.expireDate);
    console.log(this.todo.expireDate.substring(10,6));
    console.log(this.todo.expireDate.substring(5,3));
    console.log(this.todo.expireDate.substring(0,2));
    }
    this.todoForm = this.formBuilder.group({
      'name': [this.todo.name, [Validators.required, Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      'description': [this.todo.description, Validators.required],
      'expireDate': [new Date(), Validators.required]
    });
  }
  /*'expireDate': [new Date(Number(this.todo.expireDate.substring(10,6)),
    Number(this.todo.expireDate.substring(5,3)),
    Number(this.todo.expireDate.substring(0,2))), Validators.required]*/

  public addToDo(): void {
    this.markAsDirty(this.todoForm);
    let todo = this.todoForm.value;
    todo.id = this.todo.id;
    todo.isCompleted = this.todo.isCompleted == null ? 'N' : this.todo.isCompleted;
    todo.expireDate = DateHelper.getFormattedDate(todo.expireDate, 'MM-dd-yyyy');
    this.todoService.saveTodo(todo).subscribe(todoResponse => {
      this.closeDialog();
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }

}
