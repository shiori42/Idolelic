-- ダミー聖地（グループA〜C / legacy_id 1〜7）を削除
DELETE FROM community_spots
WHERE legacy_id IN ('1', '2', '3', '4', '5', '6', '7')
   OR group_name IN ('グループA', 'グループB', 'グループC');
