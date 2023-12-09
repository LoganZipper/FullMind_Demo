import { Component } from '@angular/core';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "fullmind_demo"
  visiblePercent: number = 90
  hiddenPercent: number = 10
  isUpdated = false;
  OVERDUE_LIST = 2

  constructor(private taskService: TaskService) {
    // Ensure user is prepped for app
    this.taskService.intializeUser()
  }

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
  }

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


  animateWidth(visibleList: HTMLInputElement, hiddenList: HTMLInputElement, endWidth: number) {
    const widthIncrementAmt = 0.5
    visibleList.style.width = this.hiddenPercent + "%"
    hiddenList.style.width = this.visiblePercent + "%"

    const id = setInterval(frame, 1);
    Promise.resolve(id).then(() => console.log("Animation Finished"))

    function frame() {
      if (parseFloat(visibleList.style.width.replace("%","")) >= endWidth) 
      {
        clearInterval(id);
      } 
      else 
      {
        console.log(visibleList.style.width)
        console.log(visibleList.style.width.replace("%",""))

        visibleList.style.width = (parseFloat(visibleList.style.width.replace("%","")) + widthIncrementAmt) + "%" // This is so gross wtf
        hiddenList.style.width = (parseFloat(hiddenList.style.width.replace("%","")) - widthIncrementAmt) + "%" // This is so gross wtf
      }
    }
  }

  animateHeight(curVisibleHeight: number, endHeight: number) {
    var id = setInterval(frame, 5);
    const heightIncrementAmt = 0.5

    function frame() {
      if (curVisibleHeight == endHeight) 
      {
        clearInterval(id);
      } 
      else
      {
        curVisibleHeight += heightIncrementAmt
      }
    }
  }
}