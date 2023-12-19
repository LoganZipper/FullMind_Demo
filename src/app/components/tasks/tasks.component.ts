import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/Task';
import { TaskService } from 'src/app/services/task.service';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { LOAD_ORDER, List } from 'src/constants';
import { count } from 'rxjs';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  // @Input() today!: string
  tasks: Task[] = [];
  faAdd = faAdd
  OVERDUE_IDX: number = List.OVERDUE
  static count: number = 0;
  actuallyUsefulCount: number = 0;
  taskListIdx = 0;
  date = new Date();
  curDateInput = `${this.date.getFullYear()}-${this.date.getDate()}-${this.date.getMonth()}`;

  constructor(private taskService: TaskService) {
    // this.actuallyUsefulCount++;
    // this.taskListIdx = this.actuallyUsefulCount;
  }

  ngOnInit(): void {
    if(!TasksComponent.count)
      TasksComponent.count = 0;
    TasksComponent.count += 1;
    
    this.actuallyUsefulCount = TasksComponent.count
    // This is gucci AF... but
    //  Maybe do better presentation of LOAD_ORDER(?)
    //  Could Enums represent what the currently defined LOAD ORDER is?
    //  Certain components are reliant on this NEVER changing
    this.taskService.getTasks(LOAD_ORDER[TasksComponent.count]).subscribe((tasks) => this.tasks = tasks);
  }

  /**
   * Add a new task to a reminders list.
   * @param listIdx Index of affected task list
   */
  addTask(listIdx: number): void {

    // Get list index like a G
    //  (used to do it like a bitch) 
    listIdx = listIdx - 1
    
    // Get HTML inputs
    const inputElement = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('taskInput'))[listIdx]
    const dateElement = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('taskDate'))[listIdx]
    // Get task list index
    const adjustedIndex = LOAD_ORDER[listIdx+1] // if DEFAULT ever gets set to 0, this wont need the plus 1!

    // Read input data
    const htmlInput = inputElement.value.trim();
    const htmlDate = dateElement.value;

    // Reset HTML fields
    inputElement.value = ''
    dateElement.value = ''

    // Set focus to new reminder input
    // Allows quick addition of multiple reminders
    inputElement.focus()

    // Guard against null data entry
    if(htmlInput.length < 1) 
      return;
      
    // Logic for adding a reminder with a date
    if(htmlDate !== undefined && htmlDate !== '') 
      try {
        const date = new Date(htmlDate)
        const dateSplit = htmlDate.split("-")
        const formattedInput = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`  // Fomat returned initially is yyyy-dd-mm
        const newTask: Task = {idx:-1, storageIdx:adjustedIndex, text: htmlInput, day: formattedInput}
        // this.taskService.addTask(adjustedIndex, newTask)
        this.taskService.addTask(newTask)
      } catch(e) {
        console.log(e)
      }
    // Logic for adding a time-insensitive reminder
    else {
      const newTask: Task = {idx:-1, storageIdx: adjustedIndex, text: htmlInput}
      this.taskService.addTask(newTask)
    }
    // Potentially refresh lists?
    // this.taskService.getTasks()
  }
}
