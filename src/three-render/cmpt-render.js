import { Box3, LoadingManager, Mesh} from "three";
import Viewer from "./viewer";
import { CMPTLoader } from "3d-tiles-renderer";
import RenderBase from "./base/render-base";

export default class CmptRender extends RenderBase{
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
        const loader = new CMPTLoader(new LoadingManager())

        loader.load(this.url).then((res)=>{
            res.scene.traverse((item)=>{
                if (item instanceof Mesh) {
                    item.geometry.computeBoundsTree()
                   // item.material = new ShaderMaterial(getHightShader(ShaderLib.standard ) )
                }
            })
            this.add(res.scene)
            const box = new Box3().expandByObject(res.scene)
            this.viewer.setCameraPositionFromBox3(box)
        })
    }


}