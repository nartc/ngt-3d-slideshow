import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	viewChild,
} from "@angular/core";
import {
	extend,
	injectBeforeRender,
	injectStore,
	NgtArgs,
} from "angular-three";
import { NgtsGrid } from "angular-three-soba/abstractions";
import {
	NgtsEnvironment,
	NgtsRenderTexture,
	NgtsRenderTextureContent,
} from "angular-three-soba/staging";
import * as THREE from "three";
import { Mesh } from "three";
import { scenes } from "../state";
import { CameraHandler } from "./camera-handler";
import { RenderTextureScene } from "./render-texture-scene";

extend(THREE);

@Component({
	standalone: true,
	template: `
		<ngt-color *args="['#ececec']" attach="background" />
		<ngt-ambient-light [intensity]="0.2 * Math.PI" />

		<ngts-environment [options]="{ preset: 'city' }" />

		<app-camera-handler [slideDistance]="slideDistance" />

		<!--		MAIN WORLD-->
		<ngt-group>
			<ngt-mesh #sphere [position]="[0, viewport().height / 2 + 1.5, 0]">
				<ngt-sphere-geometry *args="[1, 32, 32]" />
				<ngt-mesh-toon-material [color]="scenes[0].mainColor" />
			</ngt-mesh>

			<ngt-mesh
				#box
				[position]="[
					viewport().width + slideDistance,
					viewport().height / 2 + 1.5,
					0,
				]"
			>
				<ngt-box-geometry />
				<ngt-mesh-toon-material [color]="scenes[1].mainColor" />
			</ngt-mesh>

			<ngt-mesh
				#dodecahedron
				[position]="[
					2 * (viewport().width + slideDistance),
					viewport().height / 2 + 1.5,
					0,
				]"
			>
				<ngt-dodecahedron-geometry />
				<ngt-mesh-toon-material [color]="scenes[2].mainColor" />
			</ngt-mesh>
		</ngt-group>

		<ngts-grid
			[options]="{
				position: [0, -viewport().height / 2, 0],
				sectionSize: 1,
				sectionColor: 'purple',
				sectionThickness: 1,
				cellSize: 0.5,
				cellColor: '#6f6f6f',
				cellThickness: 0.6,
				infiniteGrid: true,
				fadeDistance: 50,
				fadeStrength: 5,
			}"
		/>
		<!--		END	MAIN WORLD-->

		@for (scene of scenes; track scene.name) {
			<ngt-mesh
				[position]="[$index * (viewport().width + slideDistance), 0, 0]"
			>
				<ngt-plane-geometry *args="[viewport().width, viewport().height]" />
				<ngt-mesh-basic-material [toneMapped]="false">
					<ngts-render-texture>
						<app-render-texture-scene *renderTextureContent [scene]="scene" />
					</ngts-render-texture>
				</ngt-mesh-basic-material>
			</ngt-mesh>
		}
	`,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgtArgs,
		NgtsEnvironment,
		CameraHandler,
		NgtsGrid,
		NgtsRenderTexture,
		NgtsRenderTextureContent,
		RenderTextureScene,
	],
})
export class Scene {
	Math = Math;
	scenes = scenes;

	private store = injectStore();
	viewport = this.store.select("viewport");

	slideDistance = 1;

	sphere = viewChild.required<ElementRef<Mesh>>("sphere");
	box = viewChild.required<ElementRef<Mesh>>("box");
	dodecahedron = viewChild.required<ElementRef<Mesh>>("dodecahedron");

	constructor() {
		injectBeforeRender(({ delta }) => {
			const [sphere, box, dodecahedron] = [
				this.sphere().nativeElement,
				this.box().nativeElement,
				this.dodecahedron().nativeElement,
			];

			sphere.rotation.y += 0.5 * delta;
			box.rotation.y += 0.5 * delta;
			dodecahedron.rotation.y += 0.5 * delta;
		});
	}
}
