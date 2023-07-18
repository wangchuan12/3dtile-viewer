import { Box3, LoadingManager, Mesh} from "three";
import Viewer from "./viewer";
import { CMPTLoader } from "3d-tiles-renderer";
import RenderBase from "./base/render-base";
import TileStanderMaterial from "./shader/tile-stander-material";

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
        const manager = this.getGltFDracoLoaderManager(window["dracoPath"])
        const loader = new CMPTLoader(manager)

        loader.load(this.url).then((res)=>{
            res.scene.traverse((item)=>{
                if (item instanceof Mesh) {
                    item.geometry.computeBoundsTree()
                    item.material = TileStanderMaterial.getBathRenderMaterial(item.material)
                }
            })
            this.add(res.scene)
            const box = new Box3().expandByObject(res.scene)
            this.viewer.setCameraPositionFromBox3(box)
            let tem = {}
            for (let i = 0 ; i < res.tiles.length ; i++) {
                const featureTable = this.featureTableToPlane(res.tiles[i].featureTable)
                const batchTable = this.batchTableToPlane(res.tiles[i].batchTable)
                if (featureTable) {
                    if (tem.featureTable) {
                        tem.featureTable.header.push(...featureTable.header)
                        tem.featureTable.header = Array.from( new Set(tem.featureTable.header))
                        tem.featureTable.header.forEach((item)=>{
                            let temData =  tem.featureTable.data[item.toString()]
                            if (Array.isArray(temData)) {
                                if (item.toString() === "BATCH_LENGTH") {
                                    tem.featureTable.data[item.toString()][0] += featureTable.data[item.toString()][0]
                                } else {
                                    tem.featureTable.data[item.toString()].push(...featureTable.data[item.toString()])
                                }
                                // tem.featureTable.data[item.toString()] = Array.from(new Set(
                                //     tem.featureTable.data[item.toString()]
                                // ))
                            }
                        })
                        tem.featureTable.length = tem.featureTable.data[tem.featureTable.header[0].toString()].length

                    } else {
                        tem.featureTable = featureTable
                    }
                }

                if (batchTable) {
                    if (tem.batchTable) {
                        tem.batchTable.header.push(...batchTable.header)
                        tem.batchTable.header = Array.from( new Set(tem.batchTable.header))
                        tem.batchTable.header.forEach((item)=>{
                            tem.batchTable.data[item].push(...batchTable.data[item])
                            // tem.batchTable.data[item] = Array.from(new Set(
                            //     tem.batchTable.data[item]
                            // ))
                        })
                        tem.batchTable.length = tem.batchTable.data[tem.batchTable.header[0]].length

                    } else {
                        tem.batchTable = batchTable
                    }
                }
            }
            this.viewer.eventBus.emit("modeLoad" , tem)
        })
    }


}