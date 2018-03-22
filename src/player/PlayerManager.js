import { Emitter } from "regexp-events";
import Player from "./Player";

export default class PlayerManager extends Emitter {
	constructor(game) {
		super();

		this.game = game;
		this.players = [];
	}

	getPlayer(id) {
		if (id instanceof Player) return this.players.includes(id) ? id : undefined;
		else return this.players.find(player => player.id === id);
	}

	createPlayer(info, props) {
		let player = new Player(this, info, props);

		// add the player to the list of players
		this.players.push(player);
		// add the player to the world
		this.game.world.addBody(player.body);

		this.emit("player-created", player);
		return player;
	}

	createFromJSON(json) {
		let player = new Player(this, json.info, json.props);
		player.fromJSON(json);

		// add the player to the list of players
		this.players.push(player);
		// add the player to the world
		this.game.world.addBody(player.body);

		this.emit("player-created", player);
		return player;
	}

	removePlayer(id) {
		let player = this.getPlayer(id);
		if (this.players.includes(player)) {
			// remove player from the list
			this.players.splice(this.players.indexOf(player), 1);
			// remove the player from the world
			this.game.world.removeBody(player.body);

			this.emit("player-removed", player);
		}
		return this;
	}

	clearPlayers() {
		let players = Array.from(this.players);
		this.players.forEach(this.removePlayer.bind(this));
		this.emit("players-cleared", players);
		return this;
	}

	update(d) {
		this.players.forEach(player => player.update(d));
	}

	toJSON() {
		let json = this.players.map(player => player.toJSON());
		this.emit("to-json", json);
		return json;
	}

	fromJSON(json) {
		this.clearPlayers();
		json.forEach(data => {
			let player = this.createPlayer();
			player.fromJSON(data);
		});
		this.emit("from-json", json);
		return this;
	}
}
