import {
	ChangeDetectionStrategy,
	Component,
	effect,
	signal,
} from "@angular/core";
import { scenes, slide } from "./state";

@Component({
	selector: "app-overlay",
	standalone: true,
	template: `
		<div
			class="fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col justify-between pointer-events-none text-black transition-opacity duration-1000"
			[class.opacity-0]="!visible()"
		>
			<svg
				class="w-40 mx-auto mt-8"
				viewBox="0 0 342 35"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7h24zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7z"
					fill="currentColor"
				></path>
			</svg>
			<div
				class="absolute top-0 bottom-0 left-0 right-0 flex-1 flex items-center justify-between p-4"
			>
				<svg
					(click)="onPrevClick()"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="{1.5}"
					stroke="currentColor"
					class="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
					/>
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="{1.5}"
					stroke="currentColor"
					class="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
					(click)="onNextClick()"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
					/>
				</svg>
			</div>

			<div
				class="bg-gradient-to-t from-white/90 pt-20 pb-10 p-4 flex items-center flex-col text-center"
			>
				@let slide = scenes[displaySlide()];
				
				<h1 class="text-5xl font-extrabold">
					{{ slide.name }}
				</h1>
				<p class="text-opacity-60 italic">
					{{ slide.description }}
				</p>
				<div class="flex items-center gap-12 mt-10">
					<div class="flex flex-col items-center">
						<div class="flex gap-2 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="{1.5}"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
								/>
							</svg>
							<p class="font-semibold text-3xl">
								{{ slide.price.toLocaleString() }}
							</p>
						</div>
						<p class="text-sm opacity-80">After Federal Tax Credit</p>
					</div>
					<div class="flex flex-col items-center">
						<div class="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="{1.5}"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z"
								/>
							</svg>
							<p class="font-semibold text-3xl">
								{{ slide.range }}km
							</p>
						</div>
						<p class="text-sm opacity-80">With one single charge</p>
					</div>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overlay {
	scenes = scenes;
	displaySlide = signal(slide());
	visible = signal(false);

	constructor() {
		effect(() => {
			setTimeout(() => {
				this.visible.set(true);
			}, 1000);
		});

		effect(
			() => {
				const currentSlide = slide();
				this.visible.set(false);
				setTimeout(() => {
					this.displaySlide.set(currentSlide);
					this.visible.set(true);
				}, 2600);
			},
			{ allowSignalWrites: true },
		);
	}

	onNextClick() {
		slide.update((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
	}

	onPrevClick() {
		slide.update((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
	}
}
