const maxWaitTimeMs = 10 * 60 * 1000; // 10 minutes
const checkFrequencySeconds = 5;
module.exports = async ({github, context, core, exec}, { prNumber }) => {
    const timeoutTime = Date.now() + maxWaitTimeMs;
    console.log(`${new Date().toLocaleString()}: Waiting for bump PR #${ prNumber } to be merged, will give up at ${ new Date(timeoutTime).toLocaleString() }`);

    while (Date.now() < timeoutTime) {
        // Get the PR so we can check its state
        const { data: pullRequest } = await github.rest.pulls.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: prNumber,
        });

        // If the PR was merged, we're done waiting and can return
        if (pullRequest.merged) {
            console.log(`${new Date().toLocaleString()}: PR merged!  Commit: ${ pullRequest.merge_commit_sha }`);
            return {
                mergeCommitSha: pullRequest.merge_commit_sha,
            };
        }

        // If the PR is closed but not merged we don't know what to do, so throw an error
        if (pullRequest.state === "closed") {
            throw new Error("PR closed without merging");
        }

        // Otherwise the PR is still open and we should keep checking
        console.log(`${new Date().toLocaleString()}: PR #${ prNumber } still open, waiting ${ checkFrequencySeconds } seconds...`);
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, checkFrequencySeconds * 1000);
        });
    }

    // If the PR isn't merged before the timeout, give up and throw an error
    throw new Error("PR not merged in time");
};
