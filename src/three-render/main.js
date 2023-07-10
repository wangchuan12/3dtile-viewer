import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Viewer from "./viewer";
import TileRender from "./tile-render";
import TileType from "../util/tile-type";
import B3dmRender from "./b3dm-render";
import I3dmRender from "./i3dm-render";
import PntsRender from "./pnts-render";
import CmptRender from "./cmpt-render";

class ThreeMain{
    constructor(){
    }

    init(){
        this.viewer = new Viewer('three-con')
        this.viewer.init()
        this.viewer.getObjectControl()
    }

    /**
     * 
     * @param {string} type 
     * @param {string} url 
     */
    dealMessage(type , url){
        switch(type){
            case TileType["3DTILE"]:
                const tileRender = new TileRender(this.viewer.camera , this.viewer.renderer , url , this.viewer)
                this.tileRender = tileRender
                this.viewer.scene.add(tileRender)
                break
            case TileType.B3DM:
                this.viewer.scene.add(
                    new B3dmRender(url , this.viewer)
                )
                break
            case TileType.I3DM:
                this.viewer.scene.add(
                    new I3dmRender(url , this.viewer)
                )
                break
            case TileType.PNTS:
                this.viewer.scene.add(
                    new PntsRender(url , this.viewer)
                )
                break
            case TileType.CMPT :
                this.viewer.scene.add(
                    new CmptRender(url , this.viewer)
                )
                break
        }
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
let main;

const dealMessage = (e)=>{
    if (!main) {
        setTimeout(()=>{
            dealMessage(e)
        },300)
    }

    main.dealMessage(e.data.type , e.data.url)
}
window.addEventListener("message" , (e)=>{
    dealMessage(e)
})

const run = ()=>{
    main = new ThreeMain()
    main.init()
    main.startLoop()
    return main
}
export default run