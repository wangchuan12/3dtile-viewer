import { Box3, LoadingManager, Object3D } from "three";
import Viewer from "./viewer";
import { I3DMLoader } from "3d-tiles-renderer";

export default class I3dmRender extends Object3D{
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
        const loader = new I3DMLoader(new LoadingManager())
        loader.load(this.url).then((res)=>{
            this.add(res.scene)
            const box = new Box3().expandByObject(res.scene)
            this.viewer.setCameraPositionFromBox3(box)
        })
    }
}