module.exports = async ({github, context, core, exec}, dryRun) => {
    if (!context.ref.includes("refs/heads/")) {
        throw new Error("Expected a branch!");
    }
    const baseBranchName = context.ref.replace("refs/heads/", "");
    const bumpBranchName = `bump/${ baseBranchName }${ dryRun ? "-DO_NOT_MERGE" : "" }`;

    // Check if the bump branch already exists
    const branchExists = (await exec.exec("git show-ref",  ["--quiet", `refs/heads/${ bumpBranchName }`], { ignoreReturnCode: true })) === 0;
    // TODO: Maybe don't permit proceeding if the branch exists?  Definitely not in dry-run mode.
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

    // Commmit changes
    console.log("Committing the bump...");
    await exec.exec("git add", ["."]);
    await exec.exec("git config", ["--global", "user.name", '"chumpchief-release-bot[bot]"']);
    await exec.exec("git config", ["--global", "user.email", '"166319868+chumpchief-release-bot[bot]@users.noreply.github.com"']);
    await exec.exec("git commit", ["-m", `Version bump on ${ baseBranchName }`]);

    let diffOutput = "";
    await exec.exec(
        "git diff-tree",
        ["--no-commit-id", "--name-only", "-r", "HEAD", "--", "./**/package.json"],
        {
            listeners: {
                stdout: (data) => {
                    diffOutput += data.toString();
                },
            },
        },
    );
    const packageJsonsChanged = diffOutput.trim().split("\n");
    console.log("Changed package JSONS:");
    console.log(packageJsonsChanged);

    const readJsonableFile = async (filePath) => {
        let fileText = "";
        await exec.exec(
            "cat",
            [filePath],
            {
                listeners: {
                    stdout: (data) => {
                        fileText += data.toString();
                    },
                },
            },
        );
        return JSON.parse(fileText);
    };
    console.log(`Getting version number from ${ packageJsonsChanged[0] }`);
    const newVersionNumber = (await readJsonableFile(packageJsonsChanged[0])).version;
    console.log(`Version number: ${ newVersionNumber }`);

    let releaseNotes = "Updates can be found in the changelogs for each package:\n";
    for (const packageJsonPath of packageJsonsChanged) {
        console.log(`Reading name of ${ packageJsonPath }`);
        const packageName = (await readJsonableFile(packageJsonPath)).name;
        const changelogPath = packageJsonPath.replace("package.json", "CHANGELOG.md");
        releaseNotes += `* ${ packageName }: ([changelog](${ changelogPath }))\n`;
    };

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
