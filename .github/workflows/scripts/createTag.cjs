module.exports = async ({github, context, core, exec}, { newVersionNumber, releaseNotes }, { mergeCommitSha }) => {
    console.log("Creating a tag...");
    const versionName = `v${ newVersionNumber }`;
    const { data: tagObject } = await github.rest.git.createTag({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag: versionName,
        message: `${ versionName }\n\n${ releaseNotes }`,
        object: mergeCommitSha,
        type: "commit",
        tagger: {
            name: "chumpchief-release-bot[bot]",
            email: "166319868+chumpchief-release-bot[bot]@users.noreply.github.com",
        },
    });
    console.log(`Annotated tag object created, SHA: ${ tagObject.sha }`);
    console.log("Creating the tag ref...");
    await github.rest.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/tags/${ versionName }`,
        sha: tagObject.sha,
    });

    return {
        tagName: versionName,
        tagSha: tagObject.sha,
    };
};
