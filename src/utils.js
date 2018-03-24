import p2 from "p2";

export function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

export function buildCollisions(collisions) {
	let bodies = [];

	for (let i = 0; i < collisions.length; i++) {
		let object = collisions[i];

		if (!object.visible) continue;

		// create the shape
		if (Array.isArray(object.polygon)) {
			let body = new p2.Body({ mass: 0 });
			body.position[0] = object.x;
			body.position[1] = object.y;
			body.fromPolygon(object.polygon.map(point => [point.x, point.y]));
			bodies.push(body);
		} else if (Array.isArray(object.polyline)) {
			let body = new p2.Body({ mass: 0 });
			body.position[0] = object.x;
			body.position[1] = object.y;

			// start at the second point
			for (let i = 1; i < object.polyline.length; i++) {
				let prev = object.polyline[i - 1];
				let curr = object.polyline[i];
				let length = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
				let angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
				body.addShape(
					new p2.Line({
						position: [lerp(prev.x, curr.x, 0.5), lerp(prev.y, curr.y, 0.5)],
						length: length,
						angle: angle,
					}),
				);
			}

			bodies.push(body);
		} else if (object.height > 0 && object.width > 0) {
			let body = new p2.Body({ mass: 0 });
			body.position[0] = object.x + object.width / 2;
			body.position[1] = object.y + object.height / 2;
			body.addShape(
				new p2.Box({
					width: object.width,
					height: object.height,
				}),
			);
			bodies.push(body);
		}
	}

	return bodies;
}

export function clipDecimals(v, n = 3) {
	return Math.round(v * Math.pow(10, n)) / Math.pow(10, n);
}
