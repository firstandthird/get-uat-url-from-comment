const { getInput, info, setOutput } = require("@actions/core");
const { GitHub, context } = require("@actions/github");

async function Runner() {
  const token = getInput("github-token");
  const searchDomain = getInput("search-domain");

  info(`Looking for comments that contain urls matching: ${searchDomain}`);

  const octokit = new GitHub(token);

  const { data: comments } = await octokit.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: payload.pull_request.number,
    per_page: 100,
  });

  const matchingComment = comments
    .map((comment) => comment.body)
    .find((comment) => comment.includes(searchDomain));

  const [url] = matchingComment.match(/(http?:\/\/[^\s]+)/gi);

  setOutput("url", url ?? "");
}

Runner();
