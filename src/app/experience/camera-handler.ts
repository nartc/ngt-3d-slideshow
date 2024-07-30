import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	input,
	viewChild,
} from "@angular/core";
import { injectStore } from "angular-three";
import { NgtsCameraControls } from "angular-three-soba/controls";
import { injectAutoEffect } from "ngxtension/auto-effect";
import { slide } from "../state";

@Component({
	selector: "app-camera-handler",
	standalone: true,
	template: `
		<ngts-camera-controls
			[options]="{
				touches: { one: 0, two: 0, three: 0 },
				mouseButtons: $any({ left: 0, middle: 0, right: 0 }),
			}"
		/>
	`,

	imports: [NgtsCameraControls],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraHandler {
	slideDistance = input(1);

	private store = injectStore();
	private viewport = this.store.select("viewport");

	private cameraControlsRef = viewChild.required(NgtsCameraControls);

	private lastSlide = 0;
	private dollyDistance = 20;

	constructor() {
		const autoEffect = injectAutoEffect();
		afterNextRender(() => {
			autoEffect(() => {
				const viewport = this.viewport();
				const cameraControls = this.cameraControlsRef().controls();

				const id = setTimeout(() => {
					void cameraControls.setLookAt(
						slide() * (viewport.width + this.slideDistance()),
						0,
						5,
						slide() * (viewport.width + this.slideDistance()),
						0,
						0,
					);
				}, 200);

				return () => clearTimeout(id);
			});

			autoEffect(() => {
				const currentSlide = slide();
				if (this.lastSlide === currentSlide) return;
				void this.moveToSlide();
				this.lastSlide = currentSlide;
			});
		});
	}

	private async moveToSlide() {
		const cameraControls = this.cameraControlsRef().controls();

		await cameraControls.setLookAt(
			this.lastSlide * (this.viewport().width + this.slideDistance()),
			3,
			this.dollyDistance,
			this.lastSlide * (this.viewport().width + this.slideDistance()),
			0,
			0,
			true,
		);

		await cameraControls.setLookAt(
			(slide() + 1) * (this.viewport().width + this.slideDistance()),
			1,
			this.dollyDistance,
			slide() * (this.viewport().width + this.slideDistance()),
			0,
			0,
			true,
		);

		await cameraControls.setLookAt(
			slide() * (this.viewport().width + this.slideDistance()),
			0,
			5,
			slide() * (this.viewport().width + this.slideDistance()),
			0,
			0,
			true,
		);
	}
}
