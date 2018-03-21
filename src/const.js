const COLLISION_GROUPS = {
	PLAYER: Math.pow(2, 0),
	WALLS: Math.pow(2, 1),
	BULLET: Math.pow(2, 2),
};

COLLISION_GROUPS.ALL = Object.keys(COLLISION_GROUPS)
	.map(key => COLLISION_GROUPS[key])
	.reduce((a, b) => a | b);

export { COLLISION_GROUPS };
