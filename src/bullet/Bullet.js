import shortID from "shortid";
import { Emitter } from "regexp-events";
import p2 from "p2";
import { lerp } from "../utils";
import { COLLISION_GROUPS } from "../const";

export default class Bullet extends Emitter {
	constructor(manager, info = {}, props = {}) {
		super();
		this.manager = manager;

		this.id = shortID();

		// this is basic info about the bullet
		// like: who shot it, how long its supposed to last
		// NOTE: this is set once when the bullet is created and then never changes
		this.info = Object.assign(
			{
				owner: undefined,
			},
			info,
		);

		// important info about the bullet
		// like: current speed, its path, who its locked onto, and so on
		// NOTE: everything a prop changes its sent to the clients
		this.props = Object.assign({}, props);

		// this is anything that is used in the bullets update function
		// NOTE: this is not send to the client
		this.data = {};

		// set the bullet up
		this.init();
	}

	init() {}

	setProp(key, value) {
		if (key instanceof Object) {
			for (let i in key) this.props[i] = key[i];

			this.emit("props-changed", this.props);
		} else {
			this.props[key] = value;
			this.emit("props-changed", this.props);
		}

		return this;
	}

	getProp(key) {
		return this.props[key];
	}

	update(d) {}

	destroy() {
		this.manager.removeBullet(this);
		return this;
	}
	die() {
		return this.destroy();
	}

	toJSON() {
		let json = {
			id: this.id,
			info: this.info,
			props: this.props,
			type: this.type,
		};

		this.emit("to-json", json);
		return json;
	}

	fromJSON(json) {
		this.id = json.id || this.id;
		if (json.info) Object.assign(this.info, json.info);
		if (json.props) Object.assign(this.props, json.props);
		this.init();
		return this;
	}

	// overwrite emit so we can fire events on the manager
	emit(event, ...args) {
		let v = Emitter.prototype.emit.call(this, event, ...args);
		this.manager.emit("bullet-" + event, this, ...args);
		this.manager.emit(`bullet-${this.id}-${event}`, this, ...args);
		return v;
	}

	get game() {
		return this.manager.game;
	}

	get player() {
		return this.game.players.getPlayer(this.info.owner);
	}

	get type() {
		return this.manager.getBulletType(this);
	}
}
