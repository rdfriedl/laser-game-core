import { Emitter } from "regexp-events";
import Bullet from "./Bullet";

describe("Bullet", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Bullet);
	});

	describe("constructor", () => {
		it("sets the bullets id", () => {
			let bullet = new Bullet();

			bullet.should.have.any.keys(["id"]);
		});
	});
});
