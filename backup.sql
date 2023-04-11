-- manual linking
UPDATE equipments SET partyroom_id=5 WHERE equipments.id=5;

-- insert into equipments (equipment_in_service, switch_game, board_game) values ('air-condition', 'mario', 'monopoly');
-- insert into equipments (equipment_in_service, switch_game, board_game) values ('TV', '', 'card);

-- select from joining multiple tables.
-- SELECT * FROM partyrooms
-- 	INNER JOIN equipments
-- 		ON partyrooms.id = equipments.partyroom_id;

-- Drop eq_rm_relation;
DROP TABLE IF EXISTS eq_rm_relation;