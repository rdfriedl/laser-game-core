import { Emitter } from "regexp-events";
import p2 from "p2";
import Hashids from "hashids";

import BulletManager from "../bullet/BulletManager";
import { lerp, clipDecimals } from "../utils";
import { COLLISION_GROUPS } from "../const";

export default class Player extends Emitter {
	static ids = new Hashids("players");

	constructor(manager, info, props) {
		super();

		this.manager = manager;
		this.id = Player.ids.encode(Date.now());

		// this is basic info about the player
		// NOTE: this is set once when the bullet is created and then never changes
		this.info = {
			name: undefined,
			color: 0x000000,
		};
		this.props = {
			health: 100,
			spawned: false,
		};
		this.position = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			direction: 0,
		};
		this.controls = {
			moveX: 0,
			moveY: 0,
			shoot: false,
			direction: 0,
		};

		this.body = new p2.Body({
			mass: 10,
			damping: 0,
			fixedRotation: true,
		});
		this.body.addShape(
			new p2.Circle({
				radius: 10,
			}),
		);

		this.body.shapes.forEach(shape => {
			shape.collisionGroup = COLLISION_GROUPS.PLAYER;
			shape.collisionMask = COLLISION_GROUPS.WALLS | COLLISION_GROUPS.BULLET | COLLISION_GROUPS.PLAYER;
		});

		// tmp gun var
		this.cooldown = 0.15;
		this.tmp = 0;

		if (info) this.setInfo(info);

		if (props) this.setProp(props);
	}

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
	setInfo(key, value) {
		if (key instanceof Object) {
			for (let i in key) this.info[i] = key[i];

			this.emit("info-changed", this.info);
		} else {
			this.info[key] = value;
			this.emit("info-changed", this.info);
		}

		return this;
	}
	setControl(key, value) {
		if (key instanceof Object) {
			for (let i in key) this.controls[i] = key[i];

			this.emit("controls-changed", this.controls);
		} else {
			this.controls[key] = value;
			this.emit("controls-changed", this.controls);
		}

		return this;
	}
	getProp(key, value) {
		return this.props[key];
	}
	getInfo(key, value) {
		return this.info[key];
	}
	getControl(key, value) {
		return this.controls[key];
	}

	setPosition(x = this.body.position[0], y = this.body.position[1], vx = 0, vy = 0, direction) {
		this.body.position[0] = x;
		this.body.position[1] = y;
		this.body.velocity[0] = vx;
		this.body.velocity[1] = vy;

		// TODO: set the rotation on the p2 body instead
		this.position.direction = direction;

		// update position
		this._updatePosition();
	}

	update(d) {
		let { speed, excelerate, decelerate } = this.game.config.player.movement;

		// apply controls
		if (this.controls.moveX !== 0)
			this.body.velocity[0] = lerp(this.body.velocity[0], speed * Math.sign(this.controls.moveX), excelerate);
		else this.body.velocity[0] *= decelerate;

		if (this.controls.moveY !== 0)
			this.body.velocity[1] = lerp(this.body.velocity[1], speed * Math.sign(this.controls.moveY), excelerate);
		else this.body.velocity[1] *= decelerate;

		this.tmp += d;
		if (this.controls.shoot && this.game.isMaster) {
			if (this.tmp > this.cooldown) {
				this.tmp = 0;
				this.game.bullets.createBullet(
					BulletManager.BULLET_TYPE.DEFAULT,
					{ owner: this.id },
					{
						start: { x: this.position.x, y: this.position.y },
						direction: this.controls.direction + (Math.random() - 0.5) * (Math.PI / 32),
					},
				);
			}
		}

		// update position
		this._updatePosition();

		this.emit("update", d);
	}

	_updatePosition() {
		this.position.x = clipDecimals(this.body.position[0]);
		this.position.y = clipDecimals(this.body.position[1]);
		this.position.vx = clipDecimals(this.body.velocity[0]);
		this.position.vy = clipDecimals(this.body.velocity[1]);
	}

	toJSON() {
		let json = {
			id: this.id,
			info: this.info,
			props: this.props,
			position: this.position,
			controls: this.controls,
		};

		this.emit("to-json", json);

		return json;
	}

	fromJSON(json) {
		this.id = json.id;
		this.setInfo(json.info);
		this.setProp(json.props);
		this.setControl(json.controls);
		Object.assign(this.position, json.position);

		this.emit("from-json", json);

		return this;
	}

	// overwrite emit so we can fire events on the manager
	emit(event, ...args) {
		let v = Emitter.prototype.emit.call(this, event, ...args);
		this.manager.emit("player-" + event, this, ...args);
		this.manager.emit(`player-${this.id}-${event}`, this, ...args);
		return v;
	}

	get game() {
		return this.manager.game;
	}
}
