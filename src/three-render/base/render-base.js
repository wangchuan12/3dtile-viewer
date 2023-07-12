import { Mesh, Object3D } from "three";

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
}