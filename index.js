const { getInput, info, setOutput } = require("@actions/core");
const github = require("@actions/github");

async function Runner() {
  const token = getInput("github-token");
  const searchDomain = getInput("search-domain");

  info(`Looking for comments that contain urls matching: ${searchDomain}`);

  const octokit = github.getOctokit(token);

  const context = github.context;

  const issueNumber =
    context?.payload?.pull_request?.number || context?.payload?.issue?.number;

  if (!issueNumber) {
    console.log("No issue or pull request found");
    setOutput("url", url ?? "");
    return;
  }

  const { data: comments } = await octokit.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    per_page: 100,
  });

  console.log("All Comments", comments);

  const matchingComment = comments
    .map((comment) => comment.body)
    .find((comment) => comment.includes(searchDomain));

  console.log("Matching Comment", matchingComment);

  if (typeof matchingComment !== "string") {
    setOutput("url", "");
    return;
  }

  const [url] = matchingComment?.match(
    /https?:\/\/([\w+?\.\w+])+([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?/gi
  ) || [""];

  console.log("Found url:", url ?? "NO URL FOUND");

  setOutput("url", url ?? "");
}

Runner();
