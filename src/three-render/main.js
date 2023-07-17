import { Mesh, Vector2 ,BufferGeometry} from "three";
import Viewer from "./viewer";
import TileRender from "./tile-render";
import TileType from "../util/tile-type";
import B3dmRender from "./b3dm-render";
import I3dmRender from "./i3dm-render";
import PntsRender from "./pnts-render";
import CmptRender from "./cmpt-render";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
Mesh.prototype.raycast = acceleratedRaycast

class ThreeMain{
    constructor(){
    }

    init(){
        this.viewer = new Viewer('three-con')
        this.viewer.init()
        this.viewer.getObjectControl()
        this.initEvent()
        this.currentRender = []
        // window["dracoPath"] = "http://localhost:5174/modify/draco/"
        // this.dealMessage("3dtile" , "http://localhost:5174/modify/3dtiles/3dtiles/tileset.json")
        this.contentDiv = document.createElement("div")
        document.body.appendChild(this.contentDiv)
        this.contentDiv.style.position = "fixed"
        this.contentDiv.style.left = "10px"
        this.contentDiv.style.top = "10px"
        this.contentDiv.style.color = "white"
        //https://raw.githubusercontent.com/CesiumGS/3d-tiles-samples/main/1.0/TilesetWithRequestVolume/city/lr.b3dm
    }

    _createContentEl(data){
        let html = ``
        Object.entries(data).forEach((item)=>{
            html += `
            <p>${item[0]} : ${item[1]}<p/>
            `
        })
        this.contentDiv.innerHTML = html
    }

    initEvent(){
        const pointer = new Vector2();
        window.addEventListener( 'pointermove', (event)=>{
            pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
            const data = this.viewer.pick(pointer)
            this._createContentEl(data)
        } )
    }

    /**
     * 
     * @param {string} type 
     * @param {string} url 
     */
    dealMessage(type , url){
        this.removeAllRender()
        let render
        switch(type){
            case TileType["3DTILE"]:
                const tileRender = new TileRender(this.viewer.camera , this.viewer.renderer , url , this.viewer)
                this.tileRender = tileRender
                render = tileRender
                this.viewer.scene.add(tileRender)
                this.currentRender.push(tileRender)
                break
            case TileType.B3DM:
                render = new B3dmRender(url , this.viewer)
                this.viewer.scene.add(render)
                break
            case TileType.I3DM:
                render = new I3dmRender(url , this.viewer)
                this.viewer.scene.add(render)
                break
            case TileType.PNTS:
                render = new PntsRender(url , this.viewer)
                this.viewer.scene.add(render)
                break
            case TileType.CMPT :
                render = new CmptRender(url , this.viewer)
                this.viewer.scene.add(render)
                break
        }
        this.currentRender.push(render)
    }

    update(){
        this.viewer.control.update()
        this.tileRender && this.tileRender.update()
    }

    render(){
        this.viewer.renderer.render(this.viewer.scene , this.viewer.camera)
    }

    removeAllRender(){
        this.currentRender.forEach((item)=>{
            this.viewer.scene.remove(item)
            item.destroy()
        })

        this.currentRender = []
        
        this.tileRender = null
    }

    destroy(){}

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

    if (e.data.dracoPath) window["dracoPath"] = e.data.dracoPath
    main.dealMessage(e.data.type , e.data.url)
}
window.addEventListener("message" , (e)=>{
    // 测试方法后续删除
    // const div = document.createElement("div")
    // div.innerHTML = `${e.data.url}`
    // document.body.appendChild(div)
    dealMessage(e)
})

const run = ()=>{
    main = new ThreeMain()
    main.init()
    main.startLoop()
    return main
}
export default run