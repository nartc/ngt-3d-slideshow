import { Component } from "@angular/core";
import { NgtCanvas } from "angular-three";
import { Scene } from "./experience/scene";
import { Overlay } from "./overlay";

@Component({
	selector: "app-root",
	standalone: true,
	template: `
		<ngt-canvas
			[sceneGraph]="scene"
			[shadows]="true"
			[camera]="{ position: [0, 0, 5], fov: 30 }"
		/>
		<app-overlay />
	`,
	host: {
		class: "block h-screen w-screen",
	},
	imports: [NgtCanvas, Overlay],
})
export class AppComponent {
	scene = Scene;
}
