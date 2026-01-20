const jobs = [
  { title: "Frontend Developer", company: "TechWave", location: "New York, NY" },
  { title: "Backend Engineer", company: "CodeBase Inc.", location: "San Francisco, CA" },
  { title: "UI/UX Designer", company: "DesignPro", location: "Remote" },
  { title: "Project Manager", company: "BuildRight", location: "Austin, TX" },
  { title: "Full Stack Developer", company: "DevHub", location: "Seattle, WA" }
];

const jobListings = document.getElementById("job-listings");
const searchInput = document.getElementById("search");

function displayJobs(jobArray) {
  jobListings.innerHTML = "";
  jobArray.forEach(job => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("card", "shadow-sm", "mb-4");

    jobCard.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-primary">${job.title}</h5>
        <p class="card-text"><strong>Company:</strong> ${job.company}</p>
        <p class="card-text"><strong>Location:</strong> ${job.location}</p>
        <a href="#" class="btn btn-dark">Apply Now</a>
      </div>
    `;

    jobListings.appendChild(jobCard);
  });
}

// Load jobs initially
displayJobs(jobs);

// Filter jobs
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(keyword) ||
    job.company.toLowerCase().includes(keyword)
  );
  displayJobs(filtered);
});
// ==================== LOGIN REDIRECT FOR APPLY ====================
window.addEventListener("load", () => {
  const user = localStorage.getItem("loggedInUser");

  // If not logged in
  if (!user) {
    const buttons = document.querySelectorAll(".btn.btn-dark");

    buttons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("⚠️ Please login to apply for jobs!");
        window.location.href = "login.html";
      });
    });
  }
});
