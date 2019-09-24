-- Select each resource and whether the user who has signed in has upvoted, downvoted, and added to their resources
-- Only works if they are signed in

SELECT *, upvote, downvote, add_to_my_resources
FROM resources JOIN comments ON resources.id=resource_id
WHERE comments.user_id=$1
LIMIT 10;
