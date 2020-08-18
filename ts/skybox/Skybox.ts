export class Skybox {
  private _canvas = document.getElementById('skybox-canvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas, true);
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, Math.PI / 2 + 0.2, 3, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), this._scene);

  constructor() {
    this._camera.attachControl(this._canvas, true);
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, this._scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBoxMaterial', this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('res/skybox/skybox3', this._scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Uncomment 3 lines below to view TypeScript compile error 
    const mesh = BABYLON.MeshBuilder.CreateBox('mesh', { size: 1 }, this._scene);
    const ray = new BABYLON.Ray(new BABYLON.Vector3(), new BABYLON.Vector3(1, 0, 0), 1);
    ray.intersectsMesh(mesh, false);

    // This line compiles fine unlike the line above
    // ray.intersectsMesh(mesh as BABYLON.DeepImmutableObject<BABYLON.Mesh>, false);

    this._scene.registerBeforeRender(() => {
      this._camera.alpha = BABYLON.Scalar.Lerp(this._camera.alpha, this._camera.alpha - 1e-2, 1e-2);
    });

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}