import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit
} from "@angular/core";
import {fromEvent,interval,merge} from "rxjs";
import {takeUntil, map, buffer, debounceTime, filter} from "rxjs/operators";


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
  //Create interval property,that we will use to reset our timer
  intervalObservable:any
  //Clicks which stop timer
  stopClicks:any


  //Create observables,which give us an ability to maintain events
  startTimerObservable:any
  stopTimerObservable:any
  waitTimerObservable:any
  resetTimerObservable:any


  //Import button
  @ViewChild("startbtn") start_btn:any
  @ViewChild("stopbtn") stop_btn:any
  @ViewChild("waitbtn") wait_btn:any
  @ViewChild("resetbtn") reset_btn:any

  //Define our main properties
  ngOnInit() {
      this.minutes = 0
      this.seconds = 0
      this.isStarted = false
      this.intervalObservable = interval(1000)
  }

  //Define observables
  ngAfterViewInit(){
    this.startTimerObservable = fromEvent(this.start_btn.nativeElement,"click")
    this.stopTimerObservable = fromEvent(this.stop_btn.nativeElement,"click")
    this.resetTimerObservable = fromEvent(this.reset_btn.nativeElement,"click")

    const waitBuffer = fromEvent(this.wait_btn.nativeElement,"click").pipe(debounceTime(500))
    this.waitTimerObservable = fromEvent(this.wait_btn.nativeElement,"click").pipe(
      buffer(waitBuffer),
      map(evt=>{
        return evt.length
      }),
      filter(x=>x==2)
    )

    this.stopClicks = merge(
      this.waitTimerObservable,
      this.stopTimerObservable
    )

    //Subscriptions
    this.startTimerObservable.subscribe(()=>{
      this.intervalObservable.pipe(takeUntil(this.stopClicks)).subscribe(()=>{
      this.start()
      })
    })

    this.stopTimerObservable.subscribe(()=>{
      this.stop()
    })

    this.waitTimerObservable.subscribe(()=>{
      this.isStarted = false
    })

    this.resetTimerObservable.subscribe(()=>{
      this.reset()
    })
    }


  start(){
    this.isStarted = true
    this.checkBtns()
    this.seconds++
    if(this.seconds === 59){
      this.seconds = 0
      this.minutes++
    }
  }

  stop(){
    this.isStarted = false
    this.checkBtns()
    this.reset()
  }
  reset(){
    this.isStarted = true
    this.minutes = 0
    this.seconds = 0
  }

  //If number is less than 10,add extra 0 in front of number
  convertTime(num:number):string{
    if(num < 10){
      return `0${num}`
    }
    return num.toString()
  }

  //Change start/stop button
  checkBtns(){
    const startBtn = document.querySelector("#start_btn")
    const stopBtn = document.getElementById("stop_btn")

    if(stopBtn && startBtn){
      if(this.isStarted){
        stopBtn.classList.remove("hidden")
        startBtn.classList.add("hidden")
      }else{
        startBtn.classList.remove("hidden")
        stopBtn.classList.add("hidden")
      }

    }
  }
}
