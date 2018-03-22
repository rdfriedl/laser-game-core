import { Emitter } from "regexp-events";
import Tilemap from "./Tilemap";

describe("Tilemap", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Tilemap);
	});
});
