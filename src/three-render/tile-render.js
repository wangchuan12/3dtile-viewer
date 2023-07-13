import { Box3, Mesh, Sphere, Vector3, WebGLRenderer } from "three";
import { PerspectiveCamera } from "three";
import { TilesRenderer } from '3d-tiles-renderer';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFCesiumRTCExtension } from '3d-tiles-renderer';
import Viewer from "./viewer";
import RenderBase from "./base/render-base";
import TileStanderMaterial from "./shader/tile-stander-material";

export default class TileRender extends RenderBase{
    /**
     * 
     * @param {PerspectiveCamera} camera 
     * @param {WebGLRenderer} renderer 
     * @param {string} url
     * @param {Viewer} viewer  
     */
    constructor(camera , renderer , url , viewer){
        super()
        this.camera = camera
        this.renderer = renderer
        this.url = url
        this.viewer = viewer
        this.init()
    }

    init(){
        // ... initialize three scene ...//

        const data = this.url 
        // "https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Users/cxx13/Desktop/open/geo-3dtile-for-vscode/3dtile-viewer/test/3dtile/tileset.json"//window.dataUrl || "https://home.smart3d.cn/viewer/Smart3DDatas/3DTiles/ZJTelecom/3dtiles.json"
        const tilesRenderer = new TilesRenderer(data );
        this.tilesRenderer = tilesRenderer
        tilesRenderer.setCamera( this.camera );
        tilesRenderer.setResolutionFromRenderer( this.camera , this.renderer);
        const dracoLoader = new DRACOLoader();
        tilesRenderer.displayActiveTiles = true
        dracoLoader.setDecoderPath( '/draco/' );
        const loader = new GLTFLoader(tilesRenderer.manager);
        loader.setDRACOLoader( dracoLoader );
        loader.register( () => new GLTFCesiumRTCExtension() );
        tilesRenderer.manager.addHandler(/(\.gltf|\.glb)$/, loader);
        tilesRenderer.onLoadModel = (item)=>{
            if (item instanceof Mesh) {
                item.geometry.computeBoundsTree()
                item.material = TileStanderMaterial.getBathRenderMaterial(item.material)
            }
        }

        tilesRenderer.onDisposeModel = (item)=>{
            if (item instanceof Mesh) {
                item.geometry.disposeBoundsTree()
            }
        }
        // @ts-ignore
        this.add(tilesRenderer.group)
        this.adjustCameraPosition()
    }

    async adjustCameraPosition(){
        const data = await fetch(this.url)
        const json = await data.json()
        const boundingVolume = json.root.boundingVolume
        if (boundingVolume.sphere) {
            this.viewer.setCameraPositionFromSphere(new Sphere(
                new Vector3(boundingVolume.sphere[0] , boundingVolume.sphere[1] , boundingVolume.sphere[2]),
                boundingVolume.sphere[3]
            ))
        }

        if (boundingVolume.box) {
            const ve = new Vector3(boundingVolume.box[3] ,boundingVolume.box[7], boundingVolume.box[11])
            this.viewer.setCameraPositionFromBox3(
                new Box3(ve.clone().negate() , ve).translate(new Vector3(
                    boundingVolume.box[0],
                    boundingVolume.box[1],
                    boundingVolume.box[2]
                ))
            )
        }
    }

    update(){
        this.tilesRenderer.update()
    }

}