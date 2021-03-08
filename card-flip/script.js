let utama = document.querySelector(".utama")
,wadah = []
,theTruth = []
,first
,sudah = ""
,answer = ""
,score = 1
,isOnAnim = false
,isOTW = false
,health = 0
,healthed = false
,HPfriend = 0
,sfx = [
     new Audio('../assets/SFX/whoosh.mp3'),
     new Audio('../assets/SFX/card-flip.mp3'),
     new Audio('../assets/SFX/game-over.mp3'),
     new Audio('../assets/SFX/axe-hit.mp3'),
     new Audio('../assets/SFX/berhasil2.mp3'),
     new Audio('../assets/SFX/berhasil3.mp3')
]
sfx[0].volume = .5
sfx[4].volume = .8
sfx[5].volume = .4
if(localStorage.gameFlip != undefined){
     score = Number(JSON.parse(localStorage.gameFlip).score)
     healthed = true
}
function saving(){
     localStorage.setItem('gameFlip',JSON.stringify({score:score,health:healthed == false?health:JSON.parse(localStorage.gameFlip).health}))
}
function resetVal(){
     localStorage.removeItem('gameFlip')
     location.reload()
}
function getStart(col = 0,callbackrt = ()=>{}){
     saving()
     if(col > my_alphabet.length){col = my_alphabet.length-3}
     if(col % 2 != 0){return console.error(warningArt[1])}
     for(let i=0;i<col;i++){theTruth.push("")}
     let perbaris
     if(col <= 4){perbaris = "w100"}
     else if(col <= 8){perbaris = "w50"}
     else if(col <= 12){perbaris = "w33"}
     else if(col <= 20){perbaris = "w25"}
     else if(col >= 20){perbaris = "w10"}
     let rowEl = document.createElement("div")
     rowEl.style.maxWidth = `${col * 10 * 5}px`
     rowEl.classList.add(...["row","papan","border","w-100","h-75","justify-content-evenly","align-items-center","flex-wrap"])
     for(let i=0;i<col;i++){
          let colEl = document.createElement("div")
          colEl.classList.add(...["kadet","col","justify-content-center","fs-4","d-flex","py-2",perbaris])
          colEl.id = "col-" + i.toString()
          colEl.dataset.answered = false
          colEl.innerHTML = emot[floor(random(0,emot.length))]
          colEl.addEventListener("click", () => {
               if(colEl.dataset.answered == "false"){
                    clicked(colEl)
               } else {
                    getAlert("Watch Out !","you have done this before","warning")
               }
          })
          rowEl.appendChild(colEl)
     }
     utama.appendChild(rowEl)
     wadah = document.querySelectorAll(".kadet")
     for(let i=0;i<col / 2;i++){getCouple()}
     return callbackrt()
}
function getCouple(){
     if(wadah.length % 2 != 0){return console.warn("Error Colums Number")}
     else{
          let idx = floor(random(0,wadah.length))
          let idx2 = floor(random(0,wadah.length))
          if(idx2 == idx){return getCouple()}
          if(sudah.split(" ").map(x => {
               if(Number(x) == idx || Number(x) == idx2){
                    return 1
               } else {
                    return 0
               }
          }).reduce((acc,cur)=>acc+cur) > 0){return getCouple()}
          let tamplate = `${idx.toString()} ${idx2.toString()}`
          if(sudah.length == 0){
               sudah += tamplate
          } else {sudah += " " + tamplate}
          let speel = getAplhabet()
          wadah[idx].dataset.coupleId = sudah.split(" ").length / 2
          theTruth[idx] = speel
          theTruth[idx2] = speel
          wadah[idx2].dataset.coupleId = sudah.split(" ").length / 2
     }
}
function getAplhabet(){
     let speel = my_alphabet[floor(random(0,my_alphabet.length))]
     let result = theTruth.map(x=>x == speel?1:0).reduce((acc,cur)=>acc+cur) >0? getAplhabet() : speel
     return result
}
function clicked(who){
     sfx[1].play()
     if(isOnAnim == true){return "Watch Out !"}
     isOnAnim = true
     if(answer.split(" ").length < 2){
          if(answer == ""){
               answer += who.dataset.coupleId
               first = who
               who.classList.add("text-primary")
               who.textContent = emot[floor(random(0,emot.length))]
               who.animate([{transition:"scale(0)",opacity:"1"},{transform:"scale(-0.5)",opacity:"0"},{transition:"scale(0)",opacity:"1"},],{duration:200,iterations:1})
               setTimeout(() => isOnAnim = false,200)
               who.textContent = theTruth[who.id.split("-")[1]]
          } else{
               if (answer == who.dataset.coupleId && who != first){
                    who.dataset.answered = true
                    who.animate([{transition:"scale(1)",opacity:"1"},{transform:"scale(-0.5)",opacity:"0"},{transition:"scale(1)",opacity:"1"},],{duration:200,iterations:1})
                    setTimeout(() => isOnAnim = false,200)
                    who.textContent = theTruth[who.id.split("-")[1]]
                    first.textContent = theTruth[first.id.split("-")[1]]
                    who.classList.add(...["bg-light","rounded-3","text-secondary","opop"])
                    first.classList.add(...["bg-light","rounded-3","text-secondary","opop"])
                    first.dataset.answered = true
                    if(isWin() && !isOTW){
                         isOTW = true
                         score += 1
                         getDestruct()
                         getAlert("Good Job !","keep it up","info")
                         sfx[4].play()
                         sfx[0].volume = 0
                    } else {
                         getAlert("Nice !","go to the next one","success")
                         sfx[5].play()
                    }
               } else {
                    getWrong()
                    if(health <=0){
                         sudah = ''
                         answer = ''
                         wadah = []
                         theTruth = []
                         score = 1
                         getDestruct()
                         getAlert("Game Over !","start it again","danger")
                         sfx[2].play()
                         sfx[0].volume = 0
                    }else {
                         getAlert("Wrong !","try it again","warning")
                         sfx[3].play()
                    }
                    who.textContent = theTruth[who.id.split("-")[1]]
                    who.classList.add("text-danger")
                    first.classList.remove("text-primary")
                    first.classList.add("text-danger")
                    setTimeout(() => {
                         who.animate([{transition:"scale(1)",opacity:"1"},{transform:"scale(-0.5)",opacity:"0"},{transition:"scale(1)",opacity:"1"},],{duration:200,iterations:1})
                         first.animate([{transition:"scale(1)",opacity:"1"},{transform:"scale(-0.5)",opacity:"0"},{transition:"scale(1)",opacity:"1"},],{duration:200,iterations:1})
                         setTimeout(() => isOnAnim = false,200)
                         first.textContent = emot[floor(random(0,emot.length))]
                         who.textContent = emot[floor(random(0,emot.length))]
                         first.classList.remove("text-danger")
                         who.classList.remove("text-danger")
                    }, 500);
               }
               answer = ""
          }
     }
}
function getDestruct(isOnPlay = true){
     if(score > 200){
          return winScene()
     }
     getBarrier(score)
     isOnPlay == false?"":document.querySelector("main").removeChild(document.querySelector(".papan"))
     health = healthed == false?(score + 1) * 2 - round(random(2,score + 1)):JSON.parse(localStorage.gameFlip).health
     healthed = false
     HPfriend = health
     getStart((score + 1) * 2,()=>isOTW = false)
     let hpStat = document.querySelector(".hp-status")
     setTimeout(()=>gsap.to(hpStat,{x:0,duration:0.5}),500)
}
function isWin(){
     let component = document.querySelectorAll(".kadet")
     if(Array.from(component).map(x => x.dataset.answered == "true"?0:1).reduce((acc,cur)=>acc+cur) > 0? false : true){
          sudah = ''
          answer = ''
          wadah = []
          theTruth = []
          return true
     } else {return false}
}
function setup(){
     document.querySelector(".haha").removeChild(document.querySelector("canvas"))
     // getDestruct(false)
}
function clickStart(){
     document.body.removeChild(document.querySelector('.but-play'))
     setTimeout(function () {
          getDestruct(false)
     }, 500)
}
function getAlert(text_ = "",text2_ = "",type = "danger"){
     let checking = document.querySelectorAll(".myAlert")
     let disp = checking.length * 58
     var myAlert = document.createElement("div")
     myAlert.classList.add(...["alert",`alert-${type}`,"myAlert","position-absolute","end-0"])
     let span = document.createElement("p")
     span.classList.add(...["d-inline","my-2"])
     span.textContent = " " + text2_
     let strong = document.createElement("strong")
     strong.textContent = text_
     myAlert.appendChild(strong)
     myAlert.appendChild(span)
     myAlert.setAttribute("role","alert")
     myAlert.style.top = "-100px"
     document.body.appendChild(myAlert)
     gsap.to(myAlert,{top:disp,duration:1,ease:"Back.easeOut(2)"})
     gsap.to(myAlert,{x:"100%",duration:1,ease:"Back.easeIn(2)",delay:1.2})
     setTimeout(() => {
          document.body.removeChild(myAlert)
     }, 3000);
     acuan = document.querySelector("text.acuan")
}
function getWrong(){
     health -= 1
     saving()
     let hpStat = document.querySelector(".hp-status")
     let hpBar = document.querySelector(".hp-bar")
     gsap.to(hpStat,{x:health > 0?`-${100-(health / HPfriend * 100)}%`:`-100%`,duration:0.5})
     gsap.to(hpBar,{y:3,x:3,ease:"elastic.out(1,0.1)",duration:0.5})
     gsap.to(hpBar,{y:-3,x:-3,ease:"elastic.out(1,0.1)",duration:0.5,delay:0.1})
     gsap.to(hpBar,{y:0,x:0,ease:"elastic.out(1,0.1)",duration:0.5,delay:0.2})
}
function getBarrier(stage = 1){
     let barrier = document.createElement("div")
     barrier.classList.add(...['position-absolute',"top-0","start-0","end-0","bottom-0","fs-1","text-light","justify-content-center","align-items-center","flex-wrap"])
     barrier.style.background = "rgba(0,0,0,0.5)"
     let barrierContent = document.createElement("div")
     barrierContent.classList.add(...["d-flex","justify-content-evenly","align-items-center","flex-wrap","container","h-100"])
     barrierContent.textContent = `Stage ${stage}`
     barrier.appendChild(barrierContent)
     document.body.appendChild(barrier)
     gsap.to(barrier,{x:`-100%`,duration:0})
     gsap.to(barrier,{x:`0`,duration:0.5,onStart:()=>sfx[0].play()})
     gsap.to(barrier,{x:`200%`,duration:1,delay:1.5,onStart:()=>{;sfx[0].volume = .5;sfx[0].play()}})
     setTimeout(() => {
          document.body.removeChild(barrier)
     }, 2000);
}
function winScene(){
     let cong = document.querySelector('.win-congrat')
     ,tittle = document.querySelectorAll('.cong-tittle>*')
     ,resbtn = document.querySelector('.cong-res-btn')
     ,tl = gsap.timeline()
     cong.classList.remove('d-none')
     tl.to(tittle,{y:100,scale:0,duration:0})
     .to(tittle,{y:0,opacity:1,scale:1,duration:1,ease:"back.out(1)",delay:2})
     .to(resbtn,{opacity:1,duration:1,delay:2})
}
let emots = ['smile','smile-wink','smile-beam','grin-squint','grin-hearts','grin-alt','laugh-beam','grin-beam','kiss-beam']
, intervEmot = setInterval(function () {
     getEmoticon('.cong-tittle>i')
}, 500)
function getEmoticon(target = ''){
     let targ = document.querySelector(target)
     , randomize = round(random(0,emots.length-1))
     targ.classList.remove(`fa-${targ.id}`)
     targ.classList.add(`fa-${emots[randomize]}`)
     targ.id = `${emots[randomize]}`
}