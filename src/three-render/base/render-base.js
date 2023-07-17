import { GLTFCesiumRTCExtension } from "3d-tiles-renderer";
import { LoadingManager, Mesh, Object3D } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GLTFMaterialsUnlitExtension from "../gltf-loader/gLTF-materials-unlit-extension";

export default class RenderBase extends Object3D{
    init(){
        console.log('一个初始化方法，待实现')
    }

    destroy(){
        this.traverse((item)=>{
            if (item instanceof Mesh) {
                item.geometry.disposeBoundsTree()
                item.geometry.dispose()
                item.material.dispose()
            }
        })
    }

    getGltFDracoLoaderManager(dracoPath){
        const loader = this.getGltFDracoLoader(dracoPath)
        const manager = new LoadingManager()
        loader.manager = manager
        manager.addHandler(/\.gltf$/, loader)
        manager.addHandler( /\.drc$/, loader )
        return manager
    }

    getGltFDracoLoader(dracoPath) {
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath(dracoPath)
        loader.setDRACOLoader(dracoLoader)
        loader.register( () => new GLTFCesiumRTCExtension() )
        loader.register(()=> new GLTFMaterialsUnlitExtension())
        return loader
    }
}