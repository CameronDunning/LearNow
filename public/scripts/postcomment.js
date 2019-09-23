loadComments();

async function loadComments() {
  try {
    await $.ajax({
      url: `http://localhost:8080/api/c/${resourceid}`,
      dataType: "JSON",
      success: data => {
        renderComments(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function renderComments(comments) {
  resources.forEach(comment =>
    $("resource-comment-container").append(createCommentElement(comment))
  );
}

function createCommentElement(commentData) {
  const resource = `
    <section class="comment">
      <p class="commenter">${escape(commentData.user_id)}</p>
      <p>${escape(commentData.text)}</p>
    </section>
  `;
  return $(comment);
}
