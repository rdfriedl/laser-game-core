import { Emitter } from "regexp-events";
import BulletManager from "./BulletManager";

describe("BulletManager", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(BulletManager);
	});
});
