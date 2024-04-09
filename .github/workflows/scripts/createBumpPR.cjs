module.exports = async ({github, context, core, exec}, { baseBranchName, bumpBranchName, releaseNotes }, dryRun) => {
    // Check if the bump PR already exists
    const { data: existingPullRequests } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open",
        head: `${ context.repo.owner }:${ bumpBranchName }`,
        base: baseBranchName,
    });
    if (existingPullRequests.length === 0) {
        // Create a new PR
        console.log("Creating a PR...");
        let prBody = "";
        if (dryRun) {
            prBody += "# THIS PR IS FOR A DRY RUN - DO NOT MERGE\n\n";
        }
        prBody += releaseNotes;

        const { data: newPullRequest } = await github.rest.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            head: bumpBranchName,
            base: baseBranchName,
            title: `Version bump on ${ baseBranchName }${ dryRun ? " (DRY RUN)" : "" }`,
            body: prBody,
            draft: dryRun,
        });

        console.log(`Opened PR #${newPullRequest.number}`);
        return {
            prNumber: newPullRequest.number,
        };
    } else {
        // Do nothing, reuse the existing PR
        console.log(`Bump PR #${ existingPullRequests[0].number } is already open for branch ${ baseBranchName }`)
        return {
            prNumber: existingPullRequests[0].number,
        };
    }
};
