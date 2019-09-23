$(document).ready(() => {
  loadResources().then(() => {
    $(".fa-arrow-up").on("click", () => {
      console.log("clicked!");
    });
  });
});

$.fn.serializeObject = function() {
  var o = {};
  this.find("[name]").each(function() {
    o[this.name] = this.value;
  });
  return o;
};

//Initial loading of resources
//loadResources makes get request to our API that queries the DB and returns a json object
async function loadResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/",
      dataType: "JSON",
      success: data => {
        renderResources(data);
      }
    }).then(() => {
      $("#up-vote").on("click", () => {
        console.log("clicked!");
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$("form").on("submit", async function(event) {
  //var formData = await JSON.stringify($(this).serializeArray());
  let formObject = await $(this).serializeObject();
  $("#resourcescontainer").append(createResourceElement(formObject));
  // $("#resourcescontainer").append(createResourceElement(data));
  loadModal();
});

//Helper function for loadResources that renders the array of resources passed into it and appends it to the container
function renderResources(resources) {
  resources.forEach(resource =>
    $("#resourcescontainer").append(createResourceElement(resource))
  );
  loadModal();
}

//! THIS NEEDS TO BE STYLED AND FORMATTED ACCORDING TO UI FRAMEWORK
//helper function that creates individual resource element
// id= "resources" <-- kept in case this was used somewhere else
let counter = 0;
function createResourceElement(resourceData) {
  const resource = `
  <section class="resources card" id="${counter++}">
    <div class="resourceImg">
      <img src="${escape(
        resourceData.cover_photo_url ? resourceData.cover_photo_url : ""
      )}" class = "card-img-top resource-img"></img>
    </div>
    <div class='textbody card-body'>
      <h5 class = 'card-title'>${escape(resourceData.title)}</h5>
      <p class = 'description'>${escape(resourceData.description)}</p>
    </div>
    <div class="resource-stats">
      <p class="resource-timestamp">Date here </p>
      <form>
        <div class="arrows">
          <i class="fas fa-plus" id="add-to-my-resources"></i>
          <i class="fas fa-arrow-up" id="up-vote"></i>
          <i class="fas fa-arrow-down " id="down-vote"></i>
        </div>
    </form>
  </div>
  </section>
  `;
  return $(resource);
}
//escape function makes text safe and prevents injection
function escape(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function loadModal() {
  $(".resources").on("click", function() {
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

    $("#modal-clicked-resource").on("show.bs.modal", function() {
      $(".resource-modal-title").text(title);

      $(".modal-body").children($(".clicked-resource-img").attr("src", image));
      $(".modal-description").text(description);

      $(".close-button").on("click", () => {
        $("#modal-clicked-resource").modal("hide");
      });
    });
    $("#modal-clicked-resource").modal();
  });
}
