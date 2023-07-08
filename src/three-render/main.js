import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Viewer from "./viewer";
import TileRender from "./tile-render";
import TileType from "../util/tile-type";
import B3dmRender from "./b3dm-render";

class ThreeMain{
    constructor(){
    }

    init(){
        this.viewer = new Viewer('three-con')
        this.viewer.init()
        this.viewer.getObjectControl()
        const mesh = new Mesh(new BoxGeometry(1 ,1 ,1 ) , new MeshBasicMaterial())
        this.viewer.scene.add(mesh)
        this.getVscodeData()
    }

    getVscodeData(){
        window.addEventListener("message" , (e)=>{
            const div = document.createElement("div")
            div.innerHTML = e.data.url
            document.body.appendChild(div)
            switch(e.data.type){
                case TileType["3DTILE"]:
                    const tileRender = new TileRender(this.viewer.camera , this.viewer.renderer , e.data.url)
                    this.tileRender = tileRender
                    this.viewer.scene.add(tileRender)
                    break
                case TileType.B3DM:
                    this.viewer.scene.add(
                        new B3dmRender(e.data.url , this.viewer)
                    )
                    break
                case TileType.I3DM:
                    break
                case TileType.PNTS:
                    break
            }
        })
    }

    update(){
        this.viewer.control.update()
        this.tileRender && this.tileRender.update()
    }

    render(){
        this.viewer.renderer.render(this.viewer.scene , this.viewer.camera)
    }

    startLoop(){
        this.update()
        this.render()
        requestAnimationFrame(this.startLoop.bind(this))
    }
}

const run = ()=>{
    const main = new ThreeMain()
    main.init()
    main.startLoop()
    return main
}
export default run