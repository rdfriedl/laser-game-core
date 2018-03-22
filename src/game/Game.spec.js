import { Emitter } from "regexp-events";
import Game from "./Game";

describe("Game", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Game);
	});
});
