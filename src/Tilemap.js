import { Emitter } from "regexp-events";
import p2 from "p2";
import _ from "lodash";

import { lerp } from "./utils";
import { COLLISION_GROUPS } from "./const";

const TILE_SIZE = 50;
export default class Tilemap extends Emitter {
	constructor(game) {
		super();

		this.game = game;
		this.size = { width: 0, height: 0 };
		this.bodies = [];
		this.spawnAreas = [];
		this.loadedJSON = {};
	}

	clearBodies() {
		this.bodies.forEach(body => this.game.world.removeBody(body));
		this.bodies = [];
		this.emit("collisions-cleared");
		return this;
	}

	toJSON() {
		return this.loadedJSON;
	}

	fromJSON(json) {
		this.clearBodies();

		this.loadedJSON = json;

		this.size.width = json.size.width;
		this.size.height = json.size.height;

		// build the collisions for the map
		this.bodies = Tilemap.buildCollisions(json.collisions);

		// set all the collisions groups
		this.bodies.forEach(body => {
			body.shapes.forEach(shape => {
				shape.collisionGroup = COLLISION_GROUPS.WALLS;
				shape.collisionMask = COLLISION_GROUPS.ALL;
			});
		});

		this.bodies.forEach(body => this.game.world.addBody(body));
		this.emit("from-json", json);
		return this;
	}

	getSpawnPoint() {
		return {
			x: this.size.width / 2 * TILE_SIZE,
			y: this.size.height / 2 * TILE_SIZE,
		};
	}

	static buildCollisions(collisions) {
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

	static parseTiledJSON(json) {
		let mapJSON = {
			size: {
				width: json.width,
				height: json.height,
			},
			types: [],
			tiles: [],
		};

		// get the collisions
		mapJSON.collisions = json.layers.find(layer => {
			return layer.objects && layer.name == "collision" && layer.type == "objectgroup";
		}).objects;

		// get all the tile props
		let tileProperties = {};
		json.tilesets.forEach(tileset => {
			for (let id in tileset.tileproperties) {
				let tileID = parseInt(id) + tileset.firstgid;
				if (Reflect.ownKeys(tileset.tileproperties[id]).length > 0) {
					if (!tileProperties[tileID]) tileProperties[tileID] = {};
					Object.assign(tileProperties[tileID], tileset.tileproperties[id]);
				}
			}
		});

		// compile all the tile props
		json.layers.filter(layer => layer.type === "tilelayer").forEach(layer => {
			for (let i = 0; i < layer.data.length; i++) {
				let y = Math.floor(i / json.width);
				let x = i - y * json.width;
				if (!mapJSON.tiles[y]) mapJSON.tiles[y] = [];
				if (!mapJSON.tiles[y][x]) mapJSON.tiles[y][x] = [];

				let props = tileProperties[layer.data[i]];
				if (props) mapJSON.tiles[y][x].push(props);
			}
		});

		// condense the tiles down to types
		mapJSON.tiles = mapJSON.tiles.map(row => {
			return row.map(tile => {
				// find a type that has exactaly the make models as the tile
				let type = mapJSON.types.find(type => _.isEqual(tile, type));

				if (!type && tile.length > 0) mapJSON.types.push((type = tile));

				return mapJSON.types.indexOf(type);
			});
		});

		return mapJSON;
	}
}
