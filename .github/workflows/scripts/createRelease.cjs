module.exports = async ({github, context, core, exec}, { tagName, tagSha }) => {
    console.log("Getting tag info...")
    const tagInfo = await github.rest.git.getTag({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_sha: tagSha,
    });

    console.log(`Creating a release at tag: ${ tagName }...`);
    await github.rest.repos.createRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: tagName,
        name: tagName,
        body: tagInfo.message,
    });
};
