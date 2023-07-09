import { B3DMLoader } from "3d-tiles-renderer";
import { Box3, LoadingManager, Object3D, Vector3 } from "three";
import Viewer from "./viewer";

export default class B3dmRender extends Object3D{
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
        this.loader = new B3DMLoader(new LoadingManager())
        this.loader.load(this.url).then((res)=>{
            this.add(res.scene)
            const box = new Box3()
            box.expandByObject(res.scene)
            this.viewer.setCameraPositionFromBox3(box)
        })
    }

}