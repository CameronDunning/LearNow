-- Comments Tables Seeds
INSERT INTO comments
  (user_id, resource_id, comment, upvote, date_created)
VALUES
  (2, 1, 'Daaaaamn Erl', true, Now()),
  (2, 2, 'I graduated from science', true, Now());

INSERT INTO comments
  (user_id, resource_id, downvote, date_created)
VALUES
  (1, 4, true, Now()),
  (3, 5, true, Now());

INSERT INTO comments
  (user_id, resource_id, comment, upvote, date_created)
VALUES
  (2, 5, 'You should refactor this', true, Now()),
  (5, 6, 'This deserves an upvote', true, Now());


