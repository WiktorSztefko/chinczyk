export default class Pawn {
    constructor(key,x,y,id) {
        this.key = key
        this.positionX=x
        this.positionY=y
        this.id=id
    }
    create() {

        let div = document.createElement("div")
        div.className = "playerNick"
        div.className = "playerPawn"

        // if (this.key == this.me) {
        //     div.classList.add("me")
        // }

        div.style.width=50+"px"
        div.style.height=50+"px"
        div.style.borderRadius=50+"%"
        div.style.backgroundColor=this.key
        div.style.position="absolute"
        div.style.left=this.positionX+"px"
        div.style.top=this.positionY+"px"
        div.style.zIndex=10
        div.style.transform="translate(-25px, -25px)"
        div.style.boxSizing="border-box"
        div.style.border="8px solid white"
        div.id=this.id
        div.status="inHome"
        div.position=""

        return div
    }
  
}