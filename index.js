const { getInput, info, setOutput } = require("@actions/core");
const github = require("@actions/github");

async function Runner() {
  const token = getInput("github-token");
  const searchDomain = getInput("search-domain");

  info(`Looking for comments that contain urls matching: ${searchDomain}`);

  const octokit = github.getOctokit(token);

  const context = github.context;

  const { data: comments } = await octokit.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
    per_page: 100,
  });

  const matchingComment = comments
    .map((comment) => comment.body)
    .find((comment) => comment.includes(searchDomain));


  if (typeof matchingComment !== "string" && matchingComment.length > 0) {
    setOutput("url", "");
    return;
  }

  const [url] = matchingComment.match(
    /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/gi
  );

  setOutput("url", url ?? "");
}

Runner();
