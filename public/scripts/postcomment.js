// $(document).ready(() => {
//   loadResources();
//   console.log("loading comments");
// });
let loadcomments = () => {
  loadResources();
  async function loadResources() {
    try {
      await $.ajax({
        url: `http://localhost:8080/api/c/${resourceid}`,
        dataType: "JSON",
        success: data => {
          renderResources(data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  function renderResources(resources) {
    resources.forEach(resource =>
      $("resourcecommentcontainer").append(createResourceElement(resource))
    );
  }

  function createResourceElement(resourceData) {
    const resource = `
    <section class="comment">
      <p class="commenter">${escape(resourceData.user_id)}</p>
      <p>${escape(resourceData.text)}</p>
    </section>
  `;
    return $(resource);
  }
};
module.exports = loadcomments;
