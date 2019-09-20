$(document).ready(() => {
  loadResources();
});

//Renderresources function renders ALL resources and appends it to the container
function renderResources(resources) {
  let resourcesArr = [];
  resources.forEach(resource =>
    resourcesArr.append(createResourceElement(resource))
  );
  $("#resourcescontainer").append;
}

//loadResources makes get request to our API that queries the DB and returns a json object
async function loadResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/:category",
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
//helper function that creates individual resource element
function createResourceElement(resourceData) {
  console.log(resourceData);
  const resource = `
  <section class="resources">
    <div class="resourceImg">
      <img href="${escape(resourceData.title)}"></img>
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
