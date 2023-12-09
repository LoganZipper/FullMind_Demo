import { Component, Input } from '@angular/core';
import { Task } from 'src/app/Task';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task
  faTimes = faTimes;

  constructor(private taskService: TaskService) {}

  /**
   * Remove a task from the reminder list.
   * Updates localStorage on removal
   * @param task
   */
  deleteTask(task: Task): void {
    this.taskService.deleteTask(task)
    // // Get index of parent task list
    // const storageIdx = task.storageIdx
    // // Guard against illegal deletion
    // if(storageIdx == -1)
    //   return;


    // this.taskService.getTasks(storageIdx).subscribe(tasks => {
    //   // Get index of selected task 
    //   const removeIdx = task.idx
    //   // Guard against illegal deletion
    //   if(removeIdx === -1)
    //     return
    //   // Remove task
    //   tasks.splice(removeIdx,1)

    //   // Reindex elements
    //   for(let i = removeIdx;i<tasks.length;i++) {
    //     const count = i - removeIdx
    //     const task = tasks.at(i)
    //     if(task)
    //       task.idx = i
    //   }
    //   // Update Local Storage
    //   const storageString = this.taskService.getStorageByIndex(storageIdx);
    //   localStorage.setItem(storageString, JSON.stringify(tasks))
    //   // Refresh lists
    //   this.taskService.getTasks(storageIdx)
    // })
  }


  /**
   * Turn reminder textField into an input.
   * Allows user to ammend a created reminder.
   * Currently does not allow date changes
   * @param self A reference to the parent Div container
   */
  editReminder(self: any) {
    // Get input|header fields
    const staticText = self.getElementsByTagName("h3")[0]
    const input = self.getElementsByTagName("input")[0]

    // Hide header, display input
    staticText.style.display = "none"
    input.style.display = "block"

    // Populate input w/ currently held text
    input.value = staticText.innerText.trim()
    input.focus()

    // Update Overdue TaskList
    this.taskService.periodicUpdate()
  }

  /**
   * Turn reminder input back into a textField.
   * Overwrites a created reminder tag.
   * @param self A reference to the parent Div container
   */
  saveReminder(self: any, task: Task) {
    // Get input|header fields
    const staticText = self.getElementsByTagName("h3")[0]
    const input = self.getElementsByTagName("input")[0]

    // Hide input, display header
    staticText.style.display = "block"
    input.style.display = "none"
  
    // Show updated text
    staticText.innerText = input.value
  }
}
