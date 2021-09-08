import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit
} from "@angular/core";
import {fromEvent} from "rxjs";


@Component({
  selector:'app-timer',
  templateUrl:'./timer.component.html',
  styleUrls:["./timer.component.css"]
})
export class TimerComponent implements OnInit,AfterViewInit{
  //Create class time properties
  minutes:any
  seconds:any
  //Create boolean properties,which provide information about state of timer
  isStarted:any
  isStopped:any
  //Create interval property,that we will use to reset our timer
  intervalID:any
  //Create specific properties for our wait method
  firstWaitClick:any
  waitClicksCount:any

  //Create observables,which give us an ability to maintain events
  startTimerObservable:any
  waitTimerObservable:any
  resetTimerObservable:any

  //Import button
  @ViewChild("startstopbtn") start_stop_btn:any
  @ViewChild("waitbtn") wait_btn:any
  @ViewChild("resetbtn") reset_btn:any

  //Define our main properties
  ngOnInit() {
      this.minutes = 0
      this.seconds = 0
      this.isStarted = false
      this.isStopped = true
      this.waitClicksCount = 0
  }

  //Define observables
  ngAfterViewInit(){
    this.startTimerObservable = fromEvent(this.start_stop_btn.nativeElement,"click").subscribe(()=>{
      this.isStopped = !this.isStopped
      if(!this.isStopped){
        this.start();
      }else{
        this.stop();
      }
    })
    this.waitTimerObservable = fromEvent(this.wait_btn.nativeElement,"click").subscribe(()=>{
      setTimeout(()=>{
        this.waitClicksCount = 0
      },500)
      if(this.waitClicksCount === 0){
        this.firstWaitClick = new Date().getTime()
        this.waitClicksCount++
      }else if(this.waitClicksCount === 1){
        if(this.checkTimeBetweenTwoClicks(this.firstWaitClick)){
          this.wait()
        }
        this.waitClicksCount = 0
      }
    })
    this.resetTimerObservable = fromEvent(this.reset_btn.nativeElement,"click").subscribe(()=>{
      this.reset();
    })
  }


  start(){
    this.isStarted = true
    this.checkBtns()
    if(!this.isStopped){
      this.intervalID = setInterval(()=>{
        this.seconds++
        if(this.seconds === 59){
          this.seconds = 0
          this.minutes++
        }
      },1000)
    }
  }

  stop(){
    this.isStarted = false
    this.checkBtns()
    clearInterval(this.intervalID)
    this.minutes = 0
    this.seconds = 0
  }
  wait(){
    this.isStarted = false
    this.isStopped = true
    this.checkBtns()
    clearInterval(this.intervalID)
  }
  reset(){
    this.isStarted = true
    this.checkBtns()
    this.stop()
    this.start()
  }

  //If number is less than 10,add extra 0 in front of number
  convertTime(num:number):string{
    if(num < 10){
      return `0${num}`
    }
    return num.toString()
  }

  //Change start/stop button color
  checkBtns(){
    const startBtn = document.querySelector("#start_stop_btn")
    if(startBtn){
      if(this.isStarted){
        startBtn.classList.remove("start-btn")
        startBtn.classList.add("stop-btn")
      }else {
        startBtn.classList.remove("stop-btn")
        startBtn.classList.add("start-btn")
      }
    }
  }

  //Check time between clicks in wait observable
  checkTimeBetweenTwoClicks(startTime:number):boolean{
    const endTime = new Date().getTime()
    const delta = endTime - startTime
    return delta < 500
  }

}
