import { Emitter } from "regexp-events";
import Bullet from "./Bullet.js";
import DefaultBullet from "./types/DefaultBullet";

export default class BulletManager extends Emitter {
	constructor(game) {
		super();

		this.game = game;
		this.bullets = [];
	}

	createBullet(type, info, props) {
		let BulletType = BulletManager.BulletTypes[type];
		if (!BulletType) return;
		let bullet = new BulletType(this, info, props);
		this.bullets.push(bullet);
		this.emit("bullet-created", bullet);
		return bullet;
	}

	createFromJSON(json) {
		let BulletType = BulletManager.BulletTypes[json.type];
		if (!BulletType) return;
		let bullet = new BulletType(this, json.info, json.props);
		bullet.fromJSON(json);
		this.bullets.push(bullet);
		this.emit("bullet-created", bullet);
		return bullet;
	}

	getBullet(id) {
		if (id instanceof Bullet) return this.bullets.includes(id) ? id : undefined;
		else return this.bullets.find(bullet => bullet.id == id);
	}

	removeBullet(id) {
		let bullet = this.getBullet(id);
		if (this.bullets.includes(bullet)) {
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
			this.emit("bullet-removed", bullet);
		}
		return this;
	}

	clearBullets() {
		this.bullets.forEach(bullet => this.removeBullet(bullet));
		this.bullets = [];
		return this;
	}

	update(d) {
		// update the bullets
		this.bullets.forEach(bullet => bullet.update(d));
	}

	toJSON() {
		let json = this.bullets.map(bullet => bullet.toJSON());

		this.emit("to-json", json);
		return json;
	}

	fromJSON(json) {
		this.clearBullets();

		json.forEach(data => {
			let bullet = this.createBullet(data.type);
			bullet.fromJSON(data.data);
		});

		this.emit("from-json", json);
		return this;
	}

	getBulletType(bullet) {
		for (let id in BulletManager.BulletTypes) {
			if (bullet instanceof BulletManager.BulletTypes[id]) return id;
		}
	}
}

BulletManager.BulletTypes = {
	default: DefaultBullet,
};
BulletManager.BULLET_TYPE = {
	DEFAULT: "default",
};
