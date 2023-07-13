import { Color, Material, ShaderLib, ShaderMaterial, UniformsUtils } from "three";

export default class TileStanderMaterial{

    /**
     * 
     * @param {Material} material 
     */
    static getBathRenderMaterial(material){
        material.onBeforeCompile = (shader , render)=>{
            console.log(shader)
            shader.uniforms.highlightedBatchId = { value: - 1 }
            shader.uniforms.highlightColor = { value: new Color( 0xFFC107 ).convertSRGBToLinear() }
            // @ts-expect-error
            material.uniforms = shader.uniforms
            shader.vertexShader =
            `
                attribute float _batchid;
                varying float batchid;
            ` +
            shader.vertexShader.replace(
                /#include <uv_vertex>/,
                `
                #include <uv_vertex>
                batchid = _batchid;
            `
            );
            shader.fragmentShader =
            `
                varying float batchid;
                uniform float highlightedBatchId;
                uniform vec3 highlightColor;
            ` +
            shader.fragmentShader.replace(
            /vec4 diffuseColor = vec4\( diffuse, opacity \);/,
            `
                vec4 diffuseColor =
                abs( batchid - highlightedBatchId ) < 0.5 ?
                vec4( highlightColor, opacity ) :
                vec4( diffuse, opacity );
            `
            )

            return shader


        }

        return material
    }
}