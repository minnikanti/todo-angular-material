import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { TodoComponent } from './components/todo/todo.component';
import { TodoService } from './services/todo.service';
import { TodoAddDialogComponent } from './components/todo-add-dialog/todo-add-dialog.component';
import { TodoDeleteDialogComponent } from './components/todo-delete-dialog/todo-delete-dialog.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoAddDialogComponent,
    TodoDeleteDialogComponent,
    TodoDetailsComponent
  ],
  entryComponents: [
    TodoAddDialogComponent,
    TodoDeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
