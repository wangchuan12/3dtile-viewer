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
        // 测试代码 以后删除
        // const tileRender = new TileRender(this.viewer.camera , this.viewer.renderer , 
        //     "https://home.smart3d.cn/viewer/Smart3DDatas/3DTiles/ZJTelecom/3dtiles.json"
        //     , this.viewer)
        // this.tileRender = tileRender
        // this.viewer.scene.add(tileRender)
        //https://raw.githubusercontent.com/CesiumGS/3d-tiles-samples/main/1.0/TilesetWithRequestVolume/points.pnts

        // this.viewer.scene.add(
        //     new PntsRender("https://raw.githubusercontent.com/CesiumGS/3d-tiles-samples/main/1.0/TilesetWithRequestVolume/points.pnts" , this.viewer)
        // )
        this.getVscodeData()
    }

    getVscodeData(){
        window.addEventListener("message" , (e)=>{
            switch(e.data.type){
                case TileType["3DTILE"]:
                    const tileRender = new TileRender(this.viewer.camera , this.viewer.renderer , e.data.url , this.viewer)
                    this.tileRender = tileRender
                    this.viewer.scene.add(tileRender)
                    break
                case TileType.B3DM:
                    this.viewer.scene.add(
                        new B3dmRender(e.data.url , this.viewer)
                    )
                    break
                case TileType.I3DM:
                    this.viewer.scene.add(
                        new I3dmRender(e.data.url , this.viewer)
                    )
                    break
                case TileType.PNTS:
                    this.viewer.scene.add(
                        new PntsRender(e.data.url , this.viewer)
                    )
                    break
                case TileType.CMPT :
                    this.viewer.scene.add(
                        new CmptRender(e.data.url , this.viewer)
                    )
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