import { Emitter } from "regexp-events";
import PlayerManager from "./PlayerManager";

describe("PlayerManager", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(PlayerManager);
	});
});
