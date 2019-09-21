$(document).ready(() => {
  loadResources();

  $('#resources').on(click, () => {
    console.log($('.resourceImg').html());
  })
});

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
    });
  } catch (err) {
    console.log(err);
  }
}

$("form").on("submit", async function(event) {
  event.preventDefault();

  //var formData = await JSON.stringify($(this).serializeArray());
  let queryString = await $(this).serialize();
  console.log(queryString);

  try {
    console.log("trying to ajax");
    $.ajax({
      type: "POST",
      url: "/api/input",
      data: queryString,
      success: function(data) {
        console.log(data);
        console.log("ajax success");
        $("#resourcescontainer").append(createResourceElement(data));
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Helper function for loadResources that renders the resources passed into it and appends it to the container
function renderResources(resources) {
  resources.forEach(resource =>
    $("#resourcescontainer").append(createResourceElement(resource))
  );
}

//! THIS NEEDS TO BE STYLED AND FORMATTED ACCORDING TO UI FRAMEWORK
//helper function that creates individual resource element
function createResourceElement(resourceData) {
  const resource = `
  <section class="resources card " id= "resources"  data-toggle="modal" data-target="#modal-clicked-resource">
    <div class="resourceImg">
      <img src="${escape(
        resourceData.cover_photo_url
      )}" class = "card-img-top resource-img"></img>
    </div>
    <div class='textbody card-body'>
      <h5 class = 'card-title'>${escape(resourceData.title)}</h5>
      <p>${escape(resourceData.description)}</p
    </div>
    <div class="resource-stats">
      <p class="resource-timestamp">Date here </p>
      <form>
        <div class="arrows">
          <i class="fas fa-arrow-up " id="up-vote"></i>
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
