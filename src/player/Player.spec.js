import { Emitter } from "regexp-events";
import Player from "./Player";

describe("Player", () => {
	it("should extend Emitter", () => {
		Emitter.isPrototypeOf(Player);
	});

	describe("constructor", () => {
		it("sets the players id", () => {
			let player = new Player();

			player.should.have.any.keys(["id"]);
		});
	});
});
