$(document).ready(() => {
  loadResources("http://localhost:8080/api/");
  loadCategories();
});

//serialize object is a helper function for jquery to convert .serialize to a useable object
$.fn.serializeObject = function() {
  var o = {};
  this.find("[name]").each(function() {
    o[this.name] = this.value;
  });
  return o;
};

const upvote = id => {
  $.ajax({
    url: "http://localhost:8080/api/upvote/" + id,
    type: "POST",
    dataType: "JSON"
  });
};

const downvote = id => {
  $.ajax({
    url: "http://localhost:8080/api/downvote/" + id,
    type: "POST",
    dataType: "JSON"
  });
};

const addResource = id => {
  $.ajax({
    url: `http://localhost:8080/api/my_liked_resources/` + id,
    dataType: "JSON",
    type: "POST"
  });
};

const loadCategories = () => {
  try {
    $.ajax({
      url: `http://localhost:8080/api/categories/`,
      dataType: "JSON",
      success: data => {
        $("#pageSubmenu").empty();
        renderCategories(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
const removeResource = id => {
  $.ajax({
    url: `/api/my_liked_resources/` + id,
    dataType: "JSON",
    type: "DELETE"
  });
};

//Initial loading of resources
//loadResources makes get request to our API that queries the DB and returns a json object
const loadResources = async url => {
  try {
    await $.ajax({
      url: url,
      dataType: "JSON",
      success: data => {
        renderResources(data);
        console.log(data);
        $(".fa-arrow-up").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const upvoted = $(e.currentTarget).attr("data-upvote");
          if (upvoted === "false") {
            upvote(resourceID);
            $(`.upvote.${resourceID}`).attr("data-upvote", "true");
            $(`.downvote.${resourceID}`).attr("data-downvote", "false");
          }
        });
        $(".fa-arrow-down").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const downvoted = $(e.currentTarget).attr("data-downvote");
          if (downvoted === "false") {
            downvote(resourceID);
            $(`.downvote.${resourceID}`).attr("data-downvote", "true");
            $(`.upvote.${resourceID}`).attr("data-upvote", "false");
          }
        });
        $(".add-to-my-resources").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          console.log(resourceID);
          const addedToResource = $(e.currentTarget).attr("data-activity");

          if (addedToResource === "false") {
            addResource(resourceID);
            $(`.add-to-my-resources.${resourceID}`).attr(
              "data-activity",
              "true"
            );
          } else if (addedToResource === "true") {
            removeResource(resourceID);
            $(`.add-to-my-resources.${resourceID}`).attr(
              "data-activity",
              "false"
            );
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

$("#search-category").on("submit", async function(event) {
  event.preventDefault();

  let formObject = await $(this).serializeObject();
  console.log(formObject);
  loadResources("http://localhost:8080/r/" + formObject.categories);
});

$("#newresource").on("submit", async function(event) {
  let formObject = await $(this).serializeObject();
  formObject.name = "You";
  formObject.date_created = "Just now";
  $("#resourcescontainer").append(createResourceElement(formObject));
  $("#modal-create-new").modal("hide");
  loadModal();
});

$("#new-comment").on("submit", async function(event) {
  event.preventDefault();
  let classes = $("#resource-id")
    .attr("class")
    .split(" ");
  let resourceid = classes[classes.length - 1];
  let commentformObject = await $(this).serializeObject();
  commentformObject.user_name = "You just posted";

  $(".resource-comment-container").prepend(
    createCommentElement(commentformObject)
  );

  try {
    await $.ajax({
      url: "http://localhost:8080/api/c/" + resourceid,
      dataType: "JSON",
      type: "POST",
      data: commentformObject
    });
  } catch (err) {
    console.log(err);
  }
});

//Helper function for loadResources that renders the array of resources passed into it and appends it to the container
function renderResources(resources) {
  $("#resourcescontainer").empty();
  resources.forEach(resource =>
    $("#resourcescontainer").append(createResourceElement(resource))
  );
  loadModal();
}
function renderCategories(resources) {
  $("#pageSubmenu").empty();
  resources.forEach(resource =>
    $("#pageSubmenu").append(createCategoryElement(resource))
  );
  $(".categoryname").on("click", e => {
    let category = e.currentTarget.innerHTML;
    loadResources(`http://localhost:8080/r/${category}`);
  });
}
//! THIS NEEDS TO BE STYLED AND FORMATTED ACCORDING TO UI FRAMEWORK
//helper function that creates individual resource element
// id= "resources" <-- kept in case this was used somewhere else
let counter = 0;
const createResourceElement = resourceData => {
  const resource = `
  <section class="resources card" id="c${counter++}">
    <div id="${escape(resourceData.name)}"></div>
    <div id="${escape(resourceData.id)}"></div>
    <div class="resourceImg">
    <img src="${escape(
      resourceData.cover_photo_url ? resourceData.cover_photo_url : ""
    )}" class = "card-img-top resource-img"></img>
      <div class="urlinfo hide" id="u${counter++}">
        <p class= "url-title">${escape(resourceData["url_title"])}</p>
        <p class = "url-description">${escape(
          resourceData["url_description"]
        )}</p>
        <p class = "url-link">${escape(resourceData.link)}</p>
      </div>
    </div>
    <div class='textbody card-body'>
      <h5 class = 'card-title'>${escape(resourceData.title)}</h5>
      <p class = 'description'>${escape(resourceData.description)}</p>
    </div>
    <div class="resource-stats">
      <p class="resource-timestamp">${resourceData.date_created} </p>
      <form>
        <div class="arrows">
          <i class="fas fa-plus add-to-my-resources ${resourceData.id}"
          data-activity = ${resourceData.add_to_my_resources}></i>
          <i class="fas fa-arrow-up upvote ${resourceData.id}"
          data-upvote = ${resourceData.upvote} id="up-vote"></i>
          <i class="fas fa-arrow-down downvote ${resourceData.id}"
          data-downvote = ${resourceData.downvote} id="down-vote"></i>
        </div>
    </form>
  </div>
  </section>
  `;
  return $(resource);
};

//escape function makes text safe and prevents injection
function escape(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function loadModal() {
  $(".resources").on("click", function(e) {
    let title = $(this)
      .children(".card-body")
      .children(".card-title")
      .text();

    let image = $(this)
      .children(".resourceImg")
      .children(".resource-img")
      .attr("src");

    let description = $(this)
      .children(".card-body")
      .children(".description")
      .text();

    let urlTitle = $(this)
      .children(".resourceImg")
      .children(".urlinfo")
      .children(".url-title")
      .text();

    let urlDescription = $(this)
      .children(".resourceImg")
      .children(".urlinfo")
      .children(".url-description")
      .text();

    let urlLink = $(this)
      .children(".resourceImg")
      .children(".urlinfo")
      .children(".url-link")
      .text();

    console.log(urlLink);
    $("#modal-clicked-resource").on("show.bs.modal", function() {
      let resourceID = e.currentTarget.children[1].id;
      $(".resource-modal-title").text(title);

      $(".modal-body").children($(".clicked-resource-img").attr("src", image));
      $("#resource-id").removeClass();
      $("#resource-id").addClass(resourceID);
      $(".modal-description").text(description);
      $("#resource-owner").text(e.currentTarget.children[0].id);
      $(".modal-body").children(
        $(".resource-content")
          .children($(".clicked-url-link"))
          .attr("href", urlLink)
      );

      $(".modal-url-title").text(urlTitle);
      $(".modal-url-description").text(urlDescription);

      $(".close-button").on("click", () => {
        $("#modal-clicked-resource").modal("hide");
      });
    });
    $("#modal-clicked-resource").modal();
    let resourceID = e.currentTarget.children[1].id;
    loadComments(resourceID);
  });
}

const urlPreview = (urlTitle, urlDescription) => {
  return (urlcontent = `
  <div class = "url-preview-container">
  <h5 class= "url-preview-title>${escape(urlTitle)}</h5>
  <p class= "url-preview-description>${escape(urlDescription)}</p>
  </div>`);
};

async function loadComments(resourceid) {
  try {
    await $.ajax({
      url: `http://localhost:8080/api/c/${resourceid}`,
      dataType: "JSON",
      success: data => {
        $(".resource-comment-container").empty();
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
      <p class="commenter">${escape(commentData.user_name)}</p>
      <p>${escape(commentData.comment)}</p>
    </section>
  `;
  return $(comment);
}

function createCategoryElement(categoryData) {
  const category = `
  <li class="categoryname hover-show">${categoryData.name}
  </li>
  `;
  return $(category);
}
