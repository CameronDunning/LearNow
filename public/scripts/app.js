$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done(users => {
    for (user of users) {
      $("<div>")
        .text(user.name)
        .appendTo($("body"));
    }
  });
});

$(document).ready(() => {
  loadResources();
});

async function loadResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/:category",
      dataType: "JSON",
      success: data => {
        renderResource(data);
      }
    });

    // .then(data => renderTweets(data));
  } catch (err) {
    console.log(err);
  }
}

//! THIS NEEDS TO BE STYLED AND FORMATTED ACCORDING TO UI FRAMEWORK
function createResourceElement(resourceData) {
  console.log(resourceData);
  const resource = `
  <section class="resources">
    <div class="resourceImg">
      <img href="${escape(resourceData.___)}"></img>
    </div>
    <div class='textbody'>
      <p>Title</p>
      <form>
          <button class="favorite styled" value="upvote" type="button">
            UPVOTE
          </button>
          <button class="favorite styled" value="downvote" type="button">
            DOWNVOTE
          </button>
      </form>
    </div>
  </section>
  `;
  return $(resource);
}

//escape function makes text safe and prevents injection
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
