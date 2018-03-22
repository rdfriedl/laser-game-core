import { Emitter } from "regexp-events";
import Bullet from "./Bullet";

describe("Bullet", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Bullet);
	});
});
