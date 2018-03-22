import { Emitter } from "regexp-events";
import Player from "./Player";

describe("Player", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Player);
	});
});
