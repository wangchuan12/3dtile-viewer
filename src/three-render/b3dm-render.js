import { B3DMLoader } from "3d-tiles-renderer";
import { Box3,LoadingManager, Mesh } from "three";
import Viewer from "./viewer";
import RenderBase from "./base/render-base";
import TileStanderMaterial from "./shader/tile-stander-material";

export default class B3dmRender extends RenderBase{
    /**
     * 
     * @param {string} url 
     * @param {Viewer} viewer 
     */
    constructor(url , viewer){
        super()
        this.url = url
        this.viewer = viewer
        this.init()
    }

    init(){
        const manager = this.getGltFDracoLoaderManager(window["dracoPath"])
        this.loader = new B3DMLoader(manager)
        this.loader.load(this.url).then((res)=>{
            res.scene.traverse((item)=>{
                if (item instanceof Mesh) {
                    item.geometry.computeBoundsTree()
                    item.material = TileStanderMaterial.getBathRenderMaterial(item.material)
                }
            })
            this.add(res.scene)
            const box = new Box3()
            box.expandByObject(res.scene)
            this.viewer.setCameraPositionFromBox3(box)
            this.viewer.eventBus.emit("modeLoad" , {
                featureTable : this.featureTableToPlane(res.featureTable),
                batchTable : this.batchTableToPlane(res.batchTable)
            })
        })
    }

}