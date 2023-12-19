import { Injectable } from '@angular/core';
import { Task } from '../Task';
import { DEFAULT, OVERDUE, IMPORTANT, TEST } from '../mock-tasks';
import { LOAD_ORDER, List, Storage } from 'src/constants';
import { Observable, of } from 'rxjs';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  idxTest = 0

  constructor() {
   }

   // Takes Local Storage JSON String and converts to Task array
   parseLSStringToTasks(importedString: string): Task[] {

    // console.log(`Imported List: ${importedString}`)
    try {
      return JSON.parse(importedString)
    } catch (e) {
      console.log("Don't feed localStorage garbage.\nResetting...")
      return []
    }
   }


   /**
    * Overwrites requested Task list with an imported list from localk
    * @param storageString String of requested Task list
    * @param importedList localStorage list to overwrite
    */
   overwriteTaskList(storageString: string, importedList: Task[]): void {
    // Get OG list to overwrite
    const baseList = this.getTaskListByEnum(storageString);
    const importedCopy: Task[] = JSON.parse(JSON.stringify(importedList))

    baseList.length = 0
    importedCopy.forEach(i => baseList.push(i))
    
    // console.log(`Final Tasks: ${baseList}`)
   }

   /**
    * Overwrites localStorage w/ current taskLists
    */
   updateLS() {
    localStorage.setItem(Storage.DEFAULT, JSON.stringify(DEFAULT))
    localStorage.setItem(Storage.IMPORTANT, JSON.stringify(IMPORTANT))
    localStorage.setItem(Storage.OVERDUE, JSON.stringify(OVERDUE))
   }


  /**
  * Ensure user has localStorage fields.
  * Also validates existing localStorage.
  * In future, may be able to repair & reindex broken localStorages.
  */
  intializeUser() {
    // ----------<<< CREATE NEW LOCALSTORAGES >>>---------- \\

    // Create new IMPORTANT
    if(!localStorage.getItem(Storage.IMPORTANT)) {
      localStorage.setItem(Storage.IMPORTANT, JSON.stringify(IMPORTANT))
    } else {
      try {
        // const curLocalTasks = localStorage.getItem(Storage.IMPORTANT)
        this.manuallyParseLS(Storage.IMPORTANT)
      } catch(e) {
        // Call separate function to manually parse through items 
        //    and identify problematic objects
        // If possible, remove singular instances & save majority of list
      }
    }

    // Create new DEFAULT
    if(!localStorage.getItem(Storage.DEFAULT))
      localStorage.setItem(Storage.DEFAULT, JSON.stringify(DEFAULT))

    // Create new OVERDUE
    if(!localStorage.getItem(Storage.OVERDUE))
      localStorage.setItem(Storage.OVERDUE, JSON.stringify(OVERDUE))
  }

  /**
   * If localStorage is unable to be parsed,
   *  use this function to parse JSON manually
   *  and save the list as a whole
   */
  manuallyParseLS(storageString: string): void {

    console.log(`<<< VERIFYING '${storageString}' STORAGE >>>`)

    // Identify if entire array exists
    //  * * *

    let storageJSON = localStorage.getItem(storageString)
    
    if(storageJSON == null)
      return

    const arrStart = storageJSON.indexOf('[')
    const arrEnd = storageJSON.indexOf(']')

    console.log(`Start of array located at index ${arrStart}`)
    console.log(`End of array located at index ${arrEnd}`)

    let objCount = 0 
    // while(storageSubstring.length > 0) 
    {
      objCount++;
      let curObjBeginIdx = storageJSON.indexOf('{')
      let curObjEndIdx = storageJSON.indexOf('}')

      console.log(`Task '{' located at index ${curObjBeginIdx}`)
      console.log(`Task '}' located at index ${curObjEndIdx}`)
      console.log(`Task: ${storageJSON.substring(curObjBeginIdx, curObjEndIdx+1)}`)
    }

    // 'If' conditional for if there is lost info between arrStart->init curIdx

    //  * * *

    // Identify valid existing task entries 

    console.log(`<<< COMPLETED '${storageString}' VERIFICATION >>>`)
  }

   
   /**
    * @param taskIdx Index of requested Task list
    * @returns Requested Task list as an observable
    */
  getTasks(taskIdx: number): Observable<Task[]> {
    let tasks: Observable<Task[]>;
    switch(taskIdx) {
      case List.DEFAULT: 
              if(localStorage.getItem(Storage.DEFAULT)) {
                // Get localStorage string
                let importedString = localStorage.getItem(Storage.DEFAULT)
                
                // Create empty JSON list if DNE
                if(!importedString) importedString = "{}"

                // Get Task[] and write to localStorage (redundancy & cleaning)
                const importedList = this.parseLSStringToTasks(importedString);
                this.overwriteTaskList(Storage.DEFAULT, importedList);
              } 
              console.log(JSON.stringify(DEFAULT))
              tasks = of(DEFAULT)
              break;
      case List.OVERDUE: 
              if(localStorage.getItem(Storage.OVERDUE)) {
                // Get localStorage string
                let importedString = localStorage.getItem(Storage.OVERDUE)
                
                // Create empty JSON list if DNE
                if(!importedString) importedString = "{}"

                // Get Task[] and write to localStorage (redundancy & cleaning)
                const importedList = this.parseLSStringToTasks(importedString);
                this.overwriteTaskList(Storage.OVERDUE, importedList);
              }
              tasks = of(OVERDUE);
              break;
      case List.IMPORTANT: 
              if(localStorage.getItem(Storage.IMPORTANT)) {
                // Get localStorage string
                let importedString = localStorage.getItem(Storage.IMPORTANT)
                
                // Create empty JSON list if DNE
                if(!importedString) importedString = "{}"

                // Get Task[] and write to localStorage (redundancy & cleaning)
                const importedList = this.parseLSStringToTasks(importedString);
                this.overwriteTaskList(Storage.IMPORTANT, importedList);
              } 
              tasks = of(IMPORTANT);
              break;
      default:
              console.log("Went to Default")
              tasks = of(DEFAULT);
              break;
    }
    // const tasks = of(TASKS);

    return tasks;
  }

  
  /**
   * Adds task to associated parent Task list and saves to localStorage
   * @param task New task
   */
  addTask(task: Task): void {
    // const tasks = this.getTasks(taskListIdx)
    if(task.idx === -1)
      task.idx = this.getNextIndex(task.storageIdx)
    
    const tasks = this.getTasks(task.storageIdx)
    
    tasks.subscribe(tasks => {
      // Add the task
      tasks.push(task)
      
      // Store new task list in localStorage
      const storageString = this.getStorageStringByIndex(task.storageIdx)
      localStorage.setItem(storageString, JSON.stringify(tasks))
    })
    // Update Overdue TaskList
    this.periodicUpdate()
  }

  /**
   * Remove a task from the list defined by it's 'storageIdx' property
   * @param task Task to be removed
   */
  deleteTask(task: Task): void {
    // Get index of parent task list
    const storageIdx = task.storageIdx
    // Guard against illegal deletion
    if(storageIdx == -1)
      return;


    this.getTasks(storageIdx).subscribe(tasks => {
      // Get index of selected task 
      const removeIdx = task.idx
      // Guard against illegal deletion
      if(removeIdx === -1)
        return
      // Remove task
      tasks.splice(removeIdx,1)
      // Reindex elements
      this.reindexTaskList(this.getStorageStringByIndex(storageIdx))
      // Update Local Storage
      const storageString = this.getStorageStringByIndex(storageIdx);
      localStorage.setItem(storageString, JSON.stringify(tasks))
      // Refresh lists
      this.getTasks(storageIdx)
    })
    // Update Overdue TaskList
    this.periodicUpdate()
  }

  /**
   * Move a task from one list to another. Generally used to move tasks to overdue list
   * @param task Task to be moved
   * @param storageString STORAGE enum of list to move task into
   */
  moveTask(task: Task, storageString: string): void {
    console.log("<<< MOVING TASK >>>")
    console.log("Move " + this.getStorageStringByIndex(this.getTaskParent(task)) + " -> " + this.getTaskListByEnum(storageString))
    const originString = this.getStorageStringByIndex(task.storageIdx)
    const orginIdx = task.storageIdx
    // ---<<< MOVE TASK >>>--- \\

    // This line is just stupid. Holy shit
    const originList: Task[] = this.getTaskListByEnum(this.getStorageStringByIndex(this.getTaskParent(task)));
    this.deleteTask(task)

    // Reassign storage index to overdue list
    task.storageIdx = this.getStorageIndexByString(storageString)
    // Add reassigned task to overdue list 
    // (we'll still do this dynamically tho)
    this.addTask(task)

    // Update modified localStorage JSON
    localStorage.setItem(originString, JSON.stringify(originList))
    localStorage.setItem(storageString, JSON.stringify(this.getTaskListByEnum(storageString)))

    console.log("<<< TASK MOVED (hopefully) >>>")
  }

  /**
   * A method to send expired tasks to the overdue list
   */
  periodicUpdate(): void {
    let isDefaultUpdated = false;
    let isImportantUpdated = false;
  
    // Refresh tasks - Check LocalStorage
    for(let i = 1; i <= 3; i++)
      this.getTasks(i)

    // Update Overdue tasks
    isDefaultUpdated = this.updateOverdue(this.getTaskListByEnum(Storage.DEFAULT))
    isImportantUpdated = this.updateOverdue(this.getTaskListByEnum(Storage.IMPORTANT))

    if(isDefaultUpdated || isImportantUpdated) {
      const overdueList = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('vertical'))[1]

      overdueList.classList.add('highlight')
  }
}

  /**
   * Check taskLists for overdue reminders and moves them accordingly
   * @param taskList 
   */
  updateOverdue(taskList: Task[]): boolean {
    console.log("<<< START UPDATE FUNCTION >>>")

    let result = false;
    const todayDate = new Date()

    taskList.forEach(t => {
      // Skip if no date
      if(t.day == undefined)
        return

      try {
        // Get date of task (bad date -> exception)
        const taskDate = new Date(t.day)
        // Move task if date was before today
        if(todayDate > taskDate) {
          this.moveTask(t, Storage.OVERDUE)
          result = true;  // Mark that at least 1 task was moved
        }
      } catch (e) {
        console.log("Caught invalid date")
      } 
    })
    console.log("<<< END UPDATE FUNCTION >>>")
    return result // 0=no_change | 1=some_change
  }

  /**
   * Given a storageString, reindexes all elements in a list.
   * Starts at 0. Entire list is checked
   * @param storageString Enum of localStorage key
   */
  reindexTaskList(storageString: string): void {
    // Reindex elements
    const tasks = this.getTaskListByEnum(storageString)
    for(let i = 0;i<tasks.length;i++) {
      const task = tasks.at(i)
      if(task)
        task.idx = i
    }
  }

  /**
   * @param task Selected Task
   * @returns Requested parent task list index
   */
  getTaskParent(task: Task) {
    let found = -1;

    if(DEFAULT.includes(task))
      found = List.DEFAULT
    
    if(IMPORTANT.includes(task))
      found = List.IMPORTANT
    
    if(OVERDUE.includes(task))
      found = List.OVERDUE

    return found;
   }

   /**  
    * Returns the associated storageString for a given TaskList index
    * @param storageIdx Index of desired Task list
    * @returns Storage string of desired Task list
    */
   getStorageStringByIndex(storageIdx: number): string {
    switch(storageIdx) {
      case List.DEFAULT:
        return Storage.DEFAULT
      case List.IMPORTANT:
        return Storage.IMPORTANT
      case List.OVERDUE:
        return Storage.OVERDUE
      case List.TEST:
        return Storage.OVERDUE
      default:
        return Storage.DEFAULT
    }
   }

   /**
    * Retrieves the index of a taskList from it's storageString values
    * @param storageString StorageString of associated taskList
    * @returns TaskList index
    */
   getStorageIndexByString(storageString: string): number {
    switch(storageString) {
      case Storage.DEFAULT:
        return List.DEFAULT
      case Storage.IMPORTANT:
        return List.IMPORTANT
      case Storage.OVERDUE:
        return List.OVERDUE
      case Storage.TEST:
        return List.OVERDUE
      default:
        return List.DEFAULT
    }
   }

   /**
    * @param storageIdx Index of desired Task list
    * @returns Next available index for use within the specified Task list
    */
   getNextIndex(storageIdx: number): number {
    switch(storageIdx) {
      case List.DEFAULT:
        return this.getTaskListByEnum(Storage.DEFAULT).length
      case List.IMPORTANT:
        return this.getTaskListByEnum(Storage.IMPORTANT).length
      case List.OVERDUE:
        return this.getTaskListByEnum(Storage.OVERDUE).length
      case List.TEST:
        return this.idxTest
      default:
        return this.getTaskListByEnum(Storage.DEFAULT).length
    }
   }

   /**
    * @param listString Storage value of desired internal Task list
    * @returns Desired in-memory Task list
    */
   getTaskListByEnum(listString: string): Task[] {
    switch(listString) {
      case Storage.DEFAULT:
        return DEFAULT;
      case Storage.IMPORTANT:
        return IMPORTANT;
      case Storage.OVERDUE:
        return OVERDUE;
    }
    // In Case of Invalid Index (or missing localStorage)
    return DEFAULT
   }
}