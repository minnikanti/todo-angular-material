import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToDo } from 'src/app/dto/todo';

@Component({
  selector: 'app-todo-delete-dialog',
  templateUrl: './todo-delete-dialog.component.html',
  styleUrls: ['./todo-delete-dialog.component.css']
})
export class TodoDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public todo: ToDo) { }

  ngOnInit(): void {
  }

}
