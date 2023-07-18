import { GLTFCesiumRTCExtension } from "3d-tiles-renderer";
import { LoadingManager, Mesh, Object3D } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GLTFMaterialsUnlitExtension from "../gltf-loader/gLTF-materials-unlit-extension";
import { BatchTable, FeatureTable } from "3d-tiles-renderer/src/utilities/FeatureTable";

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
    
    /**
     * 
     * @param {FeatureTable} table 
     */
    featureTableToPlane(table){
        if (!table) return null
        const header = table.getKeys()
        console.log(table)
        header.forEach((item)=>{
            //@ts-ignore
            table.header[item] = [table.header[item]]
        })
        return {
            header : header,
            data : table.header,
            // @ts-ignore
            length : table.header[header[0]].length,
            name : "FeatureTable",
            show : true
        }
    }

    /**
     * 
     * @param {BatchTable} table 
     */
    batchTableToPlane(table){
        if (!table) return null
        const header = table.getKeys()
        if (!header.length) return null
        return {
            header : header,
            // @ts-ignore
            data : table.header,
            // @ts-ignore
            length : table.header[header[0]].length,
            name : "BatchTable",
            show : true
        }
    }

}