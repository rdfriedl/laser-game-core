import { Emitter } from "regexp-events";
import Game from "../src/Game";

describe("Game", function() {
	it("extends Emitter", function() {
		let game = new Game();
		expect(game).to.be.instanceOf(Emitter);
	});
});
