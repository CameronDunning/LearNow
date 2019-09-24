async function loadComments(resourceid) {
  try {
    await $.ajax({
      url: `http://localhost:8080/api/c/${resourceid}`,
      dataType: "JSON",
      success: data => {
        //console.log(data);
        renderComments(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function renderComments(comments) {
  comments.forEach(comment => {
    $(".resource-comment-container").append(createCommentElement(comment));
  });
}

function createCommentElement(commentData) {
  const comment = `
    <section class="comment">
      <p class="commenter">${escape(commentData.user_id)}</p>
      <p>${escape(commentData.comment)}</p>
    </section>
  `;
  return $(comment);
}
