import { List } from 'src/constants';
import { Task } from './Task'

export const DEFAULT: Task[] = [
  {
    idx: 0,
    storageIdx: List.DEFAULT,
    text: "Normal reminders can go down here"
  },
  {
    idx: 1,
    storageIdx: List.DEFAULT,
    text: 'Reminders can also have dates!',
    day: '1/1/2099'
  },
  {
    idx: 2,
    storageIdx: List.DEFAULT,
    text: 'Overdue reminders will go to the OVERDUE section ->',
  }
];

export const IMPORTANT: Task[] = [
  {
    idx: 0,
    storageIdx: List.IMPORTANT,
    text: 'Howdy there stranger!'
  },
  {
    idx: 1,
    storageIdx: List.IMPORTANT,
    text: 'Important reminders go up here',
  },
  {
    idx: 2,
    storageIdx: List.IMPORTANT,
    text: "Delete using the 'X' -->"
  }];

export const OVERDUE: Task[] = [
  {
    idx: 0,
    storageIdx: List.OVERDUE,
    text: 'Overdue Reminder!',
    day: '1/1/1970'
  },
  {
    idx: 1,
    storageIdx: List.OVERDUE,
    text: "You can't make reminders here"
  },
  {
    idx: 2,
    storageIdx: List.OVERDUE,
    text: "They'll come here automatically!"
  }
];

export const TEST: Task[] = [
  {
    idx: 1,
    storageIdx: List.TEST,
    text: '<< ERROR >>'
  }];


// |  1  |   Default   |  [{"idx":0, "storageIdx":1,"text":"Sample Default","day":"05/05/2025"},{"idx":1, "storageIdx":1, "text":"New Task","day":"06/13/2025"},{"idx":2, "listIdx":1,"text":"Making a new reminder"}]
// |  2  |  Important  |  [{"idx":0, "storageIdx":2,"text":"Sample Important","day":"08/22/2025"},{"idx":1, "storageIdx":2,"text":"Sample Reminder 2","day":"04/22/2026"},{"idx":2, "storageIdx":2, "text":"Extra Reminder"}]
// |  3  |   Overdue   |  [{"idx":0, "storageIdx":3,"text":"Sample Overdue","day":"05/05/2004"},{"idx":1, "storageIdx":3,"text":"Sample Reminder 2","day":"10/21/2021"}]

// Potential future format: {storageIdx:X,[{task},{task}]}
//  - One index value for entire list
//  - (CON) Could be messed with more easily
//  - (PRO) Could be experimented with more easily
//  -
//  - (PRO) Shortens necessary code for adding a new task
//  - (CON) Could completely undermine everything I've done up until this point

//  - (PRO) Even if no tasks exist, the storageIdx will always be present, instead of a simple blank array