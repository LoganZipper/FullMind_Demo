import { Component, Input } from '@angular/core';
import { Task } from 'src/app/Task';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from 'src/app/services/task.service';
import { List, Storage } from 'src/constants';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task
  faTimes = faTimes;
  date = new Date();
  curDateInput = `${this.date.getFullYear()}-${this.date.getDate()}-${this.date.getMonth()}`;
  // isLast: boolean;

  constructor(private taskService: TaskService) {
    // const taskList = taskService.getTasks(this.task.storageIdx)
    // this.isLast = ((taskList.subscribe.length == (this.task.idx + 1)) && (this.task.storageIdx == List.OVERDUE))

  }

  /**
   * Remove a task from the reminder list.
   * Updates localStorage on removal
   * @param task
   */
  deleteTask(task: Task): void {
    this.taskService.deleteTask(task)
  }


  /**
   * Turn reminder textField into an input.
   * Allows user to ammend a created reminder.
   * @param parent A reference to the parent Div container
   */
  editReminderText(parent: HTMLDivElement) {
    console.log("Edit Reminder Text...")
    // Get input|header fields
    const staticText = parent.getElementsByTagName('h3')[0]
    const input = parent.getElementsByTagName('input')[0]

    staticText.style.display = "none"
    input.style.display = "inline-block"

    // Populate input w/ currently held text
    input.value = staticText.innerText.trim()
    input.focus()
  }

  /**
   * Turn reminder dateField into an input.
   * Allows user to ammend a created reminder.
   * @param parent A reference to the parent Div container
   */
  editReminderDate(parent: HTMLDivElement) {
    console.log("Edit Reminder Date...")
    // Get input|header fields
    const staticText = parent.getElementsByTagName('p')[0]
    const input = parent.getElementsByTagName('input')[1] // 1 for second input element (date)

    // Hide header, display input
    staticText.style.display = "none"
    input.style.display = "inline-block"

    console.log(`Inner Text: ${staticText.innerText.trim()}`)

    // Populate input w/ currently held text
    const splitArr = staticText.innerText.split('/')
    input.value = splitArr[2].trim().padStart(4,'0') + '-' + splitArr[0].trim().padStart(2,'0') + '-' + splitArr[1].padStart(2,'0') 
    input.focus()
  }

  /**
   * Turn reminder input back into a textField.
   * Overwrites a created reminder tag.
   * @param self A reference to the parent Div container
   * @param task The task which has been updated
   */
  saveReminderText(self: any, task: Task) {
    console.log("Save Reminder Text...")
    // Get input|header fields
    const staticText = self.getElementsByTagName("h3")[0]
    const input = self.getElementsByTagName("input")[0]

    // Hide input, display header
    staticText.style.display = "inline-block"
    input.style.display = "none"
  
    // Show updated text
    staticText.innerText = input.value

    // Overwrite actual task
    task.text = staticText.innerText

    // Now overwrite the actual localStorage list
    const storageString = this.taskService.getStorageStringByIndex(task.storageIdx)
    this.taskService.overwriteTaskList(storageString, this.taskService.getTaskListByEnum(storageString))
    this.taskService.updateLS()
  }

  /**
   * Turn reminder input back into a textField.
   * Overwrites a created reminder tag.
   * @param self A reference to the parent Div container
   * @param task The task which has been updated
   */
  saveReminderDate(self: any, task: Task) {
    console.log("Save Reminder Date...")
    // Get input|header fields
    const staticText = self.getElementsByTagName('p')[0]
    const input = self.getElementsByTagName('input')[1]

    // Validate given date
    try {
      const dateSplit = input.value.split("-")
      const formattedInput = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`  // Fomat returned initially is yyyy-dd-mm
      if(formattedInput == undefined)
        console.log("STOP")

      // Overwrite actual task
      task.day = formattedInput

      // Show updated text
      staticText.innerText = formattedInput

      // Now overwrite the actual localStorage list
      const storageString = this.taskService.getStorageStringByIndex(task.storageIdx)
      this.taskService.overwriteTaskList(storageString, this.taskService.getTaskListByEnum(storageString))
      this.taskService.updateLS()
    } catch(e) {
      console.log(e)
    }

    // Hide input, display header
    staticText.style.display = "inline-flexbox"
    input.style.display = "none"
  }
}

