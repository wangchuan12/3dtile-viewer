import { MathUtils, Matrix4, Vector3, WebGLRenderer } from "three";
import { PerspectiveCamera } from "three";
import { Object3D } from "three";
import { TilesRenderer , DebugTilesRenderer} from '3d-tiles-renderer';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFCesiumRTCExtension } from '3d-tiles-renderer';
import ThreeConvertTool from "./three-convert";

export default class TileRender extends Object3D{
    /**
     * 
     * @param {PerspectiveCamera} camera 
     * @param {WebGLRenderer} renderer 
     */
    constructor(camera , renderer , url){
        super()
        this.camera = camera
        this.renderer = renderer
        this.url = url
        this.init()
    }

    init(){
        // ... initialize three scene ...//

        const data = this.url 
        // "https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Users/cxx13/Desktop/open/geo-3dtile-for-vscode/3dtile-viewer/test/3dtile/tileset.json"//window.dataUrl || "https://home.smart3d.cn/viewer/Smart3DDatas/3DTiles/ZJTelecom/3dtiles.json"
        const tilesRenderer = new TilesRenderer(data );
        this.tilesRenderer = tilesRenderer
        // @ts-ignore
       // console.log(dataUrl)
        // const tem =  new Vector3( -2759577.012709694,4771161.978994008,3198855.534166248)
        // const mat = ThreeConvertTool.toThreeMat(tem)
        // const roate = new Matrix4().makeRotationX(MathUtils.degToRad(-90)).multiply(mat)
        // roate.decompose(tilesRenderer.group.position , tilesRenderer.group.quaternion , tilesRenderer.group.scale)
        tilesRenderer.setCamera( this.camera );
        tilesRenderer.setResolutionFromRenderer( this.camera , this.renderer);
        const dracoLoader = new DRACOLoader();
        tilesRenderer.displayActiveTiles = true
        dracoLoader.setDecoderPath( '/draco/' );
        const loader = new GLTFLoader(tilesRenderer.manager);
        loader.setDRACOLoader( dracoLoader );
        loader.register( () => new GLTFCesiumRTCExtension() );
        tilesRenderer.manager.addHandler(/(\.gltf|\.glb)$/, loader);
        // @ts-ignore
        this.add(tilesRenderer.group)
    }

    update(){
        this.tilesRenderer.update()
    }

}