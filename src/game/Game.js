import { Emitter } from "regexp-events";
import PlayerManager from "../player/PlayerManager";
import BulletManager from "../bullet/BulletManager";
import p2 from "p2";
import Hashids from "hashids";
import Tilemap from "../tilemap/Tilemap";

import BASE_CONFIG from "./gameConfig";

export default class Game extends Emitter {
	static ids = new Hashids("games");

	constructor() {
		super();

		this.id = Game.ids.encode(Date.now());
		this.info = {};
		this.isMaster = false;
		this.config = JSON.parse(JSON.stringify(BASE_CONFIG));

		this.players = new PlayerManager(this);
		this.map = new Tilemap(this);
		this.bullets = new BulletManager(this);

		// create the physics world
		this.world = new p2.World({
			gravity: [0, 0],
		});
	}

	getPlayer(...args) {
		return this.players.getPlayer(...args);
	}
	createPlayer(...args) {
		return this.players.createPlayer(...args);
	}
	removePlayer(...args) {
		return this.players.removePlayer(...args);
	}

	spawnPlayer(id) {
		let player = this.players.getPlayer(id);
		let point = this.map.getSpawnPoint();

		player.setPosition(point.x, point.y);
		player.setProp("spawned", true);
		return this;
	}

	setInfo(key, value) {
		if (key instanceof Object) {
			for (let i in key) this.info[i] = key[i];

			this.emit("info-changed", key);
		} else {
			this.info[key] = value;
			this.emit("info-changed", key, value);
		}

		return this;
	}
	getInfo(key, value) {
		return this.info[key];
	}

	getDelta() {
		let newTime = new Date();
		let delta = (newTime - this.lastDelta) / 1000;
		this.lastDelta = newTime;
		return delta;
	}
	update() {
		let d = this.getDelta();

		// update the physics world
		this.world.step(1 / 60, d, 1);

		// update the players
		this.players.update(d);

		// update the bullets
		this.bullets.update(d);

		this.emit("update", d);
	}

	toJSON() {
		let json = {
			id: this.id,
			info: this.info,
			config: this.config,
			map: this.map.toJSON(),
			players: this.players.toJSON(),
		};

		// fire the event
		this.emit("to-json", json);

		return json;
	}

	fromJSON(json) {
		this.id = json.id;
		this.setInfo(json.info);
		this.players.fromJSON(json.players);
		this.map.fromJSON(json.map);

		// fire the event
		this.emit("from-json", json);

		return this;
	}

	get isClient() {
		return !this.isMaster;
	}
}

Game.DEFAULT_FPS = 1 / 60;
