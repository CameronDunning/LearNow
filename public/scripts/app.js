$(document).ready(() => {
  loadResources();
  console.log("done loading");
});

//loadResources makes get request to our API that queries the DB and returns a json object
async function loadResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/",
      dataType: "JSON",
      success: data => {
        console.log("hello success");
        renderResources(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

//Renderresources function renders ALL resources and appends it to the container
function renderResources(resources) {
  console.log("Hello inside resources", resources);
  resources.forEach(resource =>
    $("#resourcescontainer").append(createResourceElement(resource))
  );
}

//! THIS NEEDS TO BE STYLED AND FORMATTED ACCORDING TO UI FRAMEWORK
//helper function that creates individual resource element
function createResourceElement(resourceData) {
  console.log(resourceData);

  const resource = `
  <section class="resources card">
    <div class="resourceImg">
      <img src="${escape(resourceData.cover_photo_url)}" class = "card-img-top resource-img"></img>
    </div>
    <div class='textbody card-body'>
      <p>${escape(resourceData.title)}</p>
      <p>${escape(resourceData.description)}</p
      <form>

          <i class="fas fa-arrow-up" id="up-vote"></i>
          <i class="fas fa-arrow-down" id="down-vote"></i>

      </form>
    </div>
  </section>
  `;
  return $(resource);
}

//escape function makes text safe and prevents injection
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
