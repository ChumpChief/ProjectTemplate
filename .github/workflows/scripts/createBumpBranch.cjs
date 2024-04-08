module.exports = async ({github, context, core, exec}) => {
    if (!context.ref.includes("refs/heads/")) {
        throw new Error("Expected a branch!");
    }
    const baseBranchName = context.ref.replace("refs/heads/", "");
    const bumpBranchName = `bump/${ baseBranchName }`;

    // Check if the bump branch already exists
    const branchExists = (await exec.exec("git",  ["show-ref", "--quiet", `refs/heads/${ bumpBranchName }`], { ignoreReturnCode: true })) === 0;
    if (branchExists) {
        // Check out the existing bump branch and reset it to the latest head
        console.log(`Branch ${ bumpBranchName } already exists, resetting it to ${ context.sha }...`);
        await exec.exec("git checkout", [bumpBranchName]);
        await exec.exec("git reset", ["--hard", context.sha]);
    } else {
        // Create the branch and check it out
        console.log(`Creating branch ${ bumpBranchName }...`);
        await exec.exec("git checkout", ["-b", bumpBranchName]);
    }

    console.log("Bumping the version...");
    // TODO: Some reasonable behavior if there are no new changesets, exit safely and quietly?
    await exec.exec("pnpm changeset version");
    const newVersionNumber = Date.now();
    // TODO: Determine whether to get release notes here or later
    const releaseNotes = "something changed";

    // Commmit changes
    console.log("Committing the bump...");
    await exec.exec("git add", ["."]);
    await exec.exec("git config", ["--global", "user.name", '"chumpchief-release-bot[bot]"']);
    await exec.exec("git config", ["--global", "user.email", '"166319868+chumpchief-release-bot[bot]@users.noreply.github.com"']);
    await exec.exec("git commit", ["-m", `Version bump on ${ baseBranchName }`]);

    // Push the branch
    console.log("Pushing the bump commit...");
    if (branchExists) {
        // Need to force if we're updating an existing branch
        await exec.exec("git push", ["origin", "-f", bumpBranchName]);
    } else {
        await exec.exec("git push", ["origin", bumpBranchName]);
    }

    return {
        baseBranchName,
        bumpBranchName,
        newVersionNumber,
        releaseNotes,
    };
};
