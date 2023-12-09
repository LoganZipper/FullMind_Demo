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
  actuallyUsefulCount = 0;
  taskListIdx = 0;
  date = new Date();
  curDateInput = `${this.date.getFullYear()}-${this.date.getDate()}-${this.date.getMonth()}`;

  constructor(private taskService: TaskService) {
    this.actuallyUsefulCount++;
    this.taskListIdx = this.actuallyUsefulCount;
  }

  ngOnInit(): void {
    if(!TasksComponent.count)
      TasksComponent.count = 0;
    TasksComponent.count += 1;
    
    // This line needs to be reviewed tbh
    // this.taskService.getTasks(TasksComponent.count).subscribe((tasks) => this.tasks = tasks);
    this.taskService.getTasks(LOAD_ORDER[TasksComponent.count]).subscribe((tasks) => this.tasks = tasks);
    if(LOAD_ORDER[TasksComponent.count] == List.OVERDUE) {
       // Somehow remove the new task entrypoint
    }

  }

  /**
   * Add a new task to a reminders list.
   * @param addItem a self reference containing parent task list index
   */
  addTask(addItem: any): void {

    // Don't question this. It works
    // ngContext seems to start at 3 and increment upward.
    // This is how we get the index of the correct card
    console.log(addItem)
    const taskListIndex = addItem.__ngContext__ - 3
    console.log(taskListIndex)
    
    // Get HTML inputs
    const inputElement = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('taskInput'))[taskListIndex]
    const dateElement = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('taskDate'))[taskListIndex]
    // Get task list index
    const adjustedIndex = LOAD_ORDER[taskListIndex+1] // if DEFAULT ever gets set to 0, this wont need the plus 1!

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
