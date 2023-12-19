import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { List } from 'src/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visiblePercent: number = 90
  hiddenPercent: number = 10
  isUpdated = false;
  OVERDUE_LIST = 2

  constructor(private taskService: TaskService) {
    // Ensure user is prepped for app
    this.taskService.intializeUser()
  }

  /**
   * Expand tasklist when clicked on
   * @param listIdx Index of selected tasklist
   */
  focusList(listIdx: number) {
    console.log(`Selected pane: ${listIdx}`)

    const idx = listIdx - 1
    const inputs = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('vertical'))
    const visibleList = inputs[idx]
    const hiddenList = inputs[(1 - idx)]

    // Remove highlight from overdue list when clicked
    if(listIdx == this.OVERDUE_LIST && visibleList.classList.contains('highlight'))
      visibleList.classList.remove('highlight')

    this.listAnimation(visibleList, hiddenList)

    const tasksHTML = (<HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('task'))

    if(listIdx == List.OVERDUE)
      tasksHTML[tasksHTML.length-1].style.borderBottom = "none"
    else if(listIdx == List.DEFAULT)
      tasksHTML[tasksHTML.length-1].style.borderBottom = "1px rgba(245, 255, 250, 0.4) solid"
  }

  /**
   * Change Visible list. Currently has no real animation. Maybe next year...
   * @param visibleList List to BE MADE visible (currently hidden)
   * @param hiddenList  List to BE MADE hidden (currently visible)
   */
  listAnimation(visibleList: HTMLInputElement, hiddenList: HTMLInputElement) {    
    
    //NOT ACTUALLY DOING THE ANIMATION FUCK YOU
    
    // this.animateWidth(visibleList, hiddenList, this.visiblePercent)

    visibleList.style.width = (this.visiblePercent + "%")
    hiddenList.style.width = (this.hiddenPercent + "%")

    const hiddenContents = (<HTMLCollectionOf<HTMLInputElement>>hiddenList.children)
    const visibleContents = (<HTMLCollectionOf<HTMLInputElement>>visibleList.children)
    for(let i = 0; i < hiddenContents.length; i++)
      hiddenContents[i].style.display = "none"
    for(let i = 0; i < hiddenContents.length; i++)
      visibleContents[i].style.display = "block"
  }

  /**
   * Function which actually performs width animation on lists to smoothly transistion to the new view.
   * Currently does absolutely fucking nothing. It's a piece of shit entirely.
   * @param visibleList The list to be made visible
   * @param hiddenList  The list to be hidden
   * @param endWidth    The percentage width the visible tasklist should occupy (90% default)
   */
  animateWidth(visibleList: HTMLInputElement, hiddenList: HTMLInputElement, endWidth: number) {
    const widthIncrementAmt = 0.5
    visibleList.style.width = this.hiddenPercent + "%"
    hiddenList.style.width = this.visiblePercent + "%"

    const id = setInterval(frame, 1);
    Promise.resolve(id).then(() => console.log("Animation Finished"))

    function frame() {
      if (parseFloat(visibleList.style.width.replace("%","")) >= endWidth) 
        clearInterval(id);
      else 
      {
        console.log(visibleList.style.width)
        console.log(visibleList.style.width.replace("%",""))

        visibleList.style.width = (parseFloat(visibleList.style.width.replace("%","")) + widthIncrementAmt) + "%" // This is so gross wtf
        hiddenList.style.width = (parseFloat(hiddenList.style.width.replace("%","")) - widthIncrementAmt) + "%" // This is so gross wtf
      }
    }
  }

  /**
   * Function which actually performs height animation on lists to smoothly transistion to the new view.
   * Currently does absolutely fucking nothing. It's a piece of shit entirely.
   * @param curVisibleHeight Current height of tasklist view. Incremented until endHeight reached
   * @param endHeight Desired height of final displayed tasklist view.
   */
  animateHeight(curVisibleHeight: number, endHeight: number) {
    var id = setInterval(frame, 5);
    const heightIncrementAmt = 0.5;

    function frame() {
      if (curVisibleHeight == endHeight) 
        clearInterval(id);
      else
        curVisibleHeight += heightIncrementAmt
    }
  }
}