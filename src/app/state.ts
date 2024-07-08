import { signal } from "@angular/core";

export const scenes = [
	{
		path: "models/cybertruck_scene.glb",
		mainColor: "#f9c0ff",
		name: "Cybertruck",
		description:
			"Better utility than a truck with more performance than a sports car",
		price: 72000,
		range: 660,
	},
	{
		path: "models/model3_scene.glb",
		mainColor: "#c0ffe1",
		name: "Model 3",
		description: "The car of the future",
		price: 29740,
		range: 576,
	},
	{
		path: "models/semi_scene.glb",
		mainColor: "#ffdec0",
		name: "Semi",
		description: "The Future of Trucking",
		price: 150000,
		range: 800,
	},
] as const;

export type ShowroomScene = (typeof scenes)[number];

export const slide = signal(0);
