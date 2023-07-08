import * as THREE from 'three'
import * as Cesium from 'cesium'
export default class ThreeConvertTool{
    static toThreeMat(vec){
        const ca = this.threeVec3ToCesiumVec3(vec)
        const mat = Cesium.Transforms.eastNorthUpToFixedFrame(ca)
        const matInverse = Cesium.Matrix4.inverse(mat , new Cesium.Matrix4())
        const matPose = Cesium.Matrix4.transpose(matInverse , new Cesium.Matrix4())
        const threeMat = new THREE.Matrix4()

        threeMat.set(
            matPose[0] ,matPose[1],matPose[2],matPose[3],
            matPose[4],matPose[5],matPose[6],matPose[7],
            matPose[8],matPose[9],matPose[10],matPose[11],
            matPose[12],matPose[13],matPose[14],matPose[15]
        )
        return threeMat
    }


    static threeVec3ToCesiumVec3(vec ){
        return new Cesium.Cartesian3(vec.x , vec.y , vec.z)
    }
}